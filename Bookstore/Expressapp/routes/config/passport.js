var JwtStrategy = require("passport-jwt").Strategy,
  ExtractJwt = require("passport-jwt").ExtractJwt;
var Seneca = require("seneca")();
module.exports = function(passport) {
  var opts = {};
  opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
  opts.secretOrKey = "galaxy";

  passport.use(
    new JwtStrategy(opts, function(jwt_payload, done) {
      Seneca.client({ host: "account-service", port: 9777 }).act(
        {
          component: "account",
          action: "authenticate",
          id: jwt_payload.id
        },
        function(error, response) {
          if (error) {
            return done(error, false);
          }
          if (response.user) {
            done(null, response.user);
          } else {
            done(null, false);
          }
        }
      );
    })
  );
};
