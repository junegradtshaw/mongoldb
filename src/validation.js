var db = require('./db')

module.exports = {

login: function(loginInputs) {
  return new Promise(function (resolve, reject) {
    var errors = [];
    db.userByName(loginInputs.userName).then(function(results) {
      if (!results) {
        errors.push('No such user name');
      }
      resolve({'errors': errors});
    })
  })
},

booksAndAuthors: function(books) {
  return new Promise(function (resolve, reject) {
    var booksAuthors = [];
    var authors = [];
    db.Books().then(function(books) {
      books.forEach(function(book, bookIndex) {
        var bookToAdd = {'book': book,
                        'authors': []};
        booksAuthors.push(bookToAdd);
        booksAuthors[bookIndex]['authors'] = [];
        db.bookContributorsByBook(book.id).then(function(contributors) {
          contributors.forEach(function(contributor, authorIndex) {
            db.author(contributor.author_id).first().then(function(author) {
              booksAuthors[bookIndex]['authors'].push(author);
              if ((authorIndex >= (contributors.length-1)) && (bookIndex >= (books.length-1))) {
                resolve({'booksAuthors': booksAuthors});
              }
            })
          })
        })
      })
    })
  })
},

authorsAndBooks: function(authors) {
  return new Promise(function (resolve, reject) {
    var authorsBooks = [];
    var books = [];
    db.Authors().then(function(authors) {
      console.log('got the authors');
      authors.forEach(function(author, authorIndex) {
        var authorToAdd = {'author': author,
                        'books': []};
        authorsBooks.push(authorToAdd);
        authorsBooks[authorIndex]['books'] = [];
        db.bookContributorsByAuthor(author.id).then(function(contributors) {
          console.log('got contributors');
          contributors.forEach(function(contributor, bookIndex) {
            db.book(contributor.book_id).first().then(function(book) {
              console.log('got the book');
              authorsBooks[authorIndex]['books'].push(book);
              console.log('bookIndex = ', bookIndex, 'authorIndex', authorIndex, 'clength: ', contributors.length, 'blength: ', books.length );
              if ((authorIndex >= (contributors.length-1)) && (bookIndex >= (books.length-1))) {
                console.log('done and about to resolve!!!');
                resolve({'authorsBooks': authorsBooks});
              }
            })
          })
        })
      })
    })
  })
},

}
