
const {AuthorSchema} = require('./authors.model.js')
const bookSchema = {
    "id": String,
    "title": String,
    "authorid": String,
    "isbn": String,
    "genre": String,
    "noofcopies": Number
};





module.exports = {bookSchema };