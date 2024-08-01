const mongoose = require('mongoose');
const config = require('../config');

mongoose.connect(config.MONGODB)
  .then(() => console.log('MONGODB Connected!'));

