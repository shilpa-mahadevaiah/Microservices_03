var express = require("express");
var router = express.Router();
var seneca = require("seneca")();
var passport = require("passport");
require("./config/passport")(passport);
seneca.client({ host: "cart-service", port: 9111 });
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
      if (error) return httpResponse.send("Service Unavailable!!!");
      httpResponse.send(response.message);
    }
  );
});

router.get("/view", passport.authenticate("jwt", { session: false }), function(
  httpRequest,
  httpResponse
) {
  //httpResponse.send(httpRequest.user);
  if (httpRequest.user) {
    seneca.act(
      {
        component: "cart",
        action: "view",
        user: httpRequest.user
      },
      (error, response) => {
        if (error) return httpResponse.send("Service Unavailable!!!");
        httpResponse.send(response.books);
      }
    );
  } else httpResponse.send("Login please");
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
      if (error) return httpResponse.send("Service Unavailable!!!");
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
      if (error) return httpResponse.send("Checkout Service Unavailable!!!");
      httpResponse.send(response.message);
    }
  );
});
module.exports = router;
