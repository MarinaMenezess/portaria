require("dotenv").config();
const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Conexão com MySQL
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

db.connect(err => {
  if (err) {
    console.error("Erro ao conectar ao banco:", err);
  } else {
    console.log("Conectado ao banco de dados.");
  }
});

// 🚀 POST /moradores — Cadastro com restrição por status
app.post("/moradores", (req, res) => {
  const { nome, bloco, apartamento, telefone, email, status } = req.body;

  if (!nome || !bloco || !apartamento || !status) {
    return res.status(400).json({ erro: "Campos obrigatórios ausentes." });
  }

  const verificarQuery = `
    SELECT COUNT(*) AS total
    FROM moradores
    WHERE bloco = ? AND apartamento = ? AND status = ?
  `;

  db.query(verificarQuery, [bloco, apartamento, status], (err, results) => {
    if (err) return res.status(500).json({ erro: "Erro ao verificar restrições." });

    const { total } = results[0];
    const limite = (status === 'residente' || status === 'proprietário') ? 1 : 999;

    if (total >= limite) {
      return res.status(400).json({ erro: `Já existe um ${status} neste apartamento.` });
    }

    const insertQuery = `
      INSERT INTO moradores (nome, bloco, apartamento, telefone, email, status)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    db.query(insertQuery, [nome, bloco, apartamento, telefone, email, status], (err, result) => {
      if (err) return res.status(500).json({ erro: "Erro ao inserir morador." });
      res.status(201).json({ mensagem: "Morador cadastrado com sucesso!", id: result.insertId });
    });
  });
});

// 🚀 GET /moradores — Listar todos
app.get("/moradores", (req, res) => {
  db.query("SELECT * FROM moradores", (err, results) => {
    if (err) return res.status(500).json({ erro: "Erro ao buscar moradores" });
    res.json(results);
  });
});

// 🚀 PUT /moradores/:id — Atualizar morador
app.put("/moradores/:id", (req, res) => {
  const { id } = req.params;
  const { nome, bloco, apartamento, telefone, email, status } = req.body;

  const query = `
    UPDATE moradores SET nome = ?, bloco = ?, apartamento = ?, telefone = ?, email = ?, status = ?
    WHERE id = ?
  `;
  db.query(query, [nome, bloco, apartamento, telefone, email, status, id], (err, result) => {
    if (err) return res.status(500).json({ erro: "Erro ao atualizar morador" });
    res.json({ mensagem: "Morador atualizado com sucesso!" });
  });
});

// 🚀 DELETE /moradores/:id — Excluir morador
app.delete("/moradores/:id", (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM moradores WHERE id = ?", [id], (err, result) => {
    if (err) return res.status(500).json({ erro: "Erro ao excluir morador" });
    res.json({ mensagem: "Morador excluído com sucesso!" });
  });
});

// 🚘 POST /veiculos — Cadastro com limite por apto
app.post("/veiculos", (req, res) => {
  const { placa, modelo, cor, morador_id, box } = req.body;

  if (!placa || !modelo || !cor || !morador_id || !box) {
    return res.status(400).json({ erro: "Campos obrigatórios ausentes." });
  }

  const contarQuery = `
    SELECT COUNT(*) AS total
    FROM veiculos v
    JOIN moradores m ON v.morador_id = m.id
    WHERE m.bloco = (SELECT bloco FROM moradores WHERE id = ?) AND
          m.apartamento = (SELECT apartamento FROM moradores WHERE id = ?)
  `;

  db.query(contarQuery, [morador_id, morador_id], (err, results) => {
    if (err) return res.status(500).json({ erro: "Erro ao verificar veículos" });

    if (results[0].total >= 2) {
      return res.status(400).json({ erro: "Limite de 2 veículos por apartamento atingido." });
    }

    const insertQuery = `
      INSERT INTO veiculos (placa, modelo, cor, morador_id, box)
      VALUES (?, ?, ?, ?, ?)
    `;
    db.query(insertQuery, [placa, modelo, cor, morador_id, box], (err, result) => {
      if (err) return res.status(500).json({ erro: "Erro ao cadastrar veículo" });
      res.status(201).json({ mensagem: "Veículo cadastrado com sucesso!", id: result.insertId });
    });
  });
});

// 🚘 GET /veiculos — Listar todos
app.get("/veiculos", (req, res) => {
  db.query("SELECT * FROM veiculos", (err, results) => {
    if (err) return res.status(500).json({ erro: "Erro ao buscar veículos" });
    res.json(results);
  });
});

// 🚘 PUT /veiculos/:id — Atualizar veículo
app.put("/veiculos/:id", (req, res) => {
  const { id } = req.params;
  const { placa, modelo, cor, morador_id, box } = req.body;

  const query = `
    UPDATE veiculos
    SET placa = ?, modelo = ?, cor = ?, morador_id = ?, box = ?
    WHERE id = ?
  `;
  db.query(query, [placa, modelo, cor, morador_id, box, id], (err, result) => {
    if (err) return res.status(500).json({ erro: "Erro ao atualizar veículo" });
    res.json({ mensagem: "Veículo atualizado com sucesso!" });
  });
});

// 🚘 DELETE /veiculos/:id — Excluir veículo
app.delete("/veiculos/:id", (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM veiculos WHERE id = ?", [id], (err, result) => {
    if (err) return res.status(500).json({ erro: "Erro ao excluir veículo" });
    res.json({ mensagem: "Veículo excluído com sucesso!" });
  });
});

// 🚀 GET /moradores-veiculos — JOIN
app.get("/moradores-veiculos", (req, res) => {
  const query = `
    SELECT 
      m.id AS morador_id,
      m.nome, m.bloco, m.apartamento, m.telefone, m.email, m.status,
      v.id AS veiculo_id, v.placa, v.modelo, v.cor, v.box
    FROM moradores m
    LEFT JOIN veiculos v ON m.id = v.morador_id
    ORDER BY m.id;
  `;

  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ erro: "Erro ao buscar dados combinados" });
    res.json(results);
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
