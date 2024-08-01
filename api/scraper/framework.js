const { v4 } = require('uuid');
const Event = require('../models/event.model');

async function parseItems(scraper, list) {
    const parsedItems = [];
    for (let index = 0; index < list.length; index++) {
        try{
            const item = list[index];
            console.log(`Scraper: ${scraper.source} - Parsing(${index+1}/${list.length}): ${item.url}`);
            const parsed = await scraper.parseItem(item);
            parsedItems.push(parsed);
        }catch(err) {
            console.log(err);
        }
    }
    console.log(`Scraper: ${scraper.source} - ParseItems: ${parsedItems.length}`);
    return parsedItems;
}

async function sanitizeItems(scraper, parsedItems) {
    const items = [];
    for (let index = 0; index < parsedItems.length; index++) {
        try{
            const item = parsedItems[index];
            const sanitized = scraper.sanitizeItem(item);
            items.push(sanitized);
        }catch(err) {
            console.log(err);
        }
    }
    console.log(`Scraper: ${scraper.source} - Sanitized: ${items.length}`);
    return items;
}

async function rotateEvents(scraper, existingEvents, currentChecksums) {
    const removed = existingEvents.filter(v => !currentChecksums.includes(v.checksum));
    const removedResult = await Event.updateMany({ id: { $in: removed.map((v) => v.id )} }, { deletedAt: new Date() });
    console.log(`Scraper: ${scraper.source} - Removed: ${removedResult.modifiedCount}`);
    return removedResult.modifiedCount;
}

async function addNewEvents(scraper, items, existingChecksums) {
    const newEvents = items.filter((v) => !existingChecksums.includes(v.checksum));
    const result = [];
    for (let index = 0; index < newEvents.length; index++) {
        const item = newEvents[index];
        const event = await new Event({ ...item, id: v4() }).save();
        result.push(event.toObject());
    }
    console.log(`Scraper: ${scraper.source} - Added: ${result.length}`);
    return result.length;
}

async function run(scraper) {
    console.log(`Scraper: ${scraper.source} - LOADING`);
    // Parse raw list of events
    const list = await scraper.parseList();
    console.log(`Scraper: ${scraper.source} - ParseList: ${list.length}`);

    // Parse detail and/or sanitize events
    const parsedItems = await parseItems(scraper, list);
    const items = await sanitizeItems(scraper, parsedItems);
    
    // Checksums
    const existingEvents = await Event.find({ deletedAt: null, source: scraper.source }).lean();
    const currentChecksums = items.map((i) => i.checksum);
    const existingChecksums = existingEvents.map((i) => i.checksum);

    // Handle remove and add events
    const removed = await rotateEvents(scraper, existingEvents, currentChecksums);
    const added = await addNewEvents(scraper, items, existingChecksums);

    console.log(`Scraper: ${scraper.source} - Finished: ${existingChecksums.length + added}`);
    return { source: scraper.source, raw: items.length, existed: existingChecksums.length, added, removed };
}

module.exports = run;