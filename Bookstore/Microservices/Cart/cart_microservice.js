var seneca = require("seneca")();
var entities = require("seneca-entity");

seneca.quiet();
seneca.use(entities);
seneca.use(require("./cart"));
seneca.use(
  "seneca-amqp-transport"
);
seneca.use("mongo-store", {
  uri:'mongodb://mongo2:27017/cartdb'
});

seneca.ready(function (err) {
  console.log("server is ready!!!!");
  seneca.listen({  port: 9111 });
});
