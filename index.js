const {
  ORDER_LIMIT,
  ORDER_MARKET,
  TYPE_BUY,
  TYPE_SELL,
} = require("./src/constants/index.js");
const OrderBook = require("./src/core/Order.js");

// Create a new instance of the OrderBook
let orderBook = new OrderBook();

// Add a buy order to the order book
orderBook.addOrder({
  id: 1,
  type: TYPE_BUY,
  orderType: ORDER_LIMIT,
  price: 10,
  quantity: 5,
});

// Add sell orders to the order book
orderBook.addOrder({
  id: 2,
  type: TYPE_SELL,
  orderType: ORDER_LIMIT,
  price: 10,
  quantity: 3,
});
orderBook.addOrder({
  id: 3,
  type: TYPE_SELL,
  orderType: ORDER_LIMIT,
  price: 10.2,
  quantity: 3,
});
orderBook.addOrder({
  id: 4,
  type: TYPE_SELL,
  orderType: ORDER_LIMIT,
  price: 10.3,
  quantity: 3,
});

// Print the updated state of the order book
orderBook.printOrderBook();

// Add a market buy order to the order book
orderBook.addOrder({
  id: 5,
  type: TYPE_BUY,
  orderType: ORDER_MARKET,
  price: 0,
  quantity: 4,
});

// Print the updated state of the order book
orderBook.printOrderBook();

// Modify an existing order in the order book
orderBook.modifyOrder(1, 10.2, 4);

// Remove an order from the order book
orderBook.removeOrder(4);

// Print the final state of the order book
orderBook.printOrderBook();
