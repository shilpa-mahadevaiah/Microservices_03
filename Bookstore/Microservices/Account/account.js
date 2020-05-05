var Jwt = require("jsonwebtoken");

module.exports = function account(options) {
  this.add({ component: "account", action: "login" }, function(data, respond) {
    var users = this.make$("users");
    //console.log(data.user);
    users.list$(
      { username: data.user.username, password: data.user.password },
      function(error, entity) {
        if (error) return respond(error);
        console.log(entity);
        if (entity.length == 0) {
          respond(null, { value: false });
        } else {
          //console.log(entity[0].id)
          //respond(null, {value: true});
          var payload = { id: entity[0].id };
          var token = Jwt.sign(payload, options.secretOrKey);
          //console.log(token)
          respond(null, { value: true, token: token });
        }
      }
    );
  });
  this.add({ component: "account", action: "register" }, function(
    data,
    respond
  ) {
    // console.log("Got a post request");
    var users = this.make$("users");
    console.log(data.user);
    users.list$({ username: data.user.username }, function(error, entity) {
      if (error) return respond(error);
      console.log(entity);
      if (entity.length == 0) {
        data.user.role = "user";
        var newuser = users.data$(data.user);
        console.log("New user " + newuser);
        newuser.save$(function(error, entity) {
          if (error) return respond(error);

          respond(null, { value: true });
        });
      } else {
        respond(null, { value: false });
      }
    });
  });
  this.add({ component: "account", action: "authenticate" }, function(
    data,
    respond
  ) {
    var users = this.make$("users");

    users.list$({ id: data.id }, (err, user) => {
      if (err) {
        return respond(err, false);
      }
      if (user) {
        console.log("Got the user object " + user[0].username);
        respond(null, { user: user[0].username });
      } else {
        respond(null, { error: "User doesnot exist" });
      }
    });
  });
  this.add({ component: "account", action: "authorize" }, function(
    data,
    respond
  ) {
    var users = this.make$("users");

    users.list$({ username: data.user }, (err, user) => {
      if (err) {
        return respond(err, false);
      }
      if (user[0].role == "admin") {
        console.log("Got the user object " + user[0].role);
        respond(null, { status: true });
      } else {
        respond(null, { status: false });
      }
    });
  });
};
