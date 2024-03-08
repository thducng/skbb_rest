const and8dance = require('../scraper/and8dance');
const bboybattles = require('../scraper/bboybattles');

const scrapers = [and8dance, bboybattles];

async function scrape(source) {
    const data = [];

    for (let idx = 0; idx < scrapers.length; idx++) {
        const scraper = scrapers[idx];

        if(source) {
            if(scraper.source === source) {
                const result = await scraper.scrape(scraper.slug);
                data.push(result);
            } else {
                continue;
            }
        }

        const result = await scraper.scrape(scraper.slug);
        data.push(result);
    }

    return data;
}


module.exports = scrape;