document.getElementById("cadastroForm").addEventListener("submit", async (event) => {
    event.preventDefault(); // Evita o recarregamento da página ao enviar o formulário

    // Captura os dados do formulário
    const dados = {
        nome: document.getElementById("nomeMorador").value.trim(),
        bloco: document.getElementById("bloco").value.trim(),
        apartamento: document.getElementById("apto").value.trim(),
        telefone: document.getElementById("telefone").value.trim(),
        email: document.getElementById("email").value.trim(),
        status: document.getElementById("status").value
    };

    // Verifica se todos os campos estão preenchidos
    if (!dados.nome || !dados.bloco || !dados.apartamento || !dados.telefone || !dados.email) {
        alert("Por favor, preencha todos os campos obrigatórios.");
        return;
    }

    try {
        // Envia os dados para o backend
        const resposta = await fetch("http://localhost:3000/moradores", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(dados)
        });

        const resultado = await resposta.json();

        if (resposta.ok) {
            alert("Cadastro realizado com sucesso!");
            document.getElementById("cadastroForm").reset(); // Limpa o formulário após o cadastro
        } else {
            alert(`Erro: ${resultado.erro || "Não foi possível cadastrar o morador."}`);
        }
    } catch (erro) {
        alert("Erro ao conectar com o servidor. Tente novamente mais tarde.");
        console.error("Erro ao enviar os dados:", erro);
    }
});
