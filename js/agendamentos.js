const CHAVE_AGENDAMENTOS = 'agendamentos';

const CORES_STATUS = {
    'Agendado': 'text-bg-warning',
    'Confirmado': 'text-bg-primary',
    'Concluído': 'text-bg-success',
    'Cancelado': 'text-bg-secondary'
};

function listarAgendamentos() {
    const agendamentos = lerDados(CHAVE_AGENDAMENTOS);
    const clientes = lerDados(CHAVE_CLIENTES);
    const servicos = lerDados(CHAVE_SERVICOS);
    const profissionais = lerDados(CHAVE_PROFISSIONAIS);
    const tabela = document.getElementById('listaAgendamentos');

    if (agendamentos.length === 0) {
        tabela.innerHTML = linhaVazia(8, 'Nenhum agendamento cadastrado.');
        return;
    }

    tabela.innerHTML = agendamentos.map(agendamento => {
        const cliente = buscarPorId(clientes, agendamento.clienteId);
        const servico = buscarPorId(servicos, agendamento.servicoId);
        const profissional = buscarPorId(profissionais, agendamento.profissionalId);

        return `
            <tr>
                <td>${formatarData(agendamento.data)}</td>
                <td>${agendamento.hora}</td>
                <td>${escapar(cliente ? cliente.nome : '(excluído)')}</td>
                <td>${escapar(servico ? servico.nome : '(excluído)')}</td>
                <td>${escapar(profissional ? profissional.nome : '(excluído)')}</td>
                <td>${formatarDinheiro(agendamento.valor)}</td>
                <td><span class="badge ${CORES_STATUS[agendamento.status]}">${agendamento.status}</span></td>
                <td class="acoes">${botoesDoAgendamento(agendamento)}</td>
            </tr>`;
    }).join('');
}

function botoesDoAgendamento(agendamento) {
    const id = agendamento.id;
    let botoes = '';

    if (agendamento.status === 'Agendado') {
        botoes += `<button class="btn btn-sm btn-primary" onclick="mudarStatus('${id}', 'Confirmado')">Confirmar</button> `;
    }
    if (agendamento.status === 'Confirmado') {
        botoes += `<button class="btn btn-sm btn-success" onclick="mudarStatus('${id}', 'Concluído')">Concluir</button> `;
    }
    if (agendamentoEmAberto(agendamento)) {
        botoes += `<button class="btn btn-sm btn-outline-warning" onclick="mudarStatus('${id}', 'Cancelado')">Cancelar</button> `;
        botoes += `<button class="btn btn-sm btn-outline-secondary" onclick="editarAgendamento('${id}')">Editar</button> `;
    }
    botoes += `<button class="btn btn-sm btn-outline-danger" onclick="excluirAgendamento('${id}')">Excluir</button>`;

    return botoes;
}

function preencherSelect(idSelect, lista, textoInicial) {
    const opcoes = lista.map(item => `<option value="${item.id}">${escapar(item.nome)}</option>`);
    document.getElementById(idSelect).innerHTML = `<option value="">${textoInicial}</option>` + opcoes.join('');
}

function carregarOpcoes() {
    const profissionaisAtivos = lerDados(CHAVE_PROFISSIONAIS).filter(p => p.ativo);

    preencherSelect('agendamentoCliente', lerDados(CHAVE_CLIENTES), 'Selecione o cliente');
    preencherSelect('agendamentoServico', lerDados(CHAVE_SERVICOS), 'Selecione o serviço');
    preencherSelect('agendamentoProfissional', profissionaisAtivos, 'Selecione o profissional');
}

function novoAgendamento() {
    const temClientes = lerDados(CHAVE_CLIENTES).length > 0;
    const temServicos = lerDados(CHAVE_SERVICOS).length > 0;
    const temProfissionalAtivo = lerDados(CHAVE_PROFISSIONAIS).some(p => p.ativo);

    if (!temClientes || !temServicos || !temProfissionalAtivo) {
        mostrarAviso('Cadastre antes pelo menos um cliente, um serviço e um profissional ativo.', 'erro');
        return;
    }

    carregarOpcoes();
    document.getElementById('formAgendamento').reset();
    document.getElementById('agendamentoId').value = '';
    document.getElementById('agendamentoData').min = dataDeHoje();
    document.getElementById('tituloModalAgendamento').textContent = 'Novo agendamento';
    esconderErros('erroAgendamento');
    abrirModal('modalAgendamento');
}

