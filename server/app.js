const express = require('express');
const cors = require('cors');

const {authenticateUser, getAllBooks, addBook,updateBook,deleteBook,getAuthor} = require('./controller/controller.js');

const app = express();
const PORT_NO= 3001;


// middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: false}));


app.listen()

      
app.get('/', )


app.post('/authenticate', authenticateUser)
app.get('/getbooks', getAllBooks)
app.post('/addbook', addBook)
app.post('/updatebook/:id', updateBook);
app.delete('/deletebook', deleteBook);
app.get('/getauthors',getAuthor)



