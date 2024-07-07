const cheerio = require('cheerio');
const md5 = require('md5');
const puppeteer = require('../puppeteer');

// CONFIG
const source = "bboybattles";
const disabled = false;
const sourceUrl = 'https://www.bboybattles.org/battles.aspx';

async function parseList() {
    const html = await puppeteer.getHtml(sourceUrl, '.BattleList_Table');
    const $ = cheerio.load(html);

    const items = [];
    $('.BattleList_Table .Row').each((idx, e) => {
        const item = {};
        $(e).find('.BattleList_Item').each((idx, element) => {
            if(idx === 0){
                item['date'] = $(element).text().trim();
                item['period'] = $(element).text().trim();
            } else if(idx === 1) {
                item['event'] = $(element).find('a').text().trim();
                item['url'] = $(element).find('a').attr('href');
            } else if(idx === 2) {
                item['country'] = $(element).text().trim();
            }
        });

        if(item.url) {
            items.push(item);
        }
    });

    return items;
}

async function parseItem(item) {
    return item;
    // return new Promise((res, rej) => {
    //     request(item.url, function (error, response, body) {  
    //         const $ = cheerio.load(body);
    //         const image = $('img.event_banner_dummy').attr('src');
    //         const period = $('.event_date').text().trim();

    //         item['image'] = image;
    //         item['period'] = period;

    //         res(item);
    //     })
    // });
}

function sanitizeItem(item) {
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