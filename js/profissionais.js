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
                <td class="acoes">
                    <button class="btn btn-sm btn-outline-secondary" onclick="editarProfissional('${profissional.id}')">Editar</button>
                    <button class="btn btn-sm btn-outline-danger" onclick="excluirProfissional('${profissional.id}')">Excluir</button>
                </td>
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

function editarProfissional(id) {
    const profissional = buscarPorId(lerDados(CHAVE_PROFISSIONAIS), id);

    document.getElementById('profissionalId').value = profissional.id;
    document.getElementById('profissionalNome').value = profissional.nome;
    document.getElementById('profissionalEspecialidade').value = profissional.especialidade;
    document.getElementById('profissionalAtivo').checked = profissional.ativo;
    document.getElementById('tituloModalProfissional').textContent = 'Editar profissional';
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

    const estaDesativando = !profissional.ativo && profissional.id !== '';
    if (estaDesativando) {
        const temAgendamentoAberto = lerDados(CHAVE_AGENDAMENTOS).some(a =>
            a.profissionalId === profissional.id && agendamentoEmAberto(a)
        );
        if (temAgendamentoAberto) {
            erros.push('Este profissional tem agendamento em aberto e não pode ser desativado.');
        }
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

function excluirProfissional(id) {
    const temAgendamentoAberto = lerDados(CHAVE_AGENDAMENTOS).some(a =>
        a.profissionalId === id && agendamentoEmAberto(a)
    );
    if (temAgendamentoAberto) {
        mostrarAviso('Este profissional tem agendamento em aberto.', 'erro');
        return;
    }

    confirmarExclusao('Deseja mesmo excluir este profissional?', () => {
        const profissionais = lerDados(CHAVE_PROFISSIONAIS).filter(p => p.id !== id);
        salvarDados(CHAVE_PROFISSIONAIS, profissionais);
        atualizarTela();
        mostrarAviso('Profissional excluído.', 'sucesso');
    });
}
