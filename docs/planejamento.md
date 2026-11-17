# Planejamento - Sua agenda

## Tema

Agenda de serviços de uma barbearia.

## Entidades (R06)

| Entidade | Campos |
| --- | --- |
| Cliente | id, nome, telefone, e-mail |
| Serviço | id, nome, preço, duração (min) |
| Profissional | id, nome, especialidade, ativo |
| Agendamento | id, clienteId, servicoId, profissionalId, data, hora, status |

Como as relações influenciam o sistema:
- O agendamento só pode ser criado com cliente, serviço e profissional cadastrados.
- Não pode excluir cliente, serviço ou profissional que tenha agendamento em aberto.
- O valor do agendamento vem do preço do serviço.

## Status do agendamento (R11)

`Agendado` → `Confirmado` → `Concluído`
`Agendado` ou `Confirmado` → `Cancelado`

Agendamento concluído ou cancelado não pode mais ser editado.

## Funcionalidade exclusiva (R13)

Bloqueio de conflito de horário: o mesmo profissional não pode ter dois agendamentos que se sobreponham, considerando a duração do serviço.

## Onde cada requisito será feito

| Req. | O que | Etapa |
| --- | --- | --- |
| R01 | 5 telas com menu | 1 |
| R02 | Layout responsivo, HTML semântico, CSS próprio | 1 |
| R03 | Cards, formulários, tabelas, modais, alertas, navbar | 1 e 2 |
| R04 | Grid, navbar, cards, modais do Bootstrap | 1 e 2 |
| R05 | CRUD de clientes, serviços, profissionais e agendamentos | 2 |
| R06 | Relações entre as entidades (acima) | 2 |
| R07 | Validação dos formulários | 2 |
| R08 | Salvar no localStorage | 2 |
| R09 | Busca, 2 filtros e ordenação nos agendamentos | 2 |
| R10 | 4 indicadores no Início (js/painel.js) | 2 |
| R11 | Mudança de status do agendamento | 2 |
| R12 | Modal de exclusão, alertas de feedback, tema escuro | 2 e 3 |
| R13 | Bloqueio de conflito de horário | 3 |

## Etapas

1. Planejamento, pastas, GitHub, tela inicial e navegação
2. Cadastros, relações, validações, localStorage, busca, filtros e ordenação
3. Dashboard, funcionalidade exclusiva, testes, responsividade, README, GitHub Pages
