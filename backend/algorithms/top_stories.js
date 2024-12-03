// import puppeteer from "puppeteer";
import puppeteer from "puppeteer-core";
import chromium from "@sparticuz/chromium";
// import randomUseragent from "random-useragent";
import { top_stories_model } from "../models/mtopStories.js";
import { newsProvidermodel } from "../models/mnewsProvider.js";

// const puppeteer = require("puppeteer");
// const randomUseragent = require("random-useragent"); // Added random-useragent
// const top_stories_model = require("../models/mtopStories");
// const newsProvidermodel = require("../models/mnewsProvider.js");


// const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

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
		const puppeteerOptions = {
			args: [...chromium.args, '--no-sandbox', '--disable-setuid-sandbox', '--hide-scrollbars'],
			defaultViewport: chromium.defaultViewport,
			executablePath: await chromium.executablePath() || puppeteer.executablePath(),
			headless: chromium.headless,
			ignoreDefaultArgs: chromium.ignoreDefaultArgs,
		};

		const browser = await puppeteer.launch(puppeteerOptions);
		const page = await browser.newPage();

		// const userAgent = randomUseragent.getRandom(); // Get a random user agent
		// await page.setUserAgent(userAgent); // Set the random user agent

		console.log(`Starting to search for Top stories in ${country}`);

		const url = `https://news.google.com/topics/CAAqKggKIiRDQkFTRlFvSUwyMHZNRFZxYUdjU0JXVnVMVWRDR2dKSlRpZ0FQAQ?hl=en-${country}&gl=${country}&ceid=${country}%3Aen`;
		// const url = `https://www.google.com/search?q=dhoni&tbm=nws`;
		console.log(url);
		await page.goto(url, { waitUntil: "networkidle2" });
		// await page.waitForTimeout(2000);

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


	const FETCH_INTERVAL = 1000 * 600000000;  // 600000 seconds

	let lastFetchTime = null;
	lastFetchTime = await top_stories_model.findOne({}, { createdAt: 1 });
	if (!lastFetchTime)
		lastFetchTime = 0;
	else
		lastFetchTime = lastFetchTime.createdAt.getTime();


	const currentTime = new Date().getTime();


	const Documentcount = await top_stories_model.find({}).countDocuments();  // this is because if user close the browser at the time of web scraping then we have to fetch the data again


	if (currentTime - lastFetchTime > FETCH_INTERVAL || Documentcount < 30) {


		console.log("scrapping");
		let articles = [];
		articles = await Scrap({
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

			// await newsProvidermodel.deleteMany({});

			articles?.forEach(async (article) => {
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

			// for (const article of articles) {
			// 	const url = new URL(article.providerImg);
			// 	const params = new URLSearchParams(url.search);
			// 	const baseUrl = params.get('url');
			// 	const finalURL = baseUrl ? new URL(baseUrl).origin : null;

			// 	let providerName = finalURL.replace(/^https?:\/\//, "").replace(/^www\./, "").replace(/^m\./, "").replace(/\.com$/, "").replace(/\.in$/, "");

			// 	if (providerName.includes('.')) {
			// 		providerName = providerName.replace(/\./g, '-');
			// 	}

			// 	console.log(providerName);	

			// 	try {
			// 		const provider = await newsProvidermodel.findOne({ url: finalURL });

			// 		if (!provider) {
			// 			await newsProvidermodel.create({ name: providerName, url: finalURL });
			// 		}
			// 	} catch (err) {
			// 		console.log(err);
			// 	}
			// }


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


// module.exports = { ScrapTop_stories };

// const temp = { ScrapTop_stories };

// export default ScrapTop_stories;

export { ScrapTop_stories };



// const puppeteer = require("puppeteer");
// const randomUseragent = require("random-useragent"); // Added random-useragent
// const fs = require("fs");

// const scanForLinks = async (page) => {
// 	// Use a single evaluate call to get both links and titles
// 	console.log('asfda');

// 	const result = await page.evaluate(() => {
// 		let Alink = [];
// 		let Atime = [];
// 		let AimageURL = [];
// 		let Aprovider = [];

// 		const articles = document.querySelectorAll(".IBr9hb");
// 		console.log(articles);

// 		const anchors = articles.querySelectorAll(".gPFEn");
// 		anchors.forEach((anchor) => {
// 			if (anchor.hasAttribute("href")) {
// 				Alink.push(`https://news.google.com/${anchor.getAttribute("href")}`);
// 			}
// 		});

// 		anchors.forEach((title) => {
// 			Atitle.push(title.innerText.trim());
// 		});


// 		// const articleTime = articles.querySelectorAll(".hvbAAd");
// 		// articleTime.forEach((time) => {
// 		// 	Atime.push(time.innerText.trim());
// 		// });


// 		// const imageURL = articles.querySelectorAll(".Quavad.vwBmvb");
// 		// imageURL.forEach((url) => {
// 		// 	AimageURL.push(url.getAttribute("href"));
// 		// });

// 		// const provider = articles.querySelectorAll(".QmrVtf.RD0gLb");
// 		// provider.forEach((prov) => {
// 		// 	Aprovider.push(prov.innerText.trim());
// 		// });


// 		return { Alink, Atitle, Atime, AimageURL, Aprovider };
// 	});

// 	const { Alink, Atitle } = result;

// 	if (result) {
// 		console.log("Top stories found successfully\n");
// 	}
// 	const limit = Math.min(10, Atitle.length, Alink.length); // Limit to 3 or the length of Atitle if less than 3
// 	for (let i = 0; i < limit; i++) {
// 		console.log(Atitle[i]);
// 		// await func(Alink[i]);
// 		console.log(Alink[i]);
// 		console.log();
// 	}
// 	console.log(limit);

// 	return result;
// };


// const scanForLinks = async (page) => {
// 	// Use a single evaluate call to get both links and titles
// 	console.log('asfda');

// 	let Alink = [];
// 	let Atime = [];
// 	let AimageURL = [];
// 	let Aprovider = [];
// 	// await page.waitForSelector('.IBr9hb', { timeout: 10000 });
// 	// console.log('Page is fully loaded');
// 	// let articles = null;


// 	const result = await page.evaluate(async () => {

// 		const anchors = document.querySelector("c-wiz > div > article > div.UOVeFe > time");
// 		anchors.forEach((anchor) => {
// 			if (anchor.textContent) {
// 				Alink.push(`https://news.google.com/${anchor.textContent}`);
// 			}
// 		});

// 	});

// 	console.log(Alink);

// 	return { Alink, Atime, AimageURL, Aprovider };

// 	// console.log(result);
// 	return result;
// };

// const Scrap = async (searchby) => {

// 	try {
// 		let country = searchby.country;
// 		const puppeteerOptions = {
// 			headless: false, // Set headless to false to see the browser
// 			args: ["--no-sandbox", "--disable-setuid-sandbox"],
// 		};
// 		const browser = await puppeteer.launch(puppeteerOptions);
// 		const page = await browser.newPage();

// 		const userAgent = randomUseragent.getRandom(); // Get a random user agent
// 		await page.setUserAgent(userAgent); // Set the random user agent

// 		console.log(`Starting to search for Top stories in ${country}`);

// 		const url = `https://news.google.com/topics/CAAqKggKIiRDQkFTRlFvSUwyMHZNRFZxYUdjU0JXVnVMVWRDR2dKSlRpZ0FQAQ?hl=en-${country}&gl=${country}&ceid=${country}%3Aen`;

// 		await page.goto(url, { waitUntil: "networkidle2" });

// 		const result = await scanForLinks(page);
// 		console.log(result.Alink);

// 		setTimeout(async () => {
// 			await browser.close();
// 		}, 0);
// 		// console.log(result);

// 		return result;
// 	}
// 	catch (err) {
// 		return "An error occurred while fetching data.";
// 	}
// };

// // const searchFor = [
// // 	{
// // 		country: "IN",
// // 	},
// // ];

// // // Run for each search item
// // for (const searchby of searchFor) {
// // 	run(searchby);
// // }



// Scrap({
// 	country: "IN",
// });


// // module.exports = { ScrapTop_stories };


// const puppeteer = require('puppeteer');

// (async () => {
// 	// Launch the browser
// 	const browser = await puppeteer.launch();
// 	const page = await browser.newPage();
// 	let country = "IN";
// 	// Navigate to the desired webpage
// 	await page.goto(`https://news.google.com/topics/CAAqKggKIiRDQkFTRlFvSUwyMHZNRFZxYUdjU0JXVnVMVWRDR2dKSlRpZ0FQAQ?hl=en-${country}&gl=${country}&ceid=${country}%3Aen`); // Replace with the actual URL

// 	// Wait for the content of the div with class "UOVeFe" to load
// 	await page.waitForSelector('div.UOVeFe');

// 	// Extract the text from the div with class "UOVeFe"
// 	// const timeText = await page.$eval('div.UOVeFe time.hvbAAd', el => el.textContent);
// 	// console.log('Time text:', timeText);  // Output: 25 minutes ago

// 	// const hrefValue = await page.$eval('article div.XlKvRb a.WwrzSb', links => links.map(link => link.getAttribute('href')));
// 	const Alink = await page.$$eval('article.IBr9hb div.XlKvRb a.WwrzSb', links => links.map(link => link.getAttribute('href')));
// 	console.log('Href:', hrefs.length);  // Output: href value of the anchor tag



// 	// Close the browser
// 	await browser.close();
// })();



// const puppeteer = require("puppeteer");
// const randomUseragent = require("random-useragent");

// const scanForLinks = async (page) => {
// 	// Use a single evaluate call to get both links and titles
// 	console.log('ok1');
// 	let Alink = [];
// 	let Atitle = [];
// 	let Atime = [];
// 	let AimageURL = [];
// 	let AproviderImg = [];

// 	await page.waitForSelector('div.UOVeFe');

// 	Atime = await page.$$eval('article.IBr9hb div.UOVeFe time.hvbAAd', elements => elements.map(el => el.textContent));

// 	console.log(Atime.length);   // 14 ??????????
// 	return { Alink, Atitle, Atime, AimageURL, AproviderImg };
// };

// const Scrap = async (searchby) => {
// 	try {
// 		let country = searchby.country;
// 		const puppeteerOptions = {
// 			headless: false, // Set headless to false to see the browser
// 			args: ["--no-sandbox", "--disable-setuid-sandbox"],
// 		};
// 		const browser = await puppeteer.launch(puppeteerOptions);
// 		const page = await browser.newPage();

// 		const userAgent = randomUseragent.getRandom(); // Get a random user agent
// 		await page.setUserAgent(userAgent); // Set the random user agent

// 		console.log(`Starting to search for Top stories in ${country}`);

// 		const url = `https://news.google.com/topics/CAAqKggKIiRDQkFTRlFvSUwyMHZNRFZxYUdjU0JXVnVMVWRDR2dKSlRpZ0FQAQ?hl=en-${country}&gl=${country}&ceid=${country}%3Aen`;

// 		await page.goto(url, { waitUntil: "networkidle2" });

// 		console.log('ok2');
// 		const result = await scanForLinks(page);
// 		console.log('ok3');
// 		console.log(result.AimageURL);

// 		await browser.close();

// 		return result;
// 	} catch (err) {
// 		console.error("An error occurred while fetching data:", err);
// 		return "An error occurred while fetching data.";
// 	}
// };

// // Example usage
// const searchby = { country: 'IN' };
// Scrap(searchby).then(result => {
// 	console.log('Final result:', result);
// }).catch(error => {
// 	console.error('Error in Scrap:', error);
// });


// const puppeteer = require("puppeteer");
// const randomUseragent = require("random-useragent");

// const scanForLinks = async (page) => {
// 	await page.waitForSelector('article.IBr9hb');

// 	const articles = await page.$$eval('article.IBr9hb', articles => {
// 		return articles.map(article => {
// 			const linkElement = article.querySelector('a.gPFEn');
// 			const timeElement = article.querySelector('div.UOVeFe time.hvbAAd');
// 			const imageElement = article.querySelector('figure.K0q4G.P22Vib img.Quavad.vwBmvb'); // Update with the correct selector
// 			const providerImgElement1 = article.querySelector('div.MCAGUe img.msvBD.zC7z7b'); // Update with the correct selector
// 			const providerImgElement2 = article.querySelector('div.MCAGUe div.oovtQ img.qEdqNd.y3G2Ed'); // Update with the correct selector

// 			// 		const providerImg1 = await article.$('div.MCAGUe img.msvBD.zC7z7b');
// 			// 		const providerImg2 = await article.$('div.MCAGUe div.oovtQ img.qEdqNd.y3G2Ed');

// 			// if (providerImg1) {
// 			// 			const providerImgSrc = await providerImg1.getProperty('srcset');
// 			// 			AproviderImg.push(await providerImgSrc.jsonValue());
// 			// 		} else if (providerImg2) {
// 			// 			const providerImgSrc = await providerImg2.getProperty('srcset');
// 			// 			AproviderImg.push(await providerImgSrc.jsonValue());
// 			// 		} else {
// 			// 			AproviderImg.push(null);
// 			// 		}
// 			return {
// 				title: linkElement ? linkElement.textContent.trim() : null,
// 				link: linkElement ? linkElement.getAttribute('href') : null,
// 				time: timeElement ? timeElement.textContent : null,
// 				imageURL: imageElement ? imageElement.getAttribute('src') : null,
// 				providerImg: providerImgElement1 ? providerImgElement1.getAttribute('src') : providerImgElement2 ? providerImgElement2.getAttribute('src') : null
// 			};
// 		});
// 	});

// 	return articles;
// };

// const Scrap = async (searchby) => {
// 	try {
// 		let country = searchby.country;
// 		const puppeteerOptions = {
// 			headless: false, // Set headless to false to see the browser
// 			args: ["--no-sandbox", "--disable-setuid-sandbox"],
// 		};
// 		const browser = await puppeteer.launch(puppeteerOptions);
// 		const page = await browser.newPage();

// 		const userAgent = randomUseragent.getRandom(); // Get a random user agent
// 		await page.setUserAgent(userAgent); // Set the random user agent

// 		console.log(`Starting to search for Top stories in ${country}`);

// 		const url = `https://news.google.com/topics/CAAqKggKIiRDQkFTRlFvSUwyMHZNRFZxYUdjU0JXVnVMVWRDR2dKSlRpZ0FQAQ?hl=en-${country}&gl=${country}&ceid=${country}%3Aen`;

// 		await page.goto(url, { waitUntil: "networkidle2" });

// 		const result = await scanForLinks(page);
// 		console.log(result);

// 		await browser.close();

// 		return result;
// 	} catch (err) {
// 		console.error("An error occurred while fetching data:", err);
// 		return "An error occurred while fetching data.";
// 	}
// };

// // Example usage
// const searchby = { country: 'IN' };
// Scrap(searchby).then(result => {
// 	console.log('Final result:', result);
// }).catch(error => {
// 	console.error('Error in Scrap:', error);
// });