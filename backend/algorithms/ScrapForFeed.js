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

const ScrapForFeed = async (searchText) => {
  // Use "news" if no search text is provided
  searchText = searchText || "news";

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

    // Launch the browser
    const browser = await puppeteer.launch(puppeteerOptions);
    
    // Create a new page
    const page = await browser.newPage();

    // Construct the search URL
    const searchURL = `https://www.google.com/search?q=${searchText}&tbm=nws`;

    // Navigate to the search page
    await page.goto(searchURL, { waitUntil: "networkidle2" });

    // Scan for links
    const articles = await scanForLinks(page);

    // Close the browser
    await browser.close();

    return articles;
  } catch (error) {
    console.error("An error occurred while Scraping search data:", error);
    return [];
  }
};

// Main function to demonstrate usage
async function main() {
  try {
    const searchTerm = "technology";
    const scrapedArticles = await ScrapForFeed(searchTerm);
    
    console.log("Total articles scraped:", scrapedArticles.length);
    
    // Log details of first few articles
    scrapedArticles.slice(0, 5).forEach((article, index) => {
      console.log(`\nArticle ${index + 1}:`);
      console.log(`Title: ${article.title}`);
      console.log(`Provider: ${article.providerName}`);
      console.log(`Link: ${article.link}`);
    });

    return scrapedArticles;
  } catch (error) {
    console.error("Error in main function:", error);
    return [];
  }
}

// Uncomment to run directly
// main();

export { ScrapForFeed, main };
