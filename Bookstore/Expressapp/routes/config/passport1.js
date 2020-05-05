var JwtStrategy = require("passport-jwt").Strategy,
  ExtractJwt = require("passport-jwt").ExtractJwt;
var Seneca = require("seneca");
var entities = require("seneca-entity");

var seneca = Seneca();
seneca.use(entities).use("mongo-store", {
  name: "casestudydb",
  host: "127.0.0.1",
  port: 27017
});

module.exports = function(passport) {
  var opts = {};
  opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
  opts.secretOrKey = "galaxy";
  passport.use(
    new JwtStrategy(opts, function(jwt_payload, done) {
      var users = seneca.make$("users");
      users.list$({ id: jwt_payload.id }, (err, user) => {
        if (err) {
          return done(err, false);
        }
        if (user) {
          done(null, user);
        } else {
          done(null, false);
        }
      });
    })
  );
};
