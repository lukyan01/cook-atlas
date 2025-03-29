const pool = require('./db');

pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Error executing query', err.stack);
  } else {
    console.log('Database connected:', res.rows[0]); //connection successful 
  }
  pool.end(); //end connection, currently as soon as connection is made
});
