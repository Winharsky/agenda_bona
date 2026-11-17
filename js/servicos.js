const CHAVE_SERVICOS = 'servicos';

function listarServicos() {
    const servicos = lerDados(CHAVE_SERVICOS);
    const tabela = document.getElementById('listaServicos');

    if (servicos.length === 0) {
        tabela.innerHTML = linhaVazia(4, 'Nenhum serviço cadastrado.');
        return;
    }

    tabela.innerHTML = servicos.map(servico => `
        <tr>
            <td>${escapar(servico.nome)}</td>
            <td>${formatarDinheiro(servico.preco)}</td>
            <td>${servico.duracao} min</td>
        </tr>
    `).join('');
}

function novoServico() {
    document.getElementById('formServico').reset();
    document.getElementById('servicoId').value = '';
    document.getElementById('tituloModalServico').textContent = 'Novo serviço';
    esconderErros('erroServico');
    abrirModal('modalServico');
}

function validarServico(servico) {
    const erros = [];

    if (servico.nome.length < 3) {
        erros.push('Informe o nome do serviço.');
    }
    if (isNaN(servico.preco) || servico.preco <= 0) {
        erros.push('O preço deve ser maior que zero.');
    }
    if (isNaN(servico.duracao) || servico.duracao < 10 || servico.duracao > 240) {
        erros.push('A duração deve ficar entre 10 e 240 minutos.');
    }

    return erros;
}

document.getElementById('formServico').addEventListener('submit', (evento) => {
    evento.preventDefault();

    const servicos = lerDados(CHAVE_SERVICOS);
    const servico = {
        id: document.getElementById('servicoId').value,
        nome: document.getElementById('servicoNome').value.trim(),
        preco: parseFloat(document.getElementById('servicoPreco').value),
        duracao: parseInt(document.getElementById('servicoDuracao').value)
    };

    const erros = validarServico(servico);
    if (erros.length > 0) {
        mostrarErros('erroServico', erros);
        return;
    }

    if (servico.id === '') {
        servico.id = gerarId();
        servicos.push(servico);
    } else {
        const posicao = servicos.findIndex(s => s.id === servico.id);
        servicos[posicao] = servico;
    }

    salvarDados(CHAVE_SERVICOS, servicos);
    fecharModal('modalServico');
    atualizarTela();
    mostrarAviso('Serviço salvo.', 'sucesso');
});
