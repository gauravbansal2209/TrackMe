const mongoose = require('mongoose');
module.exports = mongoose.model('Plant', new mongoose.Schema(
{
    id: Number,
    name: String,
    user: String,
    temp: String,
    light: String,
    humidity: String,
    moisure: String

}));