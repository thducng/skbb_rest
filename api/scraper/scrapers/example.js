const cheerio = require('cheerio');
const md5 = require('md5');
const puppeteer = require('../puppeteer');

// CONFIG
const source = "SLUG";
const disabled = false;
const sourceUrl = 'https://example.com';

async function parseList() {
    const html = await puppeteer.getHtml(sourceUrl, '#selector');
    const $ = cheerio.load(html);

    const items = [];
    $('#selector').each((idx, e) => {
        const item = {};
        // $(e).find('td').each((idx, element) => {
        //     if(idx === 0){
        //         item['date'] = $(element).text().trim();
        //     } else if(idx === 1) {
        //         item['event'] = $(element).find('a').text().trim();
        //         item['url'] = 'https://and8.dance/' + $(element).find('a').attr('href');
        //     } else if(idx === 2) {
        //         item['venue'] = $(element).text().trim();
        //         item['country'] = $(element).find('img').attr('title');
        //     }
        // });

        items.push(item);
    });

    return items;
};

async function parseItem(item) {
    // const html = await puppeteer.getHtml(item.url);
    // const $ = cheerio.load(html);

    // const image = $('img.event_banner_dummy').attr('src');
    // const period = $('.event_date').text().trim();

    // item['image'] = image;
    // item['period'] = period;

    return item;
};

async function sanitizeItem(item) {
    const checksum = md5(JSON.stringify(item));
    return {
        checksum,
        date: item.date,
        event: item.event,
        url: item.url,
        venue: item.venue,
        country: item.country,
        image: item.image,
        period: item.period,
        source,
        status: 'PENDING',
        deletedAt: null
    }
}

module.exports = { source, sourceUrl, disabled, parseList, parseItem, sanitizeItem };