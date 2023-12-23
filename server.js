"use strict";

// Import required modules
const { PeerRPCServer } = require("grenache-nodejs-ws");
const Link = require("grenache-nodejs-link");
const OrderBook = require("./src/core/Order");
const {
  FUNC_ADD_ORDER,
  FUNC_MODIFY_ORDER,
  FUNC_REMOVE_ORDER,
} = require("./src/constants");

// Create an instance of the OrderBook
let orderBook = new OrderBook();

// Counter for generating unique order IDs
let simpleTradeCount = 0;

/**
 * Asynchronous function to add an order to the order book.
 * @param {string} type - The type of the order ('buy' or 'sell').
 * @param {string} orderType - The type of the order ('market', 'limit', or 'stop-loss').
 * @param {number} price - The price specified in the order.
 * @param {number} quantity - The quantity specified in the order.
 * @returns {Promise<Object>} - A promise that resolves to an object with a success message.
 * @throws {Error} - Throws an error if there's an issue adding the order.
 */
async function addOrder(type, orderType, price, quantity) {
  try {
    orderBook.addOrder({
      id: ++simpleTradeCount,
      type: type,
      orderType: orderType,
      price: price,
      quantity: quantity,
    });
    orderBook.printOrderBook();
  } catch (e) {
    throw new Error("ErrorAddingOrder");
  }
  return {
    message: "success",
  };
}

/**
 * Asynchronous function to modify an existing order in the order book.
 * @param {number} id - The unique identifier of the order to be modified.
 * @param {number} price - The new price for the order.
 * @param {number} quantity - The new quantity for the order.
 * @returns {Promise<Object>} - A promise that resolves to an object with a success message.
 * @throws {Error} - Throws an error if there's an issue modifying the order.
 */
async function modifyOrder(id, price, quantity) {
  try {
    orderBook.modifyOrder(id, price, quantity);
    orderBook.printOrderBook();
  } catch (e) {
    throw new Error("ErrorModifyingOrder");
  }
  return {
    message: "success",
  };
}

/**
 * Asynchronous function to remove an order from the order book.
 * @param {number} id - The unique identifier of the order to be removed.
 * @returns {Promise<Object>} - A promise that resolves to an object with a success message.
 * @throws {Error} - Throws an error if there's an issue removing the order.
 */
async function removeOrder(id) {
  try {
    orderBook.removeOrder(id);
    orderBook.printOrderBook();
  } catch (e) {
    throw new Error("ErrorDeletingOrder");
  }
  return {
    message: "success",
  };
}

// Create a Link and PeerRPCServer
const link = new Link({
  grape: "http://127.0.0.1:30001",
});
link.start();
const peer = new PeerRPCServer(link, {});
peer.init();
const service = peer.transport("server");
service.listen(1337);

// Announce the service at regular intervals
setInterval(() => {
  link.announce("order_book_worker", service.port, {});
}, 1000);

// Handle incoming requests
service.on("request", async (rid, key, payload, handler) => {
  let result;
  if (payload.function && payload.params) {
    try {
      switch (payload.function) {
        case FUNC_ADD_ORDER:
          if (
            payload.params.type &&
            payload.params.orderType &&
            payload.params.price &&
            payload.params.quantity
          ) {
            result = await addOrder(
              payload.params.type,
              payload.params.orderType,
              payload.params.price,
              payload.params.quantity
            );
          } else {
            throw new Error("ErrorParams");
          }

          break;
        case FUNC_MODIFY_ORDER:
          if (
            payload.params.id &&
            payload.params.price &&
            payload.params.quantity
          ) {
            result = await modifyOrder(
              payload.params.id,
              payload.params.price,
              payload.params.quantity
            );
          } else {
            throw new Error("ErrorParams");
          }
          break;
        case FUNC_REMOVE_ORDER:
          if (payload.params.id) {
            result = await removeOrder(payload.params.id);
          } else {
            throw new Error("ErrorParams");
          }
          break;
        default:
          throw new Error("Function not exists");
      }
    } catch (e) {
      // Reply with an error if there's an issue processing the request
      handler.reply(
        {
          error: e,
        },
        null
      );
    }
    // Reply with the result of the function execution
    handler.reply(null, result);
  }
});
