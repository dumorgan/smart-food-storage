const pg = require('pg')
const connectionString = "postgres://postgres:7921@localhost:5432/pi_db"

const client = new pg.Client(connectionString);

client.connect();

const query = 
