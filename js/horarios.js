const FECHAMENTO = '19:00';

function paraMinutos(hora) {
    const [h, m] = hora.split(':').map(Number);
    return h * 60 + m;
}

function paraHora(minutos) {
    const h = String(Math.floor(minutos / 60)).padStart(2, '0');
    const m = String(minutos % 60).padStart(2, '0');
    return `${h}:${m}`;
}

function horaDeTermino(agendamento, servicos) {
    const servico = buscarPorId(servicos, agendamento.servicoId);
    return paraMinutos(agendamento.hora) + servico.duracao;
}

function verificarHorario(agendamento) {
    const servicos = lerDados(CHAVE_SERVICOS);
    const inicio = paraMinutos(agendamento.hora);
    const fim = horaDeTermino(agendamento, servicos);

    if (fim > paraMinutos(FECHAMENTO)) {
        return [`Esse serviço terminaria às ${paraHora(fim)}, depois do fechamento (${FECHAMENTO}).`];
    }

    const conflito = lerDados(CHAVE_AGENDAMENTOS).find(outro =>
        outro.id !== agendamento.id
        && outro.profissionalId === agendamento.profissionalId
        && outro.data === agendamento.data
        && agendamentoEmAberto(outro)
        && inicio < horaDeTermino(outro, servicos)
        && paraMinutos(outro.hora) < fim
    );

    if (conflito) {
        const termino = paraHora(horaDeTermino(conflito, servicos));
        return [`Esse profissional já tem atendimento das ${conflito.hora} às ${termino} nesse dia.`];
    }

    return [];
}
