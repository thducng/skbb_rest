const Profile = require('../models/profile.model');

const levelRequirement = [
    { level: 1, exp: 100 },
    { level: 2, exp: 300 },
    { level: 3, exp: 600 },
    { level: 4, exp: 1000 },
    { level: 5, exp: 1500 },
    { level: 6, exp: 2100 },
    { level: 7, exp: 2800 },
    { level: 8, exp: 3600 },
    { level: 9, exp: 4500 },
    { level: 10, exp: 5500 },
    { level: 11, exp: 6600 },
    { level: 12, exp: 7800 },
    { level: 13, exp: 9100 },
    { level: 14, exp: 10500 },
    { level: 15, exp: 12000 },
    { level: 16, exp: 13600 },
    { level: 17, exp: 15300 },
    { level: 18, exp: 17100 },
    { level: 19, exp: 19000 }
]

function calcLevel(exp) {
    for (let idx = 0; idx < levelRequirement.length; idx++) {
        const requirement = levelRequirement[idx];
        if(exp < requirement.exp) {
            return requirement.level;
        }
    }
    return 20;
}

async function addExp(profile, exp) {
    const experience = (profile.exp || 0) + exp;

    const newLevel = calcLevel(experience);
    if(newLevel === 20) {
        const currentPrestigeStar = profile.prestigeStar || 0;
        const currentExp = experience - 19000;
        const currentLevel = calcLevel(currentExp);
        await Profile.updateOne({ id: profile.id }, { prestigeStar: currentPrestigeStar + 1, level: currentLevel, exp: currentExp });
    } else {
        await Profile.updateOne({ id: profile.id }, { level: newLevel, exp: experience });
    }

    return await Profile.findOne({ id: profile.id }).lean();
}

async function addItems(profile, newItems) {
    const items = profile.items || [];
    items.push(...newItems);
    await Profile.updateOne({ id: profile.id }, { items });
    return await Profile.findOne({ id: profile.id }).lean();
}

async function removeItems(profile, newItems) {
    const items = profile.items || [];
    await Profile.updateOne({ id: profile.id }, { items: items.filter((item) => !newItems.includes(item)) });
    return await Profile.findOne({ id: profile.id }).lean();
}

module.exports = { addExp, addItems, removeItems };