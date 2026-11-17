const links = document.querySelectorAll('[data-secao]');
const secoes = document.querySelectorAll('.secao');

function mostrarSecao(id) {
    secoes.forEach(secao => secao.classList.add('d-none'));
    document.getElementById(id).classList.remove('d-none');

    links.forEach(link => link.classList.toggle('active', link.dataset.secao === id));

    const menu = document.getElementById('menuPrincipal');
    if (menu.classList.contains('show')) {
        bootstrap.Collapse.getOrCreateInstance(menu).hide();
    }
}

links.forEach(link => {
    link.addEventListener('click', (evento) => {
        evento.preventDefault();
        mostrarSecao(link.dataset.secao);
    });
});

function atualizarTela() {
    listarClientes();
    listarServicos();
    listarProfissionais();
    listarAgendamentos();
}

atualizarTela();
