var seneca = require("seneca")();
var entities = require("seneca-entity");

seneca.quiet();
seneca.use(entities);

seneca.use("mongo-store", {
  uri: 'mongodb://mongo1:27017/accountdb'
});
seneca.use(require("./account"), { secretOrKey: "galaxy" });
seneca.ready(function(err) {
  console.log("server is ready!!!!");
  /* seneca.act({component:'account',action:'register',user:{username:'Tanu',password:'t123',email:'tanu@abc.com'}}, function(err, response) {
            console.log(response.value);
      }) 
      seneca.act({component:'account',action:'login',user:{username:'anu',password:'t123'}}, function(err, response) {
        console.log(response);
  })*/
  seneca.listen({port: 9777 });
});
