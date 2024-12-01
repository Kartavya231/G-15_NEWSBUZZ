import fs from 'fs';
import path from 'path';
import os from 'os';

/**
 * Finds the Chrome user data directory based on the operating system.
 * @returns {string|null} Path to Chrome user data directory or null if not found.
 */
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

export { findChromeUserDataDir, scanForLinks };
