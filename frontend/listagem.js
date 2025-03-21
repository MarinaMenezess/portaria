document.addEventListener("DOMContentLoaded", async () => {
    await carregarMoradoresVeiculos();
});

// 🚀 Função para carregar a lista com JOIN (moradores + veículos)
async function carregarMoradoresVeiculos() {
    try {
        const resposta = await fetch("http://localhost:3000/moradores-veiculos");
        const dados = await resposta.json();

        const tabela = document.getElementById("moradoresVeiculosLista");
        tabela.innerHTML = ""; // Limpa a tabela antes de carregar os dados

        dados.forEach(item => {
            const linha = document.createElement("tr");

            linha.innerHTML = `
                <td>
                    <a href="morador.html?id=${item.morador_id}">
                        ${item.nome}
                    </a>
                </td>
                <td>${item.bloco}</td>
                <td>${item.apartamento}</td>
                <td>${item.telefone}</td>
                <td>${item.email}</td>
                <td>${item.status}</td>
                <td>${item.placa || "-"}</td>
                <td>${item.modelo || "-"}</td>
                <td>${item.cor || "-"}</td>
                <td>${item.box || "-"}</td>
            `;

            tabela.appendChild(linha);
        });
    } catch (erro) {
        console.error("Erro ao carregar moradores e veículos:", erro);
        alert("Erro ao carregar a lista.");
    }
}
