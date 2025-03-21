document.addEventListener("DOMContentLoaded", async () => {
    await carregarMoradores();
  });
  
  document.getElementById("veiculoForm").addEventListener("submit", async (e) => {
    e.preventDefault();
  
    const dados = {
      placa: document.getElementById("placa").value.trim(),
      modelo: document.getElementById("modelo").value.trim(),
      cor: document.getElementById("cor").value.trim(),
      box: document.getElementById("box").value.trim(),
      morador_id: document.getElementById("morador").value
    };
  
    if (!dados.placa || !dados.modelo || !dados.cor || !dados.box || !dados.morador_id) {
      alert("Preencha todos os campos.");
      return;
    }
  
    try {
      const resposta = await fetch("http://localhost:3000/veiculos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dados)
      });
  
      const resultado = await resposta.json();
  
      if (resposta.ok) {
        alert("Veículo cadastrado com sucesso!");
        document.getElementById("veiculoForm").reset();
      } else {
        alert(`Erro: ${resultado.erro || "Falha ao cadastrar veículo."}`);
      }
    } catch (erro) {
      console.error("Erro ao conectar com o servidor:", erro);
      alert("Erro ao conectar com o servidor.");
    }
  });
  
  async function carregarMoradores() {
    try {
      const resposta = await fetch("http://localhost:3000/moradores");
      const moradores = await resposta.json();
  
      const select = document.getElementById("morador");
      moradores.forEach(m => {
        const option = document.createElement("option");
        option.value = m.id;
        option.textContent = `${m.nome} - Bloco ${m.bloco} / Apt ${m.apartamento}`;
        select.appendChild(option);
      });
    } catch (erro) {
      console.error("Erro ao carregar moradores:", erro);
      alert("Não foi possível carregar a lista de moradores.");
    }
  }
  