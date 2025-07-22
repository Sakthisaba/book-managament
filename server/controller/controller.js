const fs = require('fs');
const path = require('path');

// File paths
const userFilePath = path.join(__dirname, '../data/user.json');
const bookFilePath = path.join(__dirname, '../data/book.json');
const authorFilePath = path.join(__dirname, '../data/author.json');
const genreFilePath = path.join(__dirname, '../data/genre.json');

//Read JSON files
const readJSONFile = (filePath) => {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
};

const writeJSONFile = (filePath, data) => {
    fs.writeFileSync(filePath, JSON.stringify(data), 'utf8',null,2);
};

const getUsers = () => readJSONFile(userFilePath);
const getBooks = () => readJSONFile(bookFilePath);
const getAuthors = () => readJSONFile(authorFilePath);
const getGenres = () => readJSONFile(genreFilePath);

const authenticateUser = (req, res) => {
    const users = getUsers();
    let username = req.body.username;
    let password = req.body.password;
    console.log('login request received', username, password);
    const user = users.find(user => user.name === username && user.password === password);
    if (!user) {
        return res.status(200).json({ success: false, message: 'Username and password are incorrect' });
    }
    var userobj = {};
    userobj.name = user.name;
    userobj.role = user.role;
    userobj.userid = user.userid;
    res.status(200).json({ success: true, message: 'Login successful', data: userobj });
};

const getAllBooks = async (req, res) => {
    try {
        const books = getBooks();
        const authors = getAuthors();
        const genres = getGenres();
        var data = {};
        var action = req.query.action;
        var start = Number(req.query.start);
        var limit = Number(req.query.limit);
        var filteredBooks = [];

        switch (action) {
            case 'search':
                var searchquery = req.query.query;
                var filterby = req.query.filterby.split(',');
                console.log('Filter by:', filterby);
                filteredBooks = books.filter((book) => {
                    for (let item of filterby) {
                        if (item === 'title' && book.title.toLowerCase().includes(searchquery.toLowerCase())) {
                            return true;
                        } else if (item === 'author' && authors.find(author => author.id === book.authorid && author.name.toLowerCase().includes(searchquery.toLowerCase()))) {
                            return true;
                        } else if (item === 'genre' && book.genre.toLowerCase().includes(searchquery.toLowerCase())) {
                            return true;
                        }
                    }
                    return false;
                });
                filteredBooks = filteredBooks.slice(start, start + limit);
                data.totalbooks = filteredBooks.length;
                break;
            case 'sort':
                filteredBooks = [...books];
                var sortby = req.query.sortby;
                var sortorder = req.query.sortorder;
                if (sortby !== 'author') {
                    filteredBooks.sort((a, b) => {
                        if (sortorder === 'ascending') {
                            return a[sortby] < b[sortby] ? -1 : a[sortby] > b[sortby] ? 1 : 0;
                        } else {
                            return a[sortby] > b[sortby] ? -1 : a[sortby] < b[sortby] ? 1 : 0;
                        }
                    });
                } else {
                    filteredBooks.sort((a, b) => {
                        const authorA = authors.find(item => item.id === a.authorid)?.name || '';
                        const authorB = authors.find(item => item.id === b.authorid)?.name || '';
                        if (sortorder === 'ascending') {
                            return authorA < authorB ? -1 : authorA > authorB ? 1 : 0;
                        } else {
                            return authorA > authorB ? -1 : authorA < authorB ? 1 : 0;
                        }
                    });
                }
                filteredBooks = filteredBooks.slice(start, start + limit);
                data.totalbooks = filteredBooks.length;
                break;

            case 'getbook':
                filteredBooks = books.slice(start, start + limit);
                // data.authors = authors;
                data.genre = genres;
                data.totalbooks = books.length;
                break;
        }

        // Format books to include author object instead of authorid
        data.books = filteredBooks.map(book => {
            const author = authors.find(author => author.id === book.authorid);
            return {
                ...book,
                author: author || {}
            };
        });

        res.status(200).json({ success: true, data: data });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, error: 'Failed to fetch books' });
    }
};


