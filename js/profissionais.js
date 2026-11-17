const CHAVE_PROFISSIONAIS = 'profissionais';

function listarProfissionais() {
    const profissionais = lerDados(CHAVE_PROFISSIONAIS);
    const tabela = document.getElementById('listaProfissionais');

    if (profissionais.length === 0) {
        tabela.innerHTML = linhaVazia(4, 'Nenhum profissional cadastrado.');
        return;
    }

    tabela.innerHTML = profissionais.map(profissional => {
        const situacao = profissional.ativo
            ? '<span class="badge text-bg-success">Ativo</span>'
            : '<span class="badge text-bg-secondary">Inativo</span>';

        return `
            <tr>
                <td>${escapar(profissional.nome)}</td>
                <td>${escapar(profissional.especialidade)}</td>
                <td>${situacao}</td>
            </tr>`;
    }).join('');
}

function novoProfissional() {
    document.getElementById('formProfissional').reset();
    document.getElementById('profissionalId').value = '';
    document.getElementById('tituloModalProfissional').textContent = 'Novo profissional';
    esconderErros('erroProfissional');
    abrirModal('modalProfissional');
}

function validarProfissional(profissional) {
    const erros = [];

    if (profissional.nome.length < 3) {
        erros.push('Informe o nome com pelo menos 3 letras.');
    }
    if (profissional.especialidade === '') {
        erros.push('Informe a especialidade.');
    }

    return erros;
}

document.getElementById('formProfissional').addEventListener('submit', (evento) => {
    evento.preventDefault();

    const profissionais = lerDados(CHAVE_PROFISSIONAIS);
    const profissional = {
        id: document.getElementById('profissionalId').value,
        nome: document.getElementById('profissionalNome').value.trim(),
        especialidade: document.getElementById('profissionalEspecialidade').value.trim(),
        ativo: document.getElementById('profissionalAtivo').checked
    };

    const erros = validarProfissional(profissional);
    if (erros.length > 0) {
        mostrarErros('erroProfissional', erros);
        return;
    }

    if (profissional.id === '') {
        profissional.id = gerarId();
        profissionais.push(profissional);
    } else {
        const posicao = profissionais.findIndex(p => p.id === profissional.id);
        profissionais[posicao] = profissional;
    }

    salvarDados(CHAVE_PROFISSIONAIS, profissionais);
    fecharModal('modalProfissional');
    atualizarTela();
    mostrarAviso('Profissional salvo.', 'sucesso');
});