function editarAgendamento(id) {
    const agendamento = buscarPorId(lerDados(CHAVE_AGENDAMENTOS), id);

    carregarOpcoes();
    document.getElementById('agendamentoId').value = agendamento.id;
    document.getElementById('agendamentoCliente').value = agendamento.clienteId;
    document.getElementById('agendamentoServico').value = agendamento.servicoId;
    document.getElementById('agendamentoProfissional').value = agendamento.profissionalId;
    document.getElementById('agendamentoData').value = agendamento.data;
    document.getElementById('agendamentoHora').value = agendamento.hora;
    document.getElementById('tituloModalAgendamento').textContent = 'Editar agendamento';
    esconderErros('erroAgendamento');
    abrirModal('modalAgendamento');
}

function validarAgendamento(agendamento) {
    const erros = [];

    if (agendamento.clienteId === '') erros.push('Selecione o cliente.');
    if (agendamento.servicoId === '') erros.push('Selecione o serviço.');
    if (agendamento.profissionalId === '') erros.push('Selecione o profissional.');

    if (agendamento.data === '') {
        erros.push('Informe a data.');
    } else if (agendamento.data < dataDeHoje()) {
        erros.push('Não é possível agendar em uma data que já passou.');
    }

    if (agendamento.hora === '') {
        erros.push('Informe a hora.');
    } else if (agendamento.hora < '08:00' || agendamento.hora > '19:00') {
        erros.push('A barbearia funciona das 08:00 às 19:00.');
    }

    return erros;
}

document.getElementById('formAgendamento').addEventListener('submit', (evento) => {
    evento.preventDefault();

    const agendamentos = lerDados(CHAVE_AGENDAMENTOS);
    const agendamento = {
        id: document.getElementById('agendamentoId').value,
        clienteId: document.getElementById('agendamentoCliente').value,
        servicoId: document.getElementById('agendamentoServico').value,
        profissionalId: document.getElementById('agendamentoProfissional').value,
        data: document.getElementById('agendamentoData').value,
        hora: document.getElementById('agendamentoHora').value,
        status: 'Agendado'
    };

    const erros = validarAgendamento(agendamento);
    if (erros.length > 0) {
        mostrarErros('erroAgendamento', erros);
        return;
    }

    const servico = buscarPorId(lerDados(CHAVE_SERVICOS), agendamento.servicoId);
    agendamento.valor = servico.preco;

    if (agendamento.id === '') {
        agendamento.id = gerarId();
        agendamentos.push(agendamento);
    } else {
        const posicao = agendamentos.findIndex(a => a.id === agendamento.id);
        agendamento.status = agendamentos[posicao].status;
        agendamentos[posicao] = agendamento;
    }

    salvarDados(CHAVE_AGENDAMENTOS, agendamentos);
    fecharModal('modalAgendamento');
    atualizarTela();
    mostrarAviso('Agendamento salvo.', 'sucesso');
});

function mudarStatus(id, novoStatus) {
    const agendamentos = lerDados(CHAVE_AGENDAMENTOS);
    const agendamento = buscarPorId(agendamentos, id);

    if (!agendamentoEmAberto(agendamento)) {
        mostrarAviso('Agendamento concluído ou cancelado não pode mudar de status.', 'erro');
        return;
    }

    agendamento.status = novoStatus;
    salvarDados(CHAVE_AGENDAMENTOS, agendamentos);
    atualizarTela();
    mostrarAviso(`Agendamento ${novoStatus.toLowerCase()}.`, 'sucesso');
}

function excluirAgendamento(id) {
    confirmarExclusao('Deseja mesmo excluir este agendamento?', () => {
        const agendamentos = lerDados(CHAVE_AGENDAMENTOS).filter(a => a.id !== id);
        salvarDados(CHAVE_AGENDAMENTOS, agendamentos);
        atualizarTela();
        mostrarAviso('Agendamento excluído.', 'sucesso');
    });
}
