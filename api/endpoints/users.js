const express = require('express');
const router = express();

const profilesDb = require('../db/profiles.json');
const data = require('../db/users.json');

router.get('/', (req, res) => {
    return res.json(data.map((user) => {
        const profiles = user.profiles.map((id) => profilesDb.find((i) => i.id === id));
        return { ...user, profiles };
    }));
});

router.get('/:id', (req, res) => {
    const user = data.find((i) => i.id === req.params.id);
    const profiles = user ? user.profiles.map((id) => profilesDb.find((i) => i.id === id)) : [];

    return res.json({ ...user, profiles });
});

router.post('/login', (req, res) => {
    const { email, password } = req.body;
    const user = data.find((i) => i.email === email && i.password === password);

    if(!user) {
        return res.json({ error: { message: "User doesn't exists", body: req.body }});
    }

    const profiles = user ? user.profiles.map((id) => profilesDb.find((i) => i.id === id)) : [];
    return res.json({ ...user, profiles });
});

module.exports = router;