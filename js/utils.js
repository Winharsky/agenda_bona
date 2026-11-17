function lerDados(chave) {
    try {
        return JSON.parse(localStorage.getItem(chave)) || [];
    } catch (erro) {
        return [];
    }
}

function salvarDados(chave, lista) {
    localStorage.setItem(chave, JSON.stringify(lista));
}

function gerarId() {
    return Date.now().toString();
}

function buscarPorId(lista, id) {
    return lista.find(item => item.id === id);
}

function escapar(texto) {
    const div = document.createElement('div');
    div.textContent = texto;
    return div.innerHTML;
}

function formatarDinheiro(valor) {
    return Number(valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function formatarData(data) {
    const [ano, mes, dia] = data.split('-');
    return `${dia}/${mes}/${ano}`;
}

function dataDeHoje() {
    const agora = new Date();
    const mes = String(agora.getMonth() + 1).padStart(2, '0');
    const dia = String(agora.getDate()).padStart(2, '0');
    return `${agora.getFullYear()}-${mes}-${dia}`;
}

function mostrarAviso(mensagem, tipo) {
    const aviso = document.createElement('div');
    aviso.className = tipo === 'erro' ? 'alert alert-danger' : 'alert alert-success';
    aviso.textContent = mensagem;
    document.getElementById('avisos').appendChild(aviso);

    setTimeout(() => aviso.remove(), 3000);
}

function mostrarErros(idCaixa, erros) {
    const caixa = document.getElementById(idCaixa);
    caixa.innerHTML = erros.map(escapar).join('<br>');
    caixa.classList.remove('d-none');
}

function esconderErros(idCaixa) {
    document.getElementById(idCaixa).classList.add('d-none');
}

function abrirModal(id) {
    bootstrap.Modal.getOrCreateInstance(document.getElementById(id)).show();
}

function fecharModal(id) {
    bootstrap.Modal.getOrCreateInstance(document.getElementById(id)).hide();
}

let acaoDeExclusao = null;

function confirmarExclusao(mensagem, aoConfirmar) {
    document.getElementById('textoExcluir').textContent = mensagem;
    acaoDeExclusao = aoConfirmar;
    abrirModal('modalExcluir');
}

document.getElementById('botaoConfirmarExclusao').addEventListener('click', () => {
    if (acaoDeExclusao) {
        acaoDeExclusao();
        acaoDeExclusao = null;
    }
    fecharModal('modalExcluir');
});

function linhaVazia(colunas, mensagem) {
    return `<tr><td colspan="${colunas}" class="vazio">${mensagem}</td></tr>`;
}

function agendamentoEmAberto(agendamento) {
    return agendamento.status === 'Agendado' || agendamento.status === 'Confirmado';
}
