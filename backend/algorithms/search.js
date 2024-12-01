import fs from 'fs';
import path from 'path';
import os from 'os';
import { Cluster } from 'puppeteer-cluster';
import mute_model from '../models/mmute.js';
import addSearchLocation from '../controllers/csearchLocation.js';
import newsProvidermodel from '../models/mnewsProvider.js';



const findChromeUserDataDir = () => {
  let possiblePaths = [];

  if (process.platform === 'win32') {
    const localAppData = process.env.LOCALAPPDATA;
    const appData = process.env.APPDATA;
    const username = process.env.USERNAME || os.userInfo().username;

    if (localAppData) {
      possiblePaths.push(path.join(localAppData, 'Google', 'Chrome', 'User Data'));
    }
    if (appData) {
      possiblePaths.push(path.join(appData, 'Google', 'Chrome', 'User Data'));
    }
    possiblePaths.push(path.join('C:', 'Users', username, 'AppData', 'Local', 'Google', 'Chrome', 'User Data'));
  } else if (process.platform === 'darwin') {
    possiblePaths.push(path.join(os.homedir(), 'Library', 'Application Support', 'Google', 'Chrome'));
  } else {
    possiblePaths.push(path.join(os.homedir(), '.config', 'google-chrome'));
  }

  for (const dir of possiblePaths) {
    if (fs.existsSync(dir)) {
      return dir;
    }
  }

  console.log('Could not find Chrome user data directory');
  return null;
};

/**
 * Extracts structured data (title, link, etc.) from a webpage.
 * @param {object} page Puppeteer page object.
 * @returns {Array} Array of extracted articles.
 */
const scanForLinks = async (page) => {
  const element = await page.$('div.SoaBEf');
  if (!element) {
    return [];
  }

  await page.waitForSelector('div.SoaBEf div.SoAPf div.MgUUmf.NUnG9d');

  const articles = await page.$$eval('div.SoaBEf', (articles) =>
    articles.map((article) => {
      const titleElement = article.querySelector('div.SoAPf div.n0jPhd.ynAwRc.MBeuO.nDgy9d');
      const linkElement = article.querySelector('a.WlydOe');
      const imgURLElement = article.querySelector('div.gpjNTe div.YEMaTe.JFSfwc div.uhHOwf.BYbUcd img');
      const timeElement = article.querySelector('div.SoAPf div.OSrXXb.rbYSKb.LfVVr');
      const providerImgElement = article.querySelector('div.SoAPf div.MgUUmf.NUnG9d g-img.QyR1Ze.ZGomKf img');
      const providerNameElement = article.querySelector('div.SoAPf div.MgUUmf.NUnG9d span');
      const someTextElement = article.querySelector('div.SoAPf div.GI74Re.nDgy9d');

      return {
        title: titleElement?.textContent.trim() || null,
        someText: someTextElement?.textContent || null,
        link: linkElement?.getAttribute('href') || null,
        imgURL: imgURLElement?.getAttribute('src') || null,
        time: timeElement?.textContent || null,
        providerImg: providerImgElement?.getAttribute('src') || null,
        providerName: providerNameElement?.textContent || null,
      };
    })
  );

  return articles.filter((article) => article !== null);


  
};


const Scrap = async ({ searchText, site, tbs, gl, location, page, mutedSite }) => {
if (site) site = `+site:${site}`;
if (tbs) tbs = `tbs=${tbs}&`;
if (gl) gl = `gl=${gl}&`;
if (location) location = `+location:${location}`;

const userDataDir = findChromeUserDataDir();
if (!userDataDir) {
  console.error('Unable to find Chrome user data directory. Please specify it manually.');
  return [];
}

try {
  const puppeteerOptions = {
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  };

  const cluster = await Cluster.launch({
    concurrency: Cluster.CONCURRENCY_PAGE,
    maxConcurrency: 3,
    puppeteerOptions,
  });

  cluster.on('taskerror', (err, data) => {
    console.log(`Error crawling ${data}: ${err.message}`);
  });

  let allArticles = [];

  await cluster.task(async ({ page, data: url }) => {
    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.864.48 Safari/537.36 Edg/91.0.864.48'
    );
    await page.goto(url, { waitUntil: 'networkidle2' });
    const articles = await scanForLinks(page);
    allArticles.push(...articles);
  });

  const searchURL = `https://www.google.com/search?q=${searchText}${site}${mutedSite}${location}&tbm=nws&${gl}${tbs}start=`;
  await cluster.queue(`${searchURL}${page * 10}`);

  await cluster.idle();
  await cluster.close();

  return allArticles;
} catch (error) {
  console.error('An error occurred while scraping:', error);
  return [];
}
};


const scrapSearch = async (req, res) => {
  const searchText = req.query.q || 'news';
  const site = req.query.site || '';
  const tbs = req.query.tbs || '';
  const gl = req.query.gl || '';
  const location = req.query.location || '';
  const page = req.params.page || 0;

  const mutedSitesObject = await mute_model.findOne({ user: req.user.id }).select('mutedURL -_id');
  const mutedSitesArray = mutedSitesObject?.mutedURL || [];
  const mutedSiteString = mutedSitesArray.map((url) => `%20-site:${url}`).join('');

  const articles = await Scrap({ searchText, site, tbs, gl, location, page, mutedSite: mutedSiteString });

  if (articles.length) {
    const text = location || searchText;
    await addSearchLocation(req, res, text);
  }

  articles.forEach(async (article) => {
    const urlObj = new URL(article.link);
    const providerBaseURL = `${urlObj.protocol}//${urlObj.hostname}`;

    try {
      const provider = await newsProvidermodel.findOne({ baseURL: providerBaseURL });
      if (!provider) {
        await newsProvidermodel.create({
          name: article.providerName,
          baseURL: providerBaseURL,
          logo: article.providerImg,
        });
        console.log(`Provider ${article.providerName} created successfully.`);
      } else {
        console.log(`Provider ${article.providerName} already exists.`);
      }
    } catch (err) {
      console.error('Error processing article:', err);
    }
  });

  res.status(202).json({ success: true, articles });
};



export { findChromeUserDataDir, scanForLinks , Scrap, scrapSearch};
