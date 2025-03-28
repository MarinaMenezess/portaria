const mysql = require("mysql2");

// Conexão com MySQL
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'condominio'
  });
  
  db.connect(err => {
    if (err) {
      console.error("Erro ao conectar ao banco:", err);
    } else {
      console.log("Conectado ao banco de dados.");
    }
  });

  module.exports = db;