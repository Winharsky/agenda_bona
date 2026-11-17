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
            <td class="acoes">
                <button class="btn btn-sm btn-outline-secondary" onclick="editarServico('${servico.id}')">Editar</button>
                <button class="btn btn-sm btn-outline-danger" onclick="excluirServico('${servico.id}')">Excluir</button>
            </td>
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

function editarServico(id) {
    const servico = buscarPorId(lerDados(CHAVE_SERVICOS), id);

    document.getElementById('servicoId').value = servico.id;
    document.getElementById('servicoNome').value = servico.nome;
    document.getElementById('servicoPreco').value = servico.preco;
    document.getElementById('servicoDuracao').value = servico.duracao;
    document.getElementById('tituloModalServico').textContent = 'Editar serviço';
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

function excluirServico(id) {
    const emUso = lerDados(CHAVE_AGENDAMENTOS).some(a =>
        a.servicoId === id && agendamentoEmAberto(a)
    );
    if (emUso) {
        mostrarAviso('Este serviço está em um agendamento em aberto.', 'erro');
        return;
    }

    confirmarExclusao('Deseja mesmo excluir este serviço?', () => {
        const servicos = lerDados(CHAVE_SERVICOS).filter(s => s.id !== id);
        salvarDados(CHAVE_SERVICOS, servicos);
        atualizarTela();
        mostrarAviso('Serviço excluído.', 'sucesso');
    });
}
