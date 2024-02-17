const cheerio = require('cheerio');
const request = require('request');
const md5 = require('md5');

async function parseList() {
    return new Promise((res, rej) => {
        request('https://and8.dance/en/events', function (error, response, body) {
            const $ = cheerio.load(body);

            const items = [];
            $('#full > table:nth-child(2) > tbody > tr.d_list').each((idx, e) => {
                const item = {};
                $(e).find('td').each((idx, element) => {
                    if(idx === 0){
                        item['date'] = $(element).text().trim();
                    } else if(idx === 1) {
                        item['event'] = $(element).find('a').text().trim();
                        item['url'] = 'https://and8.dance/' + $(element).find('a').attr('href');
                    } else if(idx === 2) {
                        item['venue'] = $(element).text().trim();
                        item['country'] = $(element).find('img').attr('title');
                    }
                });

                items.push(item);
            });

            res(items);
        })
    });
}

async function parseItem(item) {
    return new Promise((res, rej) => {
        request(item.url, function (error, response, body) {  
            const $ = cheerio.load(body);
            const image = $('img.event_banner_dummy').attr('src');
            const period = $('.event_date').text().trim();

            item['image'] = image;
            item['period'] = period;

            res(item);
        })
    });
}

function sanitizeItem(item) {
    return {
        id: md5(item.url),
        date: item.date,
        event: item.event,
        url: item.url,
        venue: item.venue,
        country: item.country,
        image: item.image,
        period: item.period
    }
}

async function fetchEvents() {
    const items = await parseList().then(async (items) => {
        const itemsParsed = [];
        for (let index = 0; index < items.length; index++) {
            const item = items[index];
            const parsed = await parseItem(item);
            itemsParsed.push(sanitizeItem(parsed));
        }
        return itemsParsed;
    });

    return items;
}

module.exports = fetchEvents;