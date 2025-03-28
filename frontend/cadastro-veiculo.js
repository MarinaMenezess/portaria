document.addEventListener("DOMContentLoaded", async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const veiculoId = urlParams.get("id");
  const modoEdicao = urlParams.get("editar") === "1";
  const moradorIdParam = urlParams.get("morador_id");

  await carregarMoradores();

  if (modoEdicao && veiculoId) {
    const resposta = await fetch(`http://localhost:3000/veiculos`);
    const veiculos = await resposta.json();
    const veiculo = veiculos.find(v => v.id == veiculoId);

    if (!veiculo) return alert("Veículo não encontrado.");

    document.getElementById("veiculoId").value = veiculo.id;
    document.getElementById("placa").value = veiculo.placa;
    document.getElementById("modelo").value = veiculo.modelo;
    document.getElementById("cor").value = veiculo.cor;
    document.getElementById("box").value = veiculo.box;
    document.getElementById("morador").value = veiculo.morador_id;
  } else if (moradorIdParam) {
    document.getElementById("morador").value = moradorIdParam;
  }
});

document.getElementById("veiculoForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const veiculoId = document.getElementById("veiculoId").value;
  const dados = {
    placa: document.getElementById("placa").value.trim(),
    modelo: document.getElementById("modelo").value.trim(),
    cor: document.getElementById("cor").value.trim(),
    box: document.getElementById("box").value.trim(),
    morador_id: document.getElementById("morador").value
  };

  const url = veiculoId
    ? `http://localhost:3000/veiculos/${veiculoId}`
    : "http://localhost:3000/veiculos";
  const metodo = veiculoId ? "PUT" : "POST";

  try {
    const resposta = await fetch(url, {
      method: metodo,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dados)
    });

    const resultado = await resposta.json();
    if (resposta.ok) {
      alert(veiculoId ? "Veículo atualizado!" : "Veículo cadastrado!");
      window.history.back();
    } else {
      alert(`Erro: ${resultado.erro}`);
    }
  } catch (erro) {
    alert("Erro ao salvar veículo.");
    console.error(erro);
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
    alert("Erro ao carregar moradores.");
  }
}
