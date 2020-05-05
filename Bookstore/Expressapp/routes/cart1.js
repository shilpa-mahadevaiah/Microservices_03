var express = require("express");
var router = express.Router();
var seneca = require("seneca")();

seneca.client({ host: "127.0.0.1", port: 9111 });
seneca.quiet();
console.log("router cart");
router.post("/add", function(httpRequest, httpResponse) {
  seneca.act(
    {
      component: "cart",
      action: "add",
      username: httpRequest.cookies.username,
      title: httpRequest.body.title
    },
    (error, response) => {
      if (error) return httpResponse.send(error);
      httpResponse.send(response.message);
    }
  );
});

router.get("/view", function(httpRequest, httpResponse) {
  seneca.act(
    {
      component: "cart",
      action: "view",
      username: httpRequest.cookies.username
    },
    (error, response) => {
      if (error) return httpResponse.send(error);
      httpResponse.send(response.books);
    }
  );
});
router.delete("/remove", function(httpRequest, httpResponse) {
  seneca.act(
    {
      component: "cart",
      action: "remove",
      username: httpRequest.cookies.username,
      title: httpRequest.body.title
    },
    (error, response) => {
      if (error) return httpResponse.send(error);
      httpResponse.send(response.message);
    }
  );
});

router.get("/checkout", function(httpRequest, httpResponse) {
  seneca.act(
    {
      component: "cart",
      action: "checkout",
      username: httpRequest.cookies.username
    },
    (error, response) => {
      if (error) return httpResponse.send(error);
      httpResponse.send(response.message);
    }
  );
});
module.exports = router;
