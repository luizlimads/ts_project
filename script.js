/*document.getElementById('productForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Evita o reload da página

    // Captura os valores do formulário
    const nome = document.getElementById('nome').value;
    const categoria = document.getElementById('categoria').value;
    const unidade = document.getElementById('unidade').value;
    const quantidade = document.getElementById('quantidade').value;
    const dataValidade = document.getElementById('data_validade').value;

    // Simula envio dos dados para o servidor (API)
    const produto = {
        nome: nome,
        categoria: categoria,
        unidade: unidade,
        quantidade: quantidade,
        data_validade: dataValidade
    };

    // Simulação de um envio via fetch (pode ser adaptado para a API real)
    console.log('Produto enviado:', produto);

    // Exibe uma mensagem de sucesso
    const message = document.getElementById('message');
    message.textContent = 'Produto cadastrado com sucesso!';

    // Limpa o formulário
    document.getElementById('productForm').reset();
});*/

document.getElementById('productForm').addEventListener('submit', async function(event) {
    event.preventDefault(); // Evita o reload da página

    // Captura os valores do formulário
    const id = this.getAttribute('data-editing-id'); // Pega o ID se estiver editando
    const nome = document.getElementById('nome').value;
    const categoria = document.getElementById('categoria').value;
    const unidade = document.getElementById('unidade').value;
    const quantidade = document.getElementById('quantidade').value;
    const dataValidade = document.getElementById('data_validade').value;

    // Monta o objeto do produto
    const produto = {
        nome: nome,
        categoria: categoria,
        unidade: unidade,
        quantidade: parseFloat(quantidade),
        data_validade: dataValidade
    };

    try {
        let response;
        if (id) {
            // Se existe um ID, significa que estamos editando (PUT)
            response = await fetch(`http://127.0.0.1:8000/api/produtos/${id}/`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(produto)
            });
        } else {
            // Se não há ID, significa que é um novo cadastro (POST)
            response = await fetch('http://127.0.0.1:8000/api/produtos/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(produto)
            });
        }

        if (response.ok) {
            alert(id ? "Produto atualizado com sucesso!" : "Produto cadastrado com sucesso!");

            // Resetar formulário
            this.reset();
            this.removeAttribute('data-editing-id');
            document.getElementById('submitButton').textContent = "Cadastrar Produto";

            // Atualizar lista de produtos
            carregarProdutos();
        } else {
            alert("Erro ao salvar produto!");
        }
    } catch (error) {
        console.error("Erro ao salvar produto:", error);
    }
});

async function carregarProdutos() {
    try {
        const response = await fetch('http://127.0.0.1:8000/api/produtos/');
        if (!response.ok) {
            throw new Error('Erro ao buscar produtos');
        }
        const produtos = await response.json();

        // Seleciona o corpo da tabela
        const tabela = document.querySelector("#tabela-produtos tbody");
        tabela.innerHTML = ""; // Limpa a tabela antes de adicionar os produtos

        produtos.forEach(produto => {
            const linha = document.createElement("tr");
            linha.innerHTML = `
                <td>${produto.nome}</td>
                <td>${produto.categoria}</td>
                <td>${produto.unidade}</td>
                <td>${produto.quantidade}</td>
                <td>${produto.data_validade}</td>
                <td>
                    <button onclick="editarProduto(${produto.id})">✏️ Editar</button>
                    <button onclick="excluirProduto(${produto.id})">🗑️ Excluir</button>
                </td>
            `;
            tabela.appendChild(linha);
        });

    } catch (error) {
        console.error("Erro ao carregar produtos:", error);
    }
}

// Carregar produtos ao carregar a página
document.addEventListener("DOMContentLoaded", carregarProdutos);

async function editarProduto(id) {
    try {
        const response = await fetch(`http://127.0.0.1:8000/api/produtos/${id}/`);
        if (!response.ok) {
            throw new Error('Erro ao buscar produto');
        }
        const produto = await response.json();

        // Preenche o formulário com os dados do produto selecionado
        document.getElementById('nome').value = produto.nome;
        document.getElementById('categoria').value = produto.categoria;
        document.getElementById('unidade').value = produto.unidade;
        document.getElementById('quantidade').value = produto.quantidade;
        document.getElementById('data_validade').value = produto.data_validade;

        // Armazena o ID do produto sendo editado
        document.getElementById('productForm').setAttribute('data-editing-id', id);

        // Mudar o texto do botão para indicar que está editando
        document.getElementById('submitButton').textContent = "Atualizar Produto";

    } catch (error) {
        console.error("Erro ao carregar produto:", error);
    }
}

async function excluirProduto(id) {
    if (!confirm("Tem certeza que deseja excluir este produto?")) return;

    try {
        const response = await fetch(`http://127.0.0.1:8000/api/produtos/${id}/`, {
            method: 'DELETE',
        });

        if (response.ok) {
            alert("Produto excluído com sucesso!");
            carregarProdutos(); // Atualiza a lista após exclusão
        } else {
            alert("Erro ao excluir produto.");
        }
    } catch (error) {
        console.error("Erro ao excluir produto:", error);
    }
}
    



