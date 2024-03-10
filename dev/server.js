const express = require('express');
const mysql = require('mysql2');

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const db = mysql.createConnection(
{
  host: 'localhost',
  user: 'root',
  password: 'Brooklyn.99',
  database: 'super_db'
},
console.log('Connected to the super_db database.')
);


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
