var seneca = require("seneca")();
seneca.use("seneca-amqp-transport");

function dispatcher(options) {
  this.add({ component: "order", action: "checkout" }, function(args, respond) {
    console.log("Received an order of Rs. " + args.billamount);
    respond(null, { orderid: Math.floor(Math.random() * 100) });
  });
}

seneca.use(dispatcher).listen({
  type: "amqp",
  pin: "component: order",
  url: "amqp://guest:guest@localhost:5672"
});
