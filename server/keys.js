module.exports = {
    redisHost: process.env.REDIS_HOST,
    redisPort: process.env.REDIS_PORT,
    pgUser: process.env.PGUSER,
    pgHost: process.env.PGHOST,
    pgDatabase: process.env.PGDATABASE,
    pgPassword: process.env.PGPASSWORD,
    pgPort: process.env.PGPORT
};

// The express server (Which is in the server directory),
// will contain the credentials to both the Postgres database,
// and the redis in memory database. 

// The server file contains the EXPRESS server which will handle
// incoming requests that involve REST HTTP verbs
// GET, POST, PUT, PATCH, DELETE