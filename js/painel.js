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
}
