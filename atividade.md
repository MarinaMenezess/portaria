# **Pair Programming - Aplicação Web para Controle de Portaria**  

## **Objetivo**  
Desenvolver uma aplicação web para controle de portaria de um condomínio, garantindo **responsividade**, **acessibilidade** e um **backend RESTful** utilizando **MySQL** como banco de dados.  

---

## **Requisitos Técnicos**  

### **1. Interface Web**  
- **Tela Desktop** com design adaptado para monitores maiores.  
- **Versão Mobile**, utilizando **Media Queries** para ajustes de layout.  
- **Evento `resize` em JavaScript** para modificar dinamicamente elementos da interface com base no tamanho da tela.  

### **2. Acessibilidade**  
- Seguir as diretrizes da **Checklist de Acessibilidade do SAPO.UX** para garantir uma experiência inclusiva.  
- Implementação de boas práticas como **contraste adequado, navegação acessível por teclado, descrições para leitores de tela e foco visível nos elementos interativos**.  

### **3. Funcionalidades**  

#### **Cadastro de Morador**  
- Nome completo  
- Bloco e apartamento  
- Contato (telefone e e-mail)  
- Status (residente/proprietário/visitante)  

#### **Cadastro de Veículo**  
- Placa  
- Modelo e cor  
- Morador associado (relacionamento com a tabela de moradores)  
- Número da vaga (box)  

#### **Regras de Relacionamento**  
- Cada morador pode ter **um ou mais veículos** cadastrados.  
- Cada veículo deve estar vinculado a um **único morador** e um **único box**.  

---

## **4. Banco de Dados (MySQL)**  

### **Tabelas**  

#### **Tabela `moradores`**  
Guarda os dados de cada morador do condomínio.  
Contendo id, nome, bloco, apartamento, telefone, email, status (é tipo enum e deve ter: residente, proprietário, visitante) e um "criado_em" tipo timestamp.

#### **Tabela `veiculos`**  
Guarda os veículos associados a cada morador.  
Contendo id, placa, modelo, cor, morador_id, box, e um "criado_em" utilizando timestamp.

#### **Relacionamento:**  
- **1 morador pode ter vários veículos.**  
- **Cada veículo pertence a 1 morador.**  
- **Cada veículo tem um número de vaga (box).**  

---

## **5. Backend RESTful**  
- Desenvolvido em **JavaScript (Node.js) + MySQL**, seguindo a estrutura RESTful.  
- **CRUD** para moradores e veículos:  
  - **POST /moradores** → Cadastro de morador  
  - **GET /moradores** → Listagem de moradores  
  - **PUT /moradores/{id}** → Atualização de morador  
  - **DELETE /moradores/{id}** → Exclusão de morador  
  - **POST /veiculos** → Cadastro de veículo  
  - **GET /veiculos** → Listagem de veículos  
  - **PUT /veiculos/{id}** → Atualização de veículo  
  - **DELETE /veiculos/{id}** → Exclusão de veículo  

---

## **6. Implementação e Tecnologias**  
- **Frontend:** HTML, CSS (Media Queries), JavaScript (eventos `resize` e manipulação dinâmica do DOM).  
- **Backend:** Node.js com MySQL.  
- **Banco de Dados:** MySQL, com as tabelas **moradores** e **veiculos**.  

Se precisar de mais detalhes ou ajustes, me avise.