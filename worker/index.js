// This file is going to contain all of the logic
// to connect to redis and calculate the fibonacci number
// given the index that we were given by the user.

// In order to connect to the redis server, the keys and 
// password that we are going to use are going to be variables
// stored in another file here in the worker directory

// The keys will contain the hostname and the port 
// that we will use to connect over to redis.
const keys = require('./keys');

// Load the redis libary object
const redis = require('redis');

// Create a connection to redis
// The publisher will serve as the publisher 
// in this case.
const publisher = redis.createClient({
    host: keys.redisHost,
    port: keys.redisPort,
    retry_strategy: () => 1000
});

// I am duplicating the connection to the 
// redis server. This connection is a separate connection
// to the redis server and is the subscriber.

const subscriber = publisher.duplicate();

// Given an index, calculate and return the value.
function fib(index) {
    if (index < 2) return 1;
    return fib(index - 1) + fib(index - 2);
}

// The subscriber can use the "message"
// event to kick off some code.
// When a publisher publishes to a channel,
// this piece of code will run and two objects 
// are expected, which are channel, and the message
// published to that channel.
// After this is done, the publisher connection
// will reference the "values" set, and make a 
// key value pair for the "message" that was published
// and in this case the associated value which
// would be the fibonacci value at an index.

// It would be stored like so:
// Values{4: 5}
// Values{message: fibonacci value}
subscriber.on('message', (channel, message) => {
    publisher.hset('values', message, fib(parseInt(message)));
    console.log('The function in the worker was ran fadsfas faf ');
    console.log('This is the second change that should not be visible');
});

//Subscribing to the "insert" channel
subscriber.subscribe('insert');