# Planejamento - Sua agenda

## Tema

Agenda de serviços de uma barbearia.

## Entidades (R06)

| Entidade | Campos |
| --- | --- |
| Cliente | id, nome, telefone, e-mail |
| Serviço | id, nome, preço, duração (min) |
| Profissional | id, nome, especialidade, ativo |
| Agendamento | id, clienteId, servicoId, profissionalId, data, hora, valor, status |

Como as relações influenciam o sistema:
- O agendamento só pode ser criado com cliente, serviço e profissional ativo cadastrados.
- Não pode excluir cliente, serviço ou profissional que tenha agendamento em aberto.
- Não pode desativar profissional que tenha agendamento em aberto.
- O valor do agendamento vem do preço do serviço.
- A duração do serviço define até quando o profissional fica ocupado.

## Status do agendamento (R11)

`Agendado` → `Confirmado` → `Concluído`
`Agendado` ou `Confirmado` → `Cancelado`

Agendamento concluído ou cancelado não pode mais ser editado nem mudar de status.

## Funcionalidade exclusiva (R13)

Bloqueio de conflito de horário. Ao salvar um agendamento, o sistema calcula o término pela duração do serviço e:
- recusa se outro agendamento em aberto do mesmo profissional, no mesmo dia, ocupa parte desse intervalo;
- recusa se o atendimento terminaria depois das 19:00.

Exemplo: corte de 30 min às 10:00 com o Carlos. Outro agendamento com o Carlos às 10:15 é recusado; às 10:30 é aceito.

## Onde cada requisito foi feito

| Req. | O que | Onde |
| --- | --- | --- |
| R01 | 5 telas com menu | `index.html`, `js/app.js` |
| R02 | Layout responsivo, HTML semântico, CSS próprio | `index.html`, `css/style.css` |
| R03 | Navbar, cards, tabelas, formulários, modais, alertas, badges | `index.html` |
| R04 | Navbar, grid, cards, modais, formulários, tabelas, badges e alertas do Bootstrap | `index.html` |
| R05 | CRUD de clientes, serviços, profissionais e agendamentos | `js/clientes.js`, `js/servicos.js`, `js/profissionais.js`, `js/agendamentos.js` |
| R06 | Relações entre as entidades | regras acima, nos mesmos arquivos |
| R07 | Validação dos formulários | funções `validar...` de cada arquivo |
| R08 | localStorage | `js/utils.js` (`lerDados`, `salvarDados`) |
| R09 | Busca, filtros por status e profissional, ordenação | tela Agendamentos, `js/agendamentos.js` |
| R10 | 4 indicadores calculados | tela Início, `js/painel.js` |
| R11 | Mudança de status | `js/agendamentos.js` (`mudarStatus`) |
| R12 | Modal de exclusão, avisos de feedback, botões que mudam conforme o status | `js/utils.js`, `js/agendamentos.js` |
| R13 | Bloqueio de conflito de horário | `js/horarios.js` |
