// =====================================================
// app.js — navegação entre as telas (R01)
// Cada link do menu tem data-secao="id-da-tela"
// =====================================================

const links = document.querySelectorAll('[data-secao]');
const secoes = document.querySelectorAll('.secao');

// Mostra só a tela escolhida e esconde as outras
function mostrarSecao(id) {
  secoes.forEach(secao => secao.classList.add('d-none'));
  document.getElementById(id).classList.remove('d-none');

  // Destaca o link da tela aberta no menu
  links.forEach(link => link.classList.toggle('active', link.dataset.secao === id));

  // No celular, fecha o menu depois do clique
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
