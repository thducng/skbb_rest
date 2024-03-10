const cheerio = require('cheerio');
const request = require('request');
const md5 = require('md5');
const { v4 } = require('uuid');
const Event = require('../models/event.model');
const source = "and8dance";

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

async function scrape() {
    process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;
    const items = await parseList().then(async (items) => {
        const itemsParsed = [];
        for (let index = 0; index < items.length; index++) {
            const item = items[index];
            const parsed = await parseItem(item);
            itemsParsed.push(sanitizeItem(parsed));
        }
        return itemsParsed;
    });

    const newEvents = [];
    const removedEvents = [];

    const existingEvents = await Event.find({ deletedAt: null }).lean();
    const currentChecksums = items.map((i) => i.checksum);
    for (let index = 0; index < existingEvents.length; index++) {
        const event = existingEvents[index];
        if(!currentChecksums.includes(event.checksum)) {
            removedEvents.push(event);
            await Event.updateOne({ id: event.id }, { deletedAt: new Date() });
        }
    }

    for (let index = 0; index < items.length; index++) {
        const item = items[index];
        const exists = await Event.findOne({ checksum: item.checksum }).lean();
        if(!exists) {
            const event = await new Event({ ...item, id: v4() }).save();
            newEvents.push(event.toObject());
        }
    }


    process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 1;
    return { events: items.length, added: newEvents.length, removed: removedEvents.length, newEvents, removedEvents };
}

module.exports = { source, scrape };