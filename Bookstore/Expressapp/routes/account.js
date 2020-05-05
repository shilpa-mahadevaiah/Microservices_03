var express = require("express");
var router = express.Router();
var seneca = require("seneca")();

seneca.client({ host:"account-service", port: 9777 });
seneca.quiet();

console.log("acccount router");

router.post("/login", function(httpRequest, httpResponse) {
  seneca.act(
    { component: "account", action: "login", user: httpRequest.body },
    function(error, response) {
      if (error) return httpResponse.send("Service Unavailable!!!");
      console.log(response.value);
      if (response.value == true) {
        httpResponse.cookie("username", httpRequest.body.username);

        httpResponse.send({
          message: "Successfully logged!",
          token: response.token
        });
      } else {
        httpResponse.send("Please check username and password");
      }
    }
  );
});

router.post("/register", function(httpRequest, httpResponse) {
  console.log(httpRequest.body);
  seneca.act(
    { component: "account", action: "register", user: httpRequest.body },
    function(error, response) {
      if (error) return httpResponse.send("Service Unavailable!!!");
      if (response.value == true) {
        httpResponse.send("Account has been created");
      } else {
        httpResponse.send(
          "Seems like an account with the same username already exists"
        );
      }
    }
  );
});

module.exports = router;
