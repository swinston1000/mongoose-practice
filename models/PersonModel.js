var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var personSchema = new Schema({
    hair: String,
    eyes: String,
    weight: Number,
    height: Number,
    salary: Number,
    numKids: Number,
    kids: []
});

var Person = mongoose.model("PersonModel", personSchema);
module.exports = Person;
