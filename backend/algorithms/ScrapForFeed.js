import { Cluster } from "puppeteer-cluster";
import puppeteer from "puppeteer";

const scanForLinks = async (page) => {
  const element = await page.$('div.SoaBEf');
  if (!element) {
    return [];
  }

  await page.waitForSelector('div.SoaBEf div.SoAPf div.MgUUmf.NUnG9d');

  const articles = await page.$$eval('div.SoaBEf', articles => {
    return articles.map(article => {
      const titleElement = article.querySelector('div.SoAPf div.n0jPhd.ynAwRc.MBeuO.nDgy9d');
      const linkElement = article.querySelector('a.WlydOe');
      const imgURLElement = article.querySelector('div.gpjNTe div.YEMaTe.JFSfwc div.uhHOwf.BYbUcd img');
      const timeElement = article.querySelector('div.SoAPf div.OSrXXb.rbYSKb.LfVVr');
      const providerImgElement = article.querySelector('div.SoAPf div.MgUUmf.NUnG9d g-img.QyR1Ze.ZGomKf img');
      const providerNameElement = article.querySelector('div.SoAPf div.MgUUmf.NUnG9d span');
      const someTextElement = article.querySelector('div.SoAPf div.GI74Re.nDgy9d');

      const articleData = {
        title: titleElement ? titleElement.textContent.trim() : null,
        someText: someTextElement ? someTextElement.textContent : null,
        link: linkElement ? linkElement.getAttribute('href') : null,
        imgURL: imgURLElement ? imgURLElement.getAttribute('src') : null,
        time: timeElement ? timeElement.textContent : null,
        providerImg: providerImgElement ? providerImgElement.getAttribute('src') : null,
        providerName: providerNameElement ? providerNameElement.textContent : null
      };

      return (articleData && articleData.title && articleData.someText && articleData.link && articleData.time && articleData.providerImg && articleData.providerName) ? articleData : null;
    });
  });

  return articles.filter(article => article !== null);
};

const ScrapForFeed = async (SearchTexts) => {
  // SearchTexts is array of only one element.
  if (SearchTexts.length === 0) {
    SearchTexts[0] = "news";
  }

  try {
    const puppeteerOptions = {
      headless: true, // Set to false if you want to see the browser
      args: [
        '--no-sandbox', 
        '--disable-setuid-sandbox', 
        '--disable-gpu', 
        '--disable-dev-shm-usage'
      ]
    };

    const cluster = await Cluster.launch({
      concurrency: Cluster.CONCURRENCY_PAGE,
      maxConcurrency: 5,
      puppeteerOptions: puppeteerOptions,
    });

    cluster.on("taskerror", (err, data) => {
      console.log(`Error crawling ${data}: ${err.message}`);
    });

    let allArticles = [];  // Array to hold all articles

    await cluster.task(async ({ page, data: url }) => {
      await page.goto(url, { waitUntil: "networkidle2" });
      const articles = await scanForLinks(page);
      console.log(url, articles.length);

      allArticles = [...allArticles, ...articles];  // Collect articles from each page
    });

    console.log(`Starting search for ${SearchTexts}`);
    const searchURL = `https://www.google.com/search?q=`;

    console.log(SearchTexts);

    for (let i = 0; i < SearchTexts.length; i++) {
      await cluster.queue(`${searchURL}${SearchTexts[i]}&tbm=nws`);
    }

    await cluster.idle();
    await cluster.close();

    console.log(allArticles.length);

    return allArticles;  // Return the collected articles
  } catch (error) {
    console.error("An error occurred while Scraping search data:", error);
    return [];
  }
};

// Main function to demonstrate usage
async function main() {
  try {
    const searchTerms = ["technology", "AI", "innovation"];
    const scrapedArticles = await ScrapForFeed(searchTerms);
    
    console.log("Total articles scraped:", scrapedArticles.length);
    
    // Log details of first few articles
    scrapedArticles.slice(0, 5).forEach((article, index) => {
      console.log(`\nArticle ${index + 1}:`);
      console.log(`Title: ${article.title}`);
      console.log(`Provider: ${article.providerName}`);
      console.log(`Link: ${article.link}`);
    });
  } catch (error) {
    console.error("Error in main function:", error);
  }
}

// Uncomment to run directly
// main();

export { ScrapForFeed, main };
