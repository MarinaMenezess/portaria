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

// Conexão com o banco de dados MySQL
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

db.connect(err => {
    if (err) {
        console.error("Erro ao conectar ao banco de dados:", err);
    } else {
        console.log("Banco de dados conectado!");
    }
});

// 🚀 Rota para cadastrar moradores
app.post("/moradores", (req, res) => {
    const { nome, bloco, apartamento, telefone, email, status } = req.body;
    
    if (!nome || !bloco || !apartamento || !status) {
        return res.status(400).json({ erro: "Preencha todos os campos obrigatórios!" });
    }

    const query = "INSERT INTO moradores (nome, bloco, apartamento, telefone, email, status) VALUES (?, ?, ?, ?, ?, ?)";
    db.query(query, [nome, bloco, apartamento, telefone, email, status], (err, result) => {
        if (err) {
            console.error("Erro ao cadastrar morador:", err);
            return res.status(500).json({ erro: "Erro no servidor" });
        }
        res.status(201).json({ mensagem: "Morador cadastrado com sucesso!", id: result.insertId });
    });
});

// 🚀 Rota para listar todos os moradores
app.get("/moradores", (req, res) => {
    db.query("SELECT * FROM moradores", (err, results) => {
        if (err) {
            return res.status(500).json({ erro: "Erro ao buscar moradores" });
        }
        res.json(results);
    });
});

// 🚀 Rota para cadastrar veículos
app.post("/veiculos", (req, res) => {
    const { placa, modelo, cor, morador_id, box } = req.body;

    if (!placa || !modelo || !cor || !morador_id || !box) {
        return res.status(400).json({ erro: "Preencha todos os campos obrigatórios!" });
    }

    const query = "INSERT INTO veiculos (placa, modelo, cor, morador_id, box) VALUES (?, ?, ?, ?, ?)";
    db.query(query, [placa, modelo, cor, morador_id, box], (err, result) => {
        if (err) {
            console.error("Erro ao cadastrar veículo:", err);
            return res.status(500).json({ erro: "Erro no servidor" });
        }
        res.status(201).json({ mensagem: "Veículo cadastrado com sucesso!", id: result.insertId });
    });
});

// 🚀 Rota para listar todos os veículos
app.get("/veiculos", (req, res) => {
    db.query("SELECT * FROM veiculos", (err, results) => {
        if (err) {
            return res.status(500).json({ erro: "Erro ao buscar veículos" });
        }
        res.json(results);
    });
});

// 🚀 Rota para listar moradores e seus veículos
app.get("/moradores-veiculos", (req, res) => {
    const query = `
        SELECT 
            m.id AS morador_id, 
            m.nome, 
            m.bloco, 
            m.apartamento, 
            m.telefone, 
            m.email, 
            m.status, 
            v.placa, 
            v.modelo, 
            v.cor, 
            v.box 
        FROM moradores m
        LEFT JOIN veiculos v ON m.id = v.morador_id
        ORDER BY m.id;
    `;

    db.query(query, (err, results) => {
        if (err) {
            console.error("Erro ao buscar moradores e veículos:", err);
            return res.status(500).json({ erro: "Erro ao buscar dados" });
        }
        res.json(results);
    });
});

// Inicia o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
