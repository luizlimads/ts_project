// Função para abrir/fechar o menu
function toggleMenu() {
    document.getElementById("menuLateral").classList.toggle("ativo");
}

// Função para navegar entre páginas
function irPara(pagina) {
    window.location.href = pagina;
}

// Função para carregar o relatório de total de produtos
async function carregarRelatorios() {
    try {
        const response = await fetch('http://127.0.0.1:8000/api/produtos/');
        if (!response.ok) {
            throw new Error('Erro ao buscar produtos');
        }
        const produtos = await response.json();
        
        const hoje = new Date().toISOString().split('T')[0];

        const totalProdutos = produtos.length;
        const totalPereciveis = produtos.filter(p => p.categoria === 'perecivel').length;
        const totalNaoPereciveis = produtos.filter(p => p.categoria === 'nao_perecivel').length;
        const totalVencidos = produtos.filter(p => p.data_validade < hoje).length;
        const totalValidos = produtos.filter(p => p.data_validade >= hoje).length;
        const unidadesContagem = contarUnidades(produtos);

        // Atualiza o texto dos relatórios
        const relatorioTextual = document.getElementById('relatorio-textual');
        relatorioTextual.innerHTML = `
            <li><strong>Total de Produtos Cadastrados:</strong> ${totalProdutos}</li>
            <li><strong>Total de Produtos Perecíveis:</strong> ${totalPereciveis}</li>
            <li><strong>Total de Produtos Não Perecíveis:</strong> ${totalNaoPereciveis}</li>
            <li><strong>Total de Produtos Vencidos:</strong> ${totalVencidos}</li>
            <li><strong>Total de Produtos Válidos:</strong> ${totalValidos}</li>
        `;

        // Cria os gráficos
        criarGraficoCategoria(totalPereciveis, totalNaoPereciveis);
        criarGraficoUnidades(unidadesContagem);
        criarGraficoValidade(totalValidos, totalVencidos);

    } catch (error) {
        console.error("Erro ao carregar relatório:", error);
    }
}

// Função para contar unidades
function contarUnidades(produtos) {
    const contagem = {};
    produtos.forEach(p => {
        contagem[p.unidade] = (contagem[p.unidade] || 0) + 1;
    });
    return contagem;
}

// Função para criar gráfico de categorias
function criarGraficoCategoria(pereciveis, naoPereciveis) {
    const ctx = document.getElementById('graficoCategoria').getContext('2d');
    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Perecíveis', 'Não Perecíveis'],
            datasets: [{
                data: [pereciveis, naoPereciveis],
                backgroundColor: ['#36A2EB', '#FFCE56']
            }]
        },
        options: {
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

// Função para criar gráfico de unidades
function criarGraficoUnidades(unidadesContagem) {
    const ctx = document.getElementById('graficoUnidades').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: Object.keys(unidadesContagem),
            datasets: [{
                label: 'Quantidade por Unidade',
                data: Object.values(unidadesContagem),
                backgroundColor: '#4CAF50'
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// Função para criar gráfico de validade
function criarGraficoValidade(validos, vencidos) {
    const ctx = document.getElementById('graficoValidade').getContext('2d');
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Produtos Válidos', 'Produtos Vencidos'],
            datasets: [{
                data: [validos, vencidos],
                backgroundColor: ['#28a745', '#dc3545']
            }]
        },
        options: {
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

// Quando a página carregar, busca o relatório
document.addEventListener("DOMContentLoaded", carregarRelatorios);
