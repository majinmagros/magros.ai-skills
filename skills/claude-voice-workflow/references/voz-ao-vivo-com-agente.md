# Voz ao vivo enquanto o agente codifica

Fonte: `T2sogF_YacI` (@aicodeking) testando Qwen Audio Agent + Claude Code. É outro
modo de uso, não ditado: a conversa de voz continua **enquanto** a tarefa de
código roda no back end. O que este arquivo guarda são os limites que o vídeo
expõe — o resto é instalação.

## Arquitetura em duas conexões

- **Front end de voz**: modelo de conversa (aqui Qwen Audio 3.0 realtime).
- **Back end de código**: o agente que edita o projeto (aqui Claude Code, via
  adaptador ACP — Agent Client Protocol).
- Um gateway local liga os dois e devolve o resultado da tarefa para a conversa.

São **duas fontes de custo**. O projeto ser open source não torna as chamadas de
modelo gratuitas: some a conta do provedor de voz com a do agente.

## O erro de configuração que quebra tudo

O terminal aberto na pasta **não** define o workspace do agente. A aplicação tem
workspace próprio, e o workspace específico do Claude pode sobrescrever o geral.
Antes de pedir qualquer tarefa, peça para listar o caminho absoluto do workspace
configurado e conferir com a pasta escolhida. Depois de mudar configuração,
**reinicie o gateway** — editar o arquivo não altera a conexão em execução.

## Quatro "paradas" diferentes (não confunda)

| Ação | O que para |
|---|---|
| Interromper a fala | só a resposta falada |
| Mutar o microfone / fechar a conversa | só a entrada de voz; o back end continua |
| Cancelar tarefa | o trabalho do agente (pedido ≠ confirmação de cancelamento) |
| Desfazer | nada — cancelar **não** reverte edições já feitas; inspecione o diff |

## Follow-up durante a tarefa

O front end aceita a correção enquanto o trabalho roda, mas ela pode entrar como
**trabalho subsequente**, não como mudança no turno atual. Confira o estado da
tarefa e o arquivo: "ok, apliquei" falado não é prova de que o app mudou.

## O que voz faz bem e o que não faz

- **Bem**: explicar um requisito, perguntar por que uma decisão foi tomada,
  descrever um bug enquanto olha a tela, pedir uma versão mais curta da resposta.
- **Mal**: caminho de arquivo, trecho de código, mensagem de erro exata, comando
  para copiar. Peça isso em texto — o vídeo faz exatamente essa divisão.

## Teste de aceitação (o que realmente importa)

1. A fala virou a instrução certa? (confira o transcript, não só o áudio)
2. A conversa continuou enquanto o back end trabalhava?
3. O follow-up chegou ao projeto?
4. O app pronto passou nas checagens — não só "a tarefa terminou"?

Voz não substitui abrir o app e revisar o diff. A parte conversacional acelera;
a verificação continua igual.
