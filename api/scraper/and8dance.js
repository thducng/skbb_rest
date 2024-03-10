const cheerio = require('cheerio');
const md5 = require('md5');
const { v4 } = require('uuid');
const Event = require('../models/event.model');
const puppeteer = require('./puppeteer');
const source = "and8dance";

async function parseList() {
    const html = await puppeteer.getHtml('https://and8.dance/en/events', '#full > table:nth-child(2) > tbody > tr.d_list');
    const $ = cheerio.load(html);

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

    return items;
}

async function parseItem(item) {
    const html = await puppeteer.getHtml(item.url);
    const $ = cheerio.load(html);

    const image = $('img.event_banner_dummy').attr('src');
    const period = $('.event_date').text().trim();

    item['image'] = image;
    item['period'] = period;

    return item;
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

    const existingEvents = await Event.find({ deletedAt: null, source }).lean();
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

    return { events: items.length, added: newEvents.length, removed: removedEvents.length, newEvents, removedEvents };
}

module.exports = { source, scrape };