var express = require("express");
var router = express.Router();
var seneca = require("seneca")();

seneca.client({
  host: "catalog-service",
  port: "9090",
  pin: { component: "catalog" }
});
seneca.quiet();

router.get("/title/:booktitle", function(httpRequest, httpResponse) {
  seneca.act(
    { component: "catalog", by: "title", title: httpRequest.params.booktitle },
    (error, response) => {
      if (error) return httpResponse.send("Service Unavailable!!!");
      console.log(response.book);
      if (!response.book.message) {
        httpResponse.send(response.book);
      } else {
        httpResponse.status(404).send(response.book);
      }
    }
  );
});

router.get("/category/:bookcategory", function(httpRequest, httpResponse) {
  console.log(httpRequest.params.bookcategory);
  seneca.act(
    {
      component: "catalog",
      by: "category",
      category: httpRequest.params.bookcategory
    },
    (error, response) => {
      if (error) return httpResponse.send("Service Unavailable!!!");

      if (response.book.length > 0) {
        httpResponse.send(response.book);
      } else {
        httpResponse.status(404).send(response.book);
      }
    }
  );
});
router.get("/category/:bookcategory/review/:reviewvalue", function(
  httpRequest,
  httpResponse
) {
  console.log("review");
  seneca.act(
    {
      component: "catalog",
      by: "category",
      category: httpRequest.params.bookcategory,
      reviews: httpRequest.params.reviewvalue
    },
    (error, response) => {
      if (error) return httpResponse.send("Service Unavailable!!!");

      if (response.book.length > 0) {
        httpResponse.send(response.book);
      } else {
        httpResponse.status(404).send(response.book);
      }
    }
  );
});
module.exports = router;
