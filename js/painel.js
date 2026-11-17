function atualizarPainel() {
    const agendamentos = lerDados(CHAVE_AGENDAMENTOS);
    const clientes = lerDados(CHAVE_CLIENTES);
    const hoje = dataDeHoje();
    const mesAtual = hoje.slice(0, 7);

    const deHoje = agendamentos.filter(a => a.data === hoje && a.status !== 'Cancelado');

    const faturamento = agendamentos
        .filter(a => a.status === 'Concluído' && a.data.startsWith(mesAtual))
        .reduce((soma, a) => soma + a.valor, 0);

    const cancelados = agendamentos.filter(a => a.status === 'Cancelado').length;
    const taxa = agendamentos.length > 0 ? Math.round((cancelados / agendamentos.length) * 100) : 0;

    document.getElementById('dataHoje').textContent = new Date().toLocaleDateString('pt-BR', {
        weekday: 'long', day: 'numeric', month: 'long'
    });
    document.getElementById('totalHoje').textContent = deHoje.length;
    document.getElementById('totalFaturamento').textContent = formatarDinheiro(faturamento);
    document.getElementById('totalClientes').textContent = clientes.length;
    document.getElementById('taxaCancelamento').textContent = `${taxa}%`;

    listarProximos(agendamentos, hoje);
}

function listarProximos(agendamentos, hoje) {
    const clientes = lerDados(CHAVE_CLIENTES);
    const servicos = lerDados(CHAVE_SERVICOS);
    const profissionais = lerDados(CHAVE_PROFISSIONAIS);
    const tabela = document.getElementById('listaProximos');

    const proximos = agendamentos
        .filter(a => agendamentoEmAberto(a) && a.data >= hoje)
        .sort((a, b) => (a.data + a.hora).localeCompare(b.data + b.hora))
        .slice(0, 5);

    if (proximos.length === 0) {
        tabela.innerHTML = linhaVazia(4, 'Nenhum horário marcado.');
        return;
    }

    tabela.innerHTML = proximos.map(a => `
        <tr>
            <td>${formatarData(a.data)} às ${a.hora}</td>
            <td>${escapar(buscarPorId(clientes, a.clienteId).nome)}</td>
            <td>${escapar(buscarPorId(servicos, a.servicoId).nome)}</td>
            <td>${escapar(buscarPorId(profissionais, a.profissionalId).nome)}</td>
        </tr>
    `).join('');
}
