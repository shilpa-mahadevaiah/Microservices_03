var pid = 1;

module.exports = function cart(options) {
  this.add({ component: "cart", action: "add" }, function (args, respond) {
    var cart = this.make$("cart");
    cart.list$({ username: args.username }, function (error, entity) {
      if (error) return respond(error);
      if (entity.length == 0) {
        (cart.username = args.username), (cart.items = [args.title]);
        console.log(cart);
        cart.save$(function (error, book) {
          if (error) return respond(error);

          respond(null, { message: "Added to cart" });
        });
      } else {
        if (entity[0].items.includes(args.title))
          respond(null, { message: "Book already in cart" });
        else {
          entity[0].items.push(args.title);
          entity[0].save$(function (error, book) {
            if (error) return respond(error);
            respond(null, { message: "updated the cart" });
          });
        }
      }
    });
  });

  this.add({ component: "cart", action: "view" }, function (args, respond) {
    this.client({host:"account-service", port: 9777 }).act(
      {
        component: "account",
        action: "authorize",
        user: args.user,
      },
      function (error, response) {
        var cart = this.make$("cart");

        if (error) return respond(error, false);

        if (response.status) {
          cart.list$({}, function (err, list) {
            //  console.log("cart view called " + list);
            respond(null, { books: list });
          });
        } else {
          cart.list$({ username: args.user }, function (err, list) {
            respond(null, { books: list });
          });
        }
      }
    );
  });

  this.add({ component: "cart", action: "remove" }, function (args, respond) {
    var cart = this.make$("cart");
    cart.list$({ username: args.username }, function (error, entity) {
      if (error) return respond(error);
      if (entity.length == 0) {
        respond(null, { message: "empty cart" });
      } else if (!entity[0].items.includes(args.title))
        respond(null, { message: "Book doesnot exist in the cart" });
      else {
        entity[0].items = entity[0].items.filter((item) => item != args.title);
        entity[0].save$(function (error, book) {
          if (error) return respond(error);

          respond(null, { message: "removed from cart" });
        });
      }
    });
  });

  this.add({ component: "cart", action: "checkout" }, function (args, respond) {
    this.act(
      { component: "cart", action: "view", user: args.username },

      function (error, response) {
        if (error) throw error;

        if (response.books.length == 0)
          respond(null, { message: "Empty cart! Please add items" });
        else {
          console.log(args.username);
          console.log(response.books[0].items);
          this.client({
            type: "amqp",
            pin: "component: order, action:checkout",
           url: "amqp://guest:guest@rabbitmq:5672",
          }).act(
            "component: order,action:checkout",
            {
              username: args.username,
              books: response.books[0].items,
            },
            function (err, res) {
              if (err) throw err;
              const orderid = res.orderid;
              this.act(
                {
                  component: "cart",
                  action: "removeall",
                  username: args.username,
                },
                function (error, response) {
                  if (error) throw error;
                  // if (response.message == "cart cleared")
                  else
                    respond(null, {
                      message:
                        "Order taken! Order Id for your reference : " + orderid,
                    });
                }
              );
            }
          );
        }
      }
    );
  });

  this.add({ component: "cart", action: "removeall" }, function (
    args,
    respond
  ) {
    var cart = this.make$("cart");
    cart.list$({ username: args.username }, function (error, entity) {
      if (error) return respond(error);

      cart.remove$({ username: args.username }, function (error, book) {
        if (error) return respond(error);

        respond(null, { message: "cart cleared" });
      });
    });
  });
};

