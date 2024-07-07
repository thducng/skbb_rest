const run = require('./framework');
const scrapers = {};
const scraperPath = require('path').join(__dirname, 'scrapers');

require('fs')
  .readdirSync(scraperPath)
  .forEach((file) => {
    const name = file.replace(/\.js$/, '');
    if(name === 'example') {
        return;
    }
    scrapers[name] = require(`./scrapers/${file}`);
  });

async function scrape(source) {
    const data = [];
    const slugs = Object.keys(scrapers);

    for (let idx = 0; idx < slugs.length; idx++) {
        const slug = slugs[idx];
        const scraper = scrapers[slug];
        if(scraper.disabled) {
            continue;
        }

        if(source) {
            if(scraper.source === source) {
                try{
                    const result = await run(scraper);
                    data.push(result);
                } catch(err) {
                    console.log(err);
                }
            }
        } else {
            try{
                const result = await run(scraper);
                data.push(result);
            } catch(err) {
                console.log(err);
            }
        }
    }

    return data;
}


module.exports = scrape;