const getAuthor = async(req,res)=>{
try {
    const query = req.query.query?.toLowerCase() || ''; //
    const page = parseInt(req.query.page) || 1;
    const limit = 5; 


    const filteredAuthors = getAuthors().filter((author) =>
        author.name.toLowerCase().includes(query)
    );

    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedAuthors = filteredAuthors.slice(startIndex, endIndex);

    res.status(200).json({
        success: true,
        authors: paginatedAuthors,
        hasMore: endIndex < filteredAuthors.length, 
    });
} catch (error) {
    res.status(200).json({
        success: false})
}
      

}

const getBookById = async (req, res) => {
    const books = getBooks();
    let bookid = req.body.bookid;
    let book = books.find(book => book.bookid === bookid);
    if (book) {
        res.status(200).json({ success: true, data: book });
    } else {
        res.status(404).json({ success: false, error: 'Book not found' });
    }
};

const addBook = async (req, res) => {
    const books = getBooks();
    if (!hasPermission(req.body.userid, 'add:book')) {
        return res.status(403).json({ success: false, message: 'You do not have permission to add a book' });
    }
    try {
        var book = {
            id: Math.floor(Math.random() * 1000000).toString(),
            title: req.body.bookname,
            isbn: req.body.isbn,
            authorid: req.body.author.id,
            genre: req.body.genre,
            noofcopies: parseInt(req.body.noofcopies)
        };
        books.push(book);
        books.unshift(book);
        writeJSONFile(bookFilePath, books);
        res.status(200).json({ success: true });
    } catch (error) {
        res.status(400).json({ success: false, message: 'Something went wrong' });
    }
};

const deleteBook = async (req, res) => {
    const books = getBooks();
    const booklists = req.body.booklist;
    try {
        if (!hasPermission(req.body.userid, 'delete:book')) {
            return res.status(403).json({ success: false, message: 'You do not have permission to delete a book' });
        }

        for (let i = 0; i < booklists.length; i++) {
            const bookId = booklists[i];
            const bookIndex = books.findIndex(book => book.id === bookId);
            if (bookIndex !== -1) {
                books.splice(bookIndex, 1);
            } else {
                return res.status(404).json({ success: false, message: 'Book not found' });
            }
        }
        writeJSONFile(bookFilePath, books);
        res.status(200).json({ success: true, message: 'Books deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Something went wrong' });
    }
};

const updateBook = async (req, res) => {
    const books = getBooks();
    try {
        const bookId = req.params.id;
        const book = books.find(book => book.id === bookId);
        if (!hasPermission(req.body.userid, 'edit:book')) {
            return res.status(403).json({ success: false, message: 'You do not have permission to edit a book' });
        } else if (!bookId) {
            return res.status(400).json({ success: false, message: 'Book ID is required' });
        } else if (book === undefined) {
            return res.status(404).json({ success: false, message: 'Book not found' });
        } else {
            book.title = req.body.bookname;
            book.ISBN = req.body.isbn;
            book.authorid = req.body.author.id;
            book.genre = req.body.genre;
            book.noofcopies = req.body.noofcopies;
            books.splice(books.indexOf(book), 1); // Remove the old book entry
            books.unshift(book); // Add the updated book to the start of the list
            writeJSONFile(bookFilePath, books);
            res.status(200).json({ success: true, message: 'Book updated successfully' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: 'Something went wrong', error: error.message });
    }
};

const ROLES = {
    'ADMIN': ['edit:book', 'delete:book', 'add:book'],
    'LIBRARIAN': ['edit:book', 'delete:book', 'add:book'],
    'GUEST': ['view:book']
};

const hasPermission = (userid, action) => {
    const users = getUsers();
    let user = users.find(user => user.userid === userid);
    let userrole = user.role.toUpperCase();
    console.log('User permission check:', user, ' Action', action, '; hasPermission:', ROLES[userrole].includes(action));
    return ROLES[userrole].includes(action);
};


module.exports = { authenticateUser, getAllBooks, getBookById, addBook, deleteBook, updateBook ,getAuthor};