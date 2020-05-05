function init(msg, respond) {
  //console.log("service :"+options.message);
  console.log("plugin initialized!");
  books = require("./books.json");
  respond();
}

module.exports = function catalog(options) {
  this.add({ component: "catalog", by: "title" }, (args, respond) => {
    let book_found = books.find(book => book.title == args.title);
    if (!book_found) {
      book_found = { title: args.title, message: "Book not found" };
    }
    respond(null, { book: book_found });
  });
  this.add({ component: "catalog", by: "category" }, (args, respond) => {
    let book_found = books.filter(book => book.category == args.category);
    if (book_found.length == 0) {
      book_found = { category: args.category, message: "Book not found" };
    }
    respond(null, { book: book_found });
  });
  this.add(
    { component: "catalog", by: "category", reviews: "good" },
    (args, respond) => {
      let book_found = books.filter(
        book => book.category == args.category && book.rating > 4
      );
      if (book_found.length == 0) {
        book_found = { category: args.category, message: "Book not found" };
      }
      respond(null, { book: book_found });
    }
  );
  // this is the special initialization pattern
  this.add({ init: "catalog" }, init);
};
