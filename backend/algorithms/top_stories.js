import randomUseragent from "random-useragent";
import top_stories_model from "../models/mtopStories.js";
import newsProvidermodel from "../models/mnewsProvider.js";
import puppeteer from "puppeteer";


const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));


const scanForLinks = async (page) => {

	await page.waitForSelector('article');

	const articles = await page.$$eval('article.UwIKyb', articles => {
		return articles.map(article => {
			const linkElement = article.querySelector('a.gPFEn');
			const timeElement = article.querySelector('div.UOVeFe time.hvbAAd');
			const providerImgElement1 = article.querySelector('div.MCAGUe img.msvBD.zC7z7b'); // Update with the correct selector
			const providerImgElement2 = article.querySelector('div.MCAGUe div.oovtQ img.qEdqNd.y3G2Ed'); // Update with the correct selector


			const articleData = {
				title: linkElement ? linkElement.textContent.trim() : null,
				link: linkElement ? `https://news.google.com${linkElement.getAttribute('href')}` : null,
				time: timeElement ? timeElement.textContent : null,
				providerImg: providerImgElement1 ? providerImgElement1.getAttribute('src') : providerImgElement2 ? providerImgElement2.getAttribute('src') : null
			};

			// Only return the article if none of the fields are null
			return (articleData.title && articleData.link && articleData.time && articleData.providerImg) ? articleData : null;

		});
	});

	// delay(10000);

	return articles.filter(article => article !== null);

};



const Scrap = async (searchby) => {
	try {
		let country = searchby.country;
		let puppeteerOptions = {};

		if (process.env.AWS_LAMBDA_FUNCTION_VERSION) {
			puppeteerOptions = {
				args: [...chrome.args, "--hide-scrollbars", "--disable-web-security"],
				defaultViewport: chrome.defaultViewport,
				executablePath: await chrome.executablePath,
				headless: true,
				ignoreHTTPSErrors: true,
			};
		}
		else {
			puppeteerOptions = {
				headless: false,
				args: [
					"--no-sandbox",
					"--disable-setuid-sandbox",
				],
				defaultViewport: false,
			}

		}
		const browser = await puppeteer.launch(puppeteerOptions);
		const page = await browser.newPage();

		const userAgent = randomUseragent.getRandom(); // Get a random user agent
		await page.setUserAgent(userAgent); // Set the random user agent

		console.log(`Starting to search for Top stories in ${country}`);

		const url = `https://news.google.com/topics/CAAqKggKIiRDQkFTRlFvSUwyMHZNRFZxYUdjU0JXVnVMVWRDR2dKSlRpZ0FQAQ?hl=en-${country}&gl=${country}&ceid=${country}%3Aen`;
		await page.goto(url, { waitUntil: "networkidle2" });

		// delay(30000);

		const articles = await scanForLinks(page);
		console.log(articles.length);

		await browser.close();
		setTimeout(() => {
		}, 0);

		return articles;
	}
	catch (err) {
		return "An error occurred while Scraping top stories data.";
	}
};



const ScrapTop_stories = async (req, res) => {


	const FETCH_INTERVAL = 1000 * 600000;  // 600000 seconds

	let lastFetchTime = null;
	lastFetchTime = await top_stories_model.findOne({}, { createdAt: 1 });
	if (!lastFetchTime)
		lastFetchTime = 0;
	else
		lastFetchTime = lastFetchTime.createdAt.getTime();

	const currentTime = new Date().getTime();

	const Documentcount = await top_stories_model.find({}).countDocuments();  // this is because if user close the browser at the time of web scraping then we have to fetch the data again




	if (currentTime - lastFetchTime > FETCH_INTERVAL || Documentcount < 30) {

		const articles = await Scrap({
			country: "IN",
		});

		try {
			await top_stories_model.deleteMany({});
		} catch (err) {
			res.status(210).json({ success: false, articles: "An error occurred while deleting the data from the database " });
		}

		try {
			console.log(articles);

			articles?.forEach(async (article) => {

				if (article) {
					const newArticle = new top_stories_model({
						title: article.title,
						link: article.link,
						time: article.time,
						providerImg: article.providerImg,
					});
					await newArticle.save();
				}
			});

			articles.forEach(async (article) => {
				const url = new URL(article.providerImg);
				const params = new URLSearchParams(url.search);
				const baseUrl = params.get('url');
				const finalURL = baseUrl ? new URL(baseUrl).origin : null;

				let providerName = finalURL.replace(/^https?:\/\//, "").replace(/^www\./, "").replace(/\.com$/, "").replace(/\.in$/, "");

				if (providerName.includes('.')) {
					providerName = providerName.replace(/\./g, '-');
				}

				try {
					const provider = await newsProvidermodel.findOne({ baseURL: finalURL });
					// console.log(finalURL, provider);
					if (!provider) {
						await newsProvidermodel.create({ name: providerName, baseURL: finalURL, logo: article.providerImg });
					}
				} catch (err) {
					console.log(err);
				}

			});
			res.status(202).json({ success: true, articles: articles });
		}
		catch (err) {
			console.log(err);
			res.status(210).json({ success: false, articles: "An error occurred while saving the data to the database " });
		}
	}
	else {
		try {
			const top_stories = await top_stories_model.find();

			res.status(202).json({ success: true, articles: top_stories });
		} catch (error) {
			res.status(210).json({ success: false, message: error });
		}
	}
};
export default ScrapTop_stories;
