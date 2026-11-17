const CHAVE_CLIENTES = 'clientes';

function listarClientes() {
    const clientes = lerDados(CHAVE_CLIENTES);
    const tabela = document.getElementById('listaClientes');

    if (clientes.length === 0) {
        tabela.innerHTML = linhaVazia(4, 'Nenhum cliente cadastrado.');
        return;
    }

    tabela.innerHTML = clientes.map(cliente => `
        <tr>
            <td>${escapar(cliente.nome)}</td>
            <td>${escapar(cliente.telefone)}</td>
            <td>${escapar(cliente.email || '-')}</td>
            <td class="acoes">
                <button class="btn btn-sm btn-outline-secondary" onclick="editarCliente('${cliente.id}')">Editar</button>
                <button class="btn btn-sm btn-outline-danger" onclick="excluirCliente('${cliente.id}')">Excluir</button>
            </td>
        </tr>
    `).join('');
}

function novoCliente() {
    document.getElementById('formCliente').reset();
    document.getElementById('clienteId').value = '';
    document.getElementById('tituloModalCliente').textContent = 'Novo cliente';
    esconderErros('erroCliente');
    abrirModal('modalCliente');
}

function editarCliente(id) {
    const cliente = buscarPorId(lerDados(CHAVE_CLIENTES), id);

    document.getElementById('clienteId').value = cliente.id;
    document.getElementById('clienteNome').value = cliente.nome;
    document.getElementById('clienteTelefone').value = cliente.telefone;
    document.getElementById('clienteEmail').value = cliente.email;
    document.getElementById('tituloModalCliente').textContent = 'Editar cliente';
    esconderErros('erroCliente');
    abrirModal('modalCliente');
}

function validarCliente(cliente, clientes) {
    const erros = [];
    const numeros = cliente.telefone.replace(/\D/g, '');

    if (cliente.nome.length < 3) {
        erros.push('Informe o nome com pelo menos 3 letras.');
    }
    if (numeros.length < 10 || numeros.length > 11) {
        erros.push('O telefone precisa ter DDD + número (10 ou 11 dígitos).');
    }
    if (cliente.email !== '' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cliente.email)) {
        erros.push('E-mail inválido.');
    }

    const telefoneRepetido = clientes.some(outro =>
        outro.id !== cliente.id && outro.telefone.replace(/\D/g, '') === numeros
    );
    if (telefoneRepetido) {
        erros.push('Já existe um cliente com esse telefone.');
    }

    return erros;
}

document.getElementById('formCliente').addEventListener('submit', (evento) => {
    evento.preventDefault();

    const clientes = lerDados(CHAVE_CLIENTES);
    const cliente = {
        id: document.getElementById('clienteId').value,
        nome: document.getElementById('clienteNome').value.trim(),
        telefone: document.getElementById('clienteTelefone').value.trim(),
        email: document.getElementById('clienteEmail').value.trim()
    };

    const erros = validarCliente(cliente, clientes);
    if (erros.length > 0) {
        mostrarErros('erroCliente', erros);
        return;
    }

    if (cliente.id === '') {
        cliente.id = gerarId();
        clientes.push(cliente);
    } else {
        const posicao = clientes.findIndex(c => c.id === cliente.id);
        clientes[posicao] = cliente;
    }

    salvarDados(CHAVE_CLIENTES, clientes);
    fecharModal('modalCliente');
    atualizarTela();
    mostrarAviso('Cliente salvo.', 'sucesso');
});

function excluirCliente(id) {
    const temAgendamentoAberto = lerDados(CHAVE_AGENDAMENTOS).some(a =>
        a.clienteId === id && agendamentoEmAberto(a)
    );
    if (temAgendamentoAberto) {
        mostrarAviso('Este cliente tem agendamento em aberto. Conclua ou cancele antes.', 'erro');
        return;
    }

    confirmarExclusao('Deseja mesmo excluir este cliente?', () => {
        const clientes = lerDados(CHAVE_CLIENTES).filter(c => c.id !== id);
        salvarDados(CHAVE_CLIENTES, clientes);
        atualizarTela();
        mostrarAviso('Cliente excluído.', 'sucesso');
    });
}
