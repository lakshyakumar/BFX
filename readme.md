# BFX

This project implements a basic order book system with peer-to-peer communication using Grenache and Node.js.

## Files

1. **Order.js**

   - Defines the `OrderBook` class for representing individual orders and managing the order book.

2. **constants.js**

   - Defines constants used throughout the project, such as order types, order statuses, and functions.

3. **server.js**

   - Implements a worker that communicates with the order book using Grenache RPC.
   - Exposes functions to add, modify, and remove orders.

4. **client.js**

   - Simulates a client interacting with the order book.
   - Sends requests to add, modify, and remove orders.

5. **index.js**

   - This file. provides a script to test the algo wihtout running the server and clients.

6. **README.md**

   - This file. Provides an overview of the project, its files, and how to use it.

## Assumptions and abstraction

- For simple Excahnge we have selected only one commodity, it can be multiple comodities and multiple order books bor each one.
- Prepared cases for limit and market orders only, it could be coded to include more order types.
- Based on naive algorithm from scratch.

## Improvements

- Addition of queue based system for handling fifo better.
- More evolved error and type checks.
- Introduction of logger and logfiles.
- Returning response and error codes for better handling.
- More time to get fammiliar with Grenache and order book algorithms.
- order books to handle multiple commodities.

## Installation

Use the package manager [npm](https://npmjs.com/) to install BFX.

```bash
npm install
```

## Usage

- Run script to teast excahnge algorithm.

```bash
npm run script
```

To run in p2p mode
-prerequite for grape client

```bash
grape --dp 20001 --aph 30001 --bn '127.0.0.1:20002'
grape --dp 20002 --aph 40001 --bn '127.0.0.1:20001'
```

- Run server.

```bash
npm run server
```

- Run client.

```bash
npm run client
```

## Contributing

Pull requests are welcome. For major changes, please open an issue first
to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License

[MIT](https://choosealicense.com/licenses/mit/)
