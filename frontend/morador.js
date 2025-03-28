const urlParams = new URLSearchParams(window.location.search);
const moradorId = urlParams.get("id");

document.addEventListener("DOMContentLoaded", async () => {
  if (!moradorId) {
    alert("Morador não encontrado.");
    return;
  }

  document.getElementById("moradorId").value = moradorId;

  await carregarMorador();
  await carregarVeiculos();

  document.getElementById("moradorForm").addEventListener("submit", atualizarMorador);
  document.getElementById("adicionarVeiculo").addEventListener("click", () => {
    window.location.href = `cadastro-veiculo.html?morador_id=${moradorId}`;
  });
});

async function carregarMorador() {
  const resposta = await fetch(`http://localhost:3000/moradores`);
  const moradores = await resposta.json();
  const morador = moradores.find(m => m.id == moradorId);

  if (!morador) {
    alert("Morador não encontrado.");
    return;
  }

  document.getElementById("nome").value = morador.nome;
  document.getElementById("bloco").value = morador.bloco;
  document.getElementById("apartamento").value = morador.apartamento;
  document.getElementById("telefone").value = morador.telefone;
  document.getElementById("email").value = morador.email;
  document.getElementById("status").value = morador.status;
}

async function atualizarMorador(e) {
  e.preventDefault();

  const dados = {
    nome: document.getElementById("nome").value.trim(),
    bloco: document.getElementById("bloco").value.trim(),
    apartamento: document.getElementById("apartamento").value.trim(),
    telefone: document.getElementById("telefone").value.trim(),
    email: document.getElementById("email").value.trim(),
    status: document.getElementById("status").value
  };

  const resposta = await fetch(`http://localhost:3000/moradores/${moradorId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dados)
  });

  const resultado = await resposta.json();

  if (resposta.ok) {
    alert("Morador atualizado com sucesso!");
  } else {
    alert(`Erro: ${resultado.erro || "Não foi possível atualizar o morador."}`);
  }
}

async function carregarVeiculos() {
  const resposta = await fetch("http://localhost:3000/veiculos");
  const veiculos = await resposta.json();
  const lista = document.getElementById("veiculosLista");
  lista.innerHTML = "";

  veiculos
    .filter(v => v.morador_id == moradorId)
    .forEach(v => {
      const item = document.createElement("li");
      item.innerHTML = `
        ${v.modelo} - ${v.placa} - ${v.cor} - Box: ${v.box}
        <button onclick="editarVeiculo(${v.id})">Editar</button>
        <button onclick="excluirVeiculo(${v.id})">Excluir</button>
      `;
      lista.appendChild(item);
    });
}

function editarVeiculo(id) {
  window.location.href = `cadastro-veiculo.html?id=${id}&editar=1`;
}

async function excluirVeiculo(id) {
  if (!confirm("Tem certeza que deseja excluir este veículo?")) return;

  const resposta = await fetch(`http://localhost:3000/veiculos/${id}`, { method: "DELETE" });
  const resultado = await resposta.json();

  if (resposta.ok) {
    alert("Veículo excluído.");
    await carregarVeiculos();
  } else {
    alert(`Erro: ${resultado.erro}`);
  }
}

document.getElementById("excluirMorador").addEventListener("click", async () => {
  const confirma = confirm("Deseja realmente excluir este morador? Todos os veículos associados também serão removidos.");
  if (!confirma) return;

  try {
    const resposta = await fetch(`http://localhost:3000/moradores/${moradorId}`, {
      method: "DELETE"
    });
    const resultado = await resposta.json();

    if (resposta.ok) {
      alert("Morador excluído com sucesso!");
      window.location.href = "listagem.html";
    } else {
      alert(`Erro: ${resultado.erro}`);
    }
  } catch (erro) {
    alert("Erro ao excluir morador.");
    console.error(erro);
  }
});

