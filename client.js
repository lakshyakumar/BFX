"use strict";

// Import required modules
const { PeerRPCClient } = require("grenache-nodejs-ws");
const Link = require("grenache-nodejs-link");
const {
  FUNC_ADD_ORDER,
  TYPE_BUY,
  ORDER_LIMIT,
  TYPE_SELL,
  FUNC_MODIFY_ORDER,
  FUNC_REMOVE_ORDER,
} = require("./src/constants");

// Create a Link with specified options
const link = new Link({
  grape: "http://127.0.0.1:30001",
  requestTimeout: 10000,
});
link.start();

// Create a PeerRPCClient and initialize it
const peer = new PeerRPCClient(link, {});
peer.init();

/**
 * Sends a request to a worker using PeerRPCClient.
 * @param {string} worker_name - The name of the worker to send the request to.
 * @param {string} func - The function to be executed by the worker.
 * @param {Object} params - The parameters for the function.
 * @returns {Promise<Object>} - A promise that resolves to the result of the worker's function.
 */
function peerRequest(worker_name, func, params) {
  return new Promise((res, rej) => {
    peer.request(
      worker_name,
      {
        function: func,
        params,
      },
      { timeout: 100000 },
      (err, result) => {
        if (err) rej(err);
        res(result);
      }
    );
  });
}

/**
 * Simulates a client interacting with the order book.
 * Adds, modifies, and removes orders from the order book.
 */
async function simulateClient() {
  try {
    // Adding the first order for BUY LIMIT 10 ETH and 5 units
    await peerRequest("order_book_worker", FUNC_ADD_ORDER, {
      type: TYPE_BUY,
      orderType: ORDER_LIMIT,
      price: 10,
      quantity: 5,
    });
    console.log("Added :: first order for BUY LIMIT 10 ETH and 5 units");
  } catch (e) {
    console.log("error while sending order 1");
  }

  try {
    // Adding the second order for SELL LIMIT 10 ETH and 3 units
    await peerRequest("order_book_worker", FUNC_ADD_ORDER, {
      type: TYPE_SELL,
      orderType: ORDER_LIMIT,
      price: 10,
      quantity: 3,
    });
    console.log("Added :: second order for SELL LIMIT 10 ETH and 3 units");
  } catch (e) {
    console.log("error while sending order 2");
  }

  try {
    // Adding the third order for SELL LIMIT 10.2 ETH and 3 units
    await peerRequest("order_book_worker", FUNC_ADD_ORDER, {
      type: TYPE_SELL,
      orderType: ORDER_LIMIT,
      price: 10.2,
      quantity: 3,
    });
    console.log("Added :: third order for SELL LIMIT 10.2 ETH and 3 units");
  } catch (e) {
    console.log("error while sending order 3");
  }

  try {
    // Modifying the third order for SELL LIMIT 10 ETH and 3 units
    await peerRequest("order_book_worker", FUNC_MODIFY_ORDER, {
      id: 3,
      price: 10,
      quantity: 3,
    });
    console.log("modified :: third order for SELL LIMIT 10 ETH and 3 units");
  } catch (e) {
    console.log("error while modifying order 3");
  }

  try {
    // Removing the third order for SELL LIMIT 10 ETH and 3 units
    await peerRequest("order_book_worker", FUNC_REMOVE_ORDER, {
      id: 3,
    });
    console.log("deleted :: third order for SELL LIMIT 10 ETH and 3 units");
  } catch (e) {
    console.log("error while deleting order 3");
  }
}

// Call the simulateClient function
simulateClient();
