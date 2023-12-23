const { ORDER_MARKET, TYPE_BUY } = require("../constants/index.js");

class OrderBook {
  /**
   * Represents the order book.
   */
  constructor() {
    this.buyOrders = []; // Array to store buy orders
    this.sellOrders = []; // Array to store sell orders
  }

  /**
   * Adds a new order to the order book.
   * @param {Object} order - The order to be added to the order book.
   */
  addOrder(order) {
    if (order.type === TYPE_BUY) {
      let price = order.orderType === ORDER_MARKET ? 0 : order.price;
      this.buyOrders.push({ ...order, price });
    } else {
      let price = order.orderType === ORDER_MARKET ? 0 : order.price;
      this.sellOrders.push({ ...order, price });
    }
    this.sortOrders();
    this.matchOrders();
  }

  /**
   * Matches buy and sell orders in the order book.
   * Executes trades between matching orders.
   */
  matchOrders() {
    while (this.buyOrders.length > 0 && this.sellOrders.length > 0) {
      const bestBuyOrder = this.buyOrders[0];
      const bestSellOrder = this.sellOrders[0];
      if (bestBuyOrder.price >= bestSellOrder.price) {
        this.executeTrade(bestBuyOrder, bestSellOrder);
      } else if (bestBuyOrder.price === 0 || bestSellOrder.price === 0) {
        this.executeTrade(bestBuyOrder, bestSellOrder);
      } else {
        // No more matching orders
        break;
      }
    }
  }

  /**
   * Executes a trade between a buy order and a sell order.
   * @param {Object} buyOrder - The buy order.
   * @param {Object} sellOrder - The sell order.
   */
  executeTrade(buyOrder, sellOrder) {
    const quantity = Math.min(buyOrder.quantity, sellOrder.quantity);
    const trade = {
      buyOrderId: buyOrder.id,
      sellOrderId: sellOrder.id,
      price: sellOrder.price ? sellOrder.price : buyOrder.price,
      quantity: quantity,
    };

    console.log("Trade Executed:", trade);

    // Update order quantities
    buyOrder.quantity -= quantity;
    sellOrder.quantity -= quantity;

    // Remove fully filled orders
    if (buyOrder.quantity === 0) {
      this.buyOrders.shift();
    }

    if (sellOrder.quantity === 0) {
      this.sellOrders.shift();
    }
  }

  /**
   * Sorts buy and sell orders in the order book by price.
   */
  sortOrders() {
    this.buyOrders.sort((a, b) => a.price - b.price); // Sort by price and time
    this.sellOrders.sort((a, b) => a.price - b.price); // Sort by price and time
  }

  /**
   * Prints the current state of the order book.
   */
  printOrderBook() {
    if (this.buyOrders.length === 0 && this.sellOrderIndex.length === 0) {
      console.log("Order book clear");
    }
    this.buyOrders.forEach((order) => {
      console.log(
        "Book instance: \n",
        "BID",
        order.id,
        order.orderType,
        order.price,
        order.quantity
      );
    });
    this.sellOrders.forEach((order) => {
      console.log(
        "ASK",
        order.id,
        order.orderType,
        order.price,
        order.quantity
      );
    });
  }

  /**
   * Modifies an existing order by ID.
   * @param {number} orderId - The unique identifier of the order to be modified.
   * @param {number} newPrice - The new price for the order.
   * @param {number} newQuantity - The new quantity for the order.
   */
  modifyOrder(orderId, newPrice, newQuantity) {
    const findOrder = (order) => order.id === orderId;

    const buyOrderIndex = this.buyOrders.findIndex(findOrder);
    const sellOrderIndex = this.sellOrders.findIndex(findOrder);

    if (buyOrderIndex !== -1) {
      this.buyOrders[buyOrderIndex].price = newPrice;
      this.buyOrders[buyOrderIndex].quantity = newQuantity;
    }

    if (sellOrderIndex !== -1) {
      this.sellOrders[sellOrderIndex].price = newPrice;
      this.sellOrders[sellOrderIndex].quantity = newQuantity;
    }

    this.sortOrders();
    this.matchOrders();
  }

  /**
   * Removes an order by ID.
   * @param {number} orderId - The unique identifier of the order to be removed.
   */
  removeOrder(orderId) {
    this.buyOrders = this.buyOrders.filter((order) => order.id !== orderId);
    this.sellOrders = this.sellOrders.filter((order) => order.id !== orderId);
  }
}

// Export the OrderBook class
module.exports = OrderBook;
