
const keys = require('./keys');

// Express app setup
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');


// Create the express object into app
// NOTE* The app object will respond to any HTTP requests
//       that are coming or going back to the REACT application.
const app = express();

// Cross origin resource sharing, allow us to make requests from one domain that
// the react app is going to be running on to express app on different port.
app.use(cors());
app.use(bodyParser.json());

// Postgres client setup
const { Pool } = require('pg');
const pgClient = new Pool({
    user: keys.pgUser,
    host: keys.pgHost,
    database: keys.pgDatabase,
    password: keys.pgPassword,
    port: keys.pgPort,
    ssl:
      process.env.NODE_ENV !== 'production'
        ? false
        : { rejectUnauthorized: false },
  });

pgClient.on("connect", (client) => {
    client
      .query("CREATE TABLE IF NOT EXISTS values (number INT)")
      .catch((err) => console.error(err));
  });

// Redis client setup
const redis = require('redis');

const redisClient = redis.createClient({
    host: keys.redisHost,
    port: keys.redisPort,
    retry_strategy: () => 1000
});

const publisher = redisClient.duplicate();

// Express route handlers

app.get('/', (req, res) => {
    res.send('hi');
});

app.get('/values/all', async (req, res) => {
    const values = await pgClient.query('SELECT * FROM values');

    res.send(values.rows);
});
app.get('/values/current', async (req, res) => {
    redisClient.hgetall('values', (err, values) => {
        res.send(values);
    });
});

app.post('/values', async (req, res) => {
    const index = req.body.index;
    
    if (parseInt(index) >= 21) {
        res.status(422).send('Index needs to be less than 21');
    }
    // set a value of nothing yet on the values hashset on index
    redisClient.hset('values',index, 'Nothing yet!');
    console.log('This function inside of the server justafsdsfasfdsafsafdsafdsaf ran');
    // Publish to the insert channel
    // This is going to wake up the worker process and say hey
    // calculate the fib value for it.
    publisher.publish('insert', index);

    pgClient.query('INSERT INTO values(number) VALUES($1)', [index]);
    res.send({ working: true })
});

app.listen(4000, err =>{
    console.log('Listening');
})