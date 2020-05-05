module.exports = function order(options) {
  this.add("component: order, action: checkout", function (args, respond) {
   
    var order = this.make$("orders");
    const orderid = Math.floor(Math.random() * 100);
    order.orderid = orderid;
    order.username = args.username;
    order.books = args.books;
    order.save$(function (err) {
      if (err) throw err;
      respond(null, { orderid });
    });
  });
};
