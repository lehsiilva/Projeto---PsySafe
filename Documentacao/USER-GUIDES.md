#  Guias de Usuário - PsySafe

##  Índice

- [Visão Geral](#visão-geral)
- [Guia para Administradores](#-guia-para-administradores)
- [Guia para Gestores](#-guia-para-gestores)
- [Guia para Funcionários](#-guia-para-funcionários)
- [FAQ](#-faq-perguntas-frequentes)

---

##  Visão Geral

O PsySafe possui 3 perfis de usuário, cada um com funcionalidades específicas:

| Perfil | Papel | Principais Funcionalidades |
|--------|-------|---------------------------|
| ** Admin** | Administrador do sistema | Gestão completa, configurações, todos os relatórios |
| ** Gestor** | Gerente/Coordenador | Agendamento, relatórios da equipe, ações corretivas |
| ** Funcionário** | Colaborador | Responder questionários, visualizar próprios dados |

---

##  Guia para Administradores

### Login Inicial

1. Acesse: `http://localhost:5173` (dev) ou URL de produção
2. **Email**: admin@psysafe.com
3. **Senha**: admin123 (altere no primeiro acesso!)

### Dashboard do Admin

Ao fazer login, você verá:
- **Visão Geral**: Métricas gerais da empresa
- **Alertas Críticos**: Notificações de riscos altos
- **Estatísticas**: Gráficos de IRP, TCO e distribuição de risco
- **Ações Pendentes**: Ações corretivas em andamento

---

###  Criar Questionário

**Caminho**: Dashboard → Questionários → Novo Questionário

#### Passo 1: Informações Básicas
```
Título: Avaliação Psicossocial Q4 2024
Descrição: Questionário trimestral baseado em NR-17
Versão: 1.0
Tempo Estimado: 15 minutos
```

#### Passo 2: Criar Subescalas (Dimensões)
```
Exemplos de subescalas:
- Assédio Moral
- Assédio Sexual
- Clima Organizacional
- Carga de Trabalho
- Autonomia
- Reconhecimento
- Condições de Trabalho
```

Para cada subescala:
1. Clique em "Adicionar Subescala"
2. Nome: "Assédio Moral"
3. Descrição: "Avalia situações de intimidação..."
4. Ordem: 1
5. Tipo de Resposta: Escala Likert 1-5

#### Passo 3: Adicionar Perguntas

Para cada pergunta:
1. Clique em "Adicionar Pergunta" na subescala correspondente
2. Número: 1 (sequencial)
3. Conteúdo: "Você já se sentiu intimidado no trabalho?"
4. Salvar

**Dica**: Crie pelo menos 5-7 perguntas por subescala para análise robusta.

#### Passo 4: Ativar Questionário
1. Revise todas as perguntas
2. Clique em "Ativar Questionário"
3. Agora ele está disponível para agendamento

---

###  Gerenciar Usuários

**Caminho**: Dashboard → Usuários

#### Criar Novo Usuário
1. Clique em "Novo Usuário"
2. Preencha:
   ```
   Nome: João Silva
   Email: joao.silva@empresa.com
   Senha: senha_temporaria (usuário deve alterar)
   Role: gestor
   Departamento: TI
   Cargo: Gerente de Projetos
   ```
3. Salvar

#### Editar Usuário
1. Encontre o usuário na lista
2. Clique em "Editar"
3. Modifique campos necessários
4. Salvar

#### Desativar Usuário
1. Encontre o usuário
2. Clique em "Desativar"
3. Confirme (usuário não poderá fazer login)

** Importante**: Nunca delete usuários que já responderam questionários! Isso afetará a integridade dos dados.

---

###  Configurar Empresa

**Caminho**: Dashboard → Empresa

```
Nome: Tech Innovation Ltda
CNPJ: 12.345.678/0001-90
Endereço: Av. Paulista, 1000 - São Paulo/SP
Telefone: (11) 3000-1000
Email: contato@empresa.com
Setor: Tecnologia
Número de Funcionários: 250
Plano Ativo: Enterprise
```

---

###  Visualizar Relatórios Completos

**Caminho**: Dashboard → Relatórios

#### Relatório Geral
- IRP médio da empresa
- TCO global
- Departamentos em risco
- Evolução temporal
- Distribuição de funcionários por nível de risco

#### Relatório por Departamento
1. Selecione departamento (ex: TI)
2. Visualize:
   - Métricas específicas
   - Subescalas críticas
   - Usuários em risco
   - Comparação com média da empresa

#### Exportar Relatórios
1. Selecione período
2. Clique em "Exportar PDF" ou "Exportar Excel"
3. Aguarde download

---

###  Gerenciar Alertas

**Caminho**: Dashboard → Alertas

#### Visualizar Alertas
Alertas são criados automaticamente quando:
- IRP de usuário > 75%
- Departamento com piora > 20% MoM
- Taxa de participação < 50%

#### Gerar Ação Corretiva via IA
1. Abra o alerta crítico
2. Clique em "Gerar Ação Corretiva"
3. Aguarde análise da IA (10-15 segundos)
4. Revise as ações sugeridas
5. Atribua responsável
6. Defina prazo
7. Salvar

---

## Guia para Gestores

### Login

Use credenciais fornecidas pelo administrador.

**Exemplo**:
- Email: gestor@empresa.com
- Senha: senha_inicial (altere no primeiro acesso)

---

###  Agendar Questionário

**Caminho**: Dashboard → Questionários → Agendar

#### Passo 1: Selecionar Questionário
1. Escolha questionário ativo
2. Exemplo: "Avaliação Psicossocial Q4 2024"

#### Passo 2: Definir Parâmetros
```
Título do Agendamento: Avaliação Q4 - Equipe Dev
Descrição: Avaliação focada em carga de trabalho e autonomia
Data Início: 2024-12-01 00:00
Data Fim: 2024-12-15 23:59
```

#### Passo 3: Selecionar Participantes
Opções:
- **Por Departamento**: Todos de TI
- **Por Equipe**: Equipe Dev, Equipe QA
- **Seleção Manual**: Escolher funcionários específicos

#### Passo 4: Configurar Lembretes
```
☑ Enviar notificação ao agendar
☑ Enviar lembrete
Dias antes do prazo: 3
☑ Enviar notificação de prazo próximo
```

#### Passo 5: Confirmar
1. Revise todas as informações
2. Clique em "Agendar"
3. Funcionários receberão notificação automaticamente

---

###  Acompanhar Respostas

**Caminho**: Dashboard → Agendamentos

#### Visualizar Progresso
```
Agendamento: Avaliação Q4 - Equipe Dev
Status: Ativo
Participantes: 45
Responderam: 32 (71%)
Pendentes: 13 (29%)
Prazo: 5 dias restantes
```

#### Enviar Lembrete Manual
1. Clique no agendamento
2. "Visualizar Pendentes"
3. Selecione usuários
4. "Enviar Lembrete"

---

###  Visualizar Resultados

**Caminho**: Dashboard → Resultados

Após encerramento do período:

#### Métricas Principais
```
IRP Médio: 35.2
TCO: 78.3%
IVI: 0.67 (Moderado)

Classificação: Risco Médio
```

#### Análise por Subescala
```
Subescala              | Média | Classificação
-----------------------|-------|---------------
Assédio Moral          | 4.5   | Baixo Risco
Clima Organizacional   | 4.1   | Baixo Risco
Carga de Trabalho      | 2.8   | Alto Risco ⚠️
Autonomia              | 3.7   | Médio Risco
```

#### Usuários em Risco
Lista de colaboradores com IRP > 50:
```
Nome          | IRP   | Classificação
--------------|-------|---------------
Maria Santos  | 78.5  | Crítico 🔴
João Pedro    | 62.3  | Alto 🟠
Ana Costa     | 55.1  | Alto 🟠
```

**Ação**: Clique no usuário para detalhes e criar ação corretiva individual.

---

###  Criar Ação Corretiva Manual

**Caminho**: Dashboard → Ações Corretivas → Nova

```
Título: Redistribuição de Carga - Equipe Dev
Departamento: TI
Nível de Risco: Alto
Prioridade: Alta

Descrição:
Com base nos resultados, identificamos sobrecarga na equipe Dev.
Pontuação de "Carga de Trabalho" foi 2.8, indicando alto risco.

Medidas Sugeridas:
1. Realizar reunião de diagnóstico detalhado
2. Redistribuir tarefas entre equipe
3. Contratar 1-2 colaboradores temporários
4. Implementar limites de horas extras

Responsável: João Silva (Gestor)
Prazo: 2024-12-31
Recursos Necessários: R$ 8.000 (contratações)

Impacto Esperado:
Redução do IRP de 35.2 para < 30 em 2 meses
```

Salvar → Ação fica em "Pendente"

---

###  Gerenciar Denúncias

**Caminho**: Dashboard → Denúncias

Como gestor, você vê denúncias do seu departamento.

#### Visualizar Denúncia
```
Protocolo: DEN-2024-456
Título: Assédio Moral
Tipo: assedio_moral
Anônima: Sim
Status: Aberta
Data: 2024-11-20

Descrição: [Descrição detalhada protegida]
```

#### Atualizar Status
1. Leia a denúncia
2. Investigue (sem revelar denunciante se anônima)
3. Atualize status:
   - Aberta → Em Análise
   - Em Análise → Resolvida

4. Adicione observações:
   ```
   Ação tomada: Sessão de mediação realizada.
   Políticas de conduta reforçadas.
   Monitoramento contínuo implementado.
   ```

** Ética**: Nunca tente identificar denunciante anônimo!

---

##  Guia para Funcionários

### Login

Use credenciais fornecidas pelo RH/gestor.

---

###  Responder Questionário

**Caminho**: Dashboard (logo ao logar)

#### Visualizar Pendentes
No dashboard, você verá:
```
📋 Você tem 1 questionário pendente

Avaliação Q4 - Equipe Dev
Prazo: 15/12/2024 (5 dias restantes)
Tempo estimado: 15 minutos
[Responder Agora]
```

#### Responder
1. Clique em "Responder Agora"
2. Leia instruções:
   ```
   Este questionário é CONFIDENCIAL.
   Respostas são anônimas para análise agregada.
   Seja honesto(a) - suas respostas ajudam a melhorar o ambiente.
   ```

3. Para cada pergunta, selecione de 1 a 5:
   ```
   1 = Nunca
   2 = Raramente
   3 = Às vezes
   4 = Frequentemente
   5 = Sempre
   ```

4. Exemplo:
   ```
   Pergunta 1: Você já se sentiu intimidado no trabalho?
   ○ 1 - Nunca
   ○ 2 - Raramente
   ● 3 - Às vezes  [selecionado]
   ○ 4 - Frequentemente
   ○ 5 - Sempre
   ```

5. Clique em "Próxima" para avançar
6. Ao final: "Revisar Respostas"
7. Confirme e "Enviar"

**Dica**: Reserve 15-20 minutos sem interrupções.

---

###  Visualizar Meu Histórico

**Caminho**: Dashboard → Meu Perfil → Histórico

#### Respostas Anteriores
```
Data         | Questionário              | IRP
-------------|---------------------------|-------
27/11/2024   | Avaliação Q4 2024        | 32.5
15/09/2024   | Avaliação Q3 2024        | 35.2
20/06/2024   | Avaliação Q2 2024        | 28.7
```

#### Evolução do IRP
Gráfico mostrando sua evolução ao longo do tempo.

**Interpretação**:
- **IRP 0-25**: Você está bem! 🟢
- **IRP 26-50**: Atenção moderada 🟡
- **IRP 51-75**: Situação preocupante 🟠
- **IRP 76-100**: Busque ajuda! 🔴

---

### Fazer Denúncia

**Caminho**: Dashboard → Denúncias → Nova Denúncia

#### Passo 1: Tipo de Denúncia
Selecione:
- Assédio Moral
- Assédio Sexual
- Discriminação
- Condições de Trabalho Inseguras
- Violação de Políticas
- Outros

#### Passo 2: Detalhes
```
Título: Assédio Moral no Setor

Descrição:
[Descreva o ocorrido de forma detalhada]
- O que aconteceu?
- Quando aconteceu?
- Quem estava envolvido?
- Testemunhas?

Data do Ocorrido: 2024-11-20

Denunciado: Nome da pessoa (opcional)
```

#### Passo 3: Anonimato
```
☑ Desejo fazer esta denúncia de forma anônima

Se marcado:
- Seu nome não aparecerá na denúncia
- Você receberá um protocolo para acompanhamento
- Gestor não saberá quem fez a denúncia
```

#### Passo 4: Confirmar
1. Revise informações
2. "Enviar Denúncia"
3. Receba protocolo:
   ```
   Protocolo: DEN-2024-456
   
   Sua denúncia foi registrada e será analisada.
   Use este protocolo para acompanhamento.
   ```

**Garantia**: Sistema protege sua identidade se escolher anônimo.

---

### 4️ Acompanhar Denúncia

**Caminho**: Dashboard → Minhas Denúncias

```
Protocolo: DEN-2024-456
Status: Em Análise
Data: 20/11/2024

Última atualização: 25/11/2024
"Denúncia está sendo investigada. 
Ações corretivas em planejamento."
```

---

##  FAQ - Perguntas Frequentes

### Para Todos os Perfis

**P: Como altero minha senha?**
R: Dashboard → Perfil → Alterar Senha

**P: Posso ver respostas de outros?**
R: Não. Apenas admin/gestor veem dados agregados (nunca individuais identificados).

**P: Os dados são seguros?**
R: Sim. Usamos criptografia, banco seguro (Azure) e conformidade com LGPD.

**P: Quanto tempo leva para responder?**
R: Normalmente 10-15 minutos para questionários completos.

---

### Para Funcionários

**P: Minhas respostas são realmente anônimas?**
R: Sim! Respostas individuais só são vistas em agregação. Admin/Gestor não sabem quem respondeu o quê.

**P: Posso pular perguntas?**
R: Não. Todas as perguntas devem ser respondidas para análise completa.

**P: E se eu não concordar com meu IRP?**
R: IRP é calculado matematicamente. Se discordar, converse com seu gestor ou RH.

**P: Denúncia anônima é realmente anônima?**
R: Sim! Sistema não armazena quem fez denúncia anônima. Nem admin pode ver.

**P: O que acontece após minha denúncia?**
R: Gestor/RH investigará de forma sigilosa e tomará ações apropriadas.

---

### Para Gestores

**P: Como sei quais funcionários não responderam?**
R: Agendamentos → Visualizar Pendentes → Lista completa

**P: Posso ver respostas individuais?**
R: Não. Apenas IRP individual e dados agregados. Respostas detalhadas são protegidas.

**P: Como priorizar ações corretivas?**
R: Foque em:
   1. Alertas críticos (IRP > 75)
   2. Departamentos com piora > 20% MoM
   3. Subescalas com pontuação < 2.5

**P: A IA sempre gera boas ações?**
R: A IA é uma ferramenta de apoio. Sempre revise e adapte à realidade da equipe.

---

### Para Administradores

**P: Como faço backup dos dados?**
R: O banco Azure tem backup automático diário (7 dias retenção). Para backup manual, use pgAdmin.

**P: Posso desativar a IA?**
R: Sim. Configure `LLM_ENABLED=false` no `.env`

**P: Como adiciono novos departamentos?**
R: Ao criar usuários com novo departamento, ele é criado automaticamente.

**P: Limite de usuários?**
R: Depende do plano Azure. Plano atual: até 500 usuários.

---

##  Suporte

### Contatos

- **Email**: suporte@psysafe.com
- **Telefone**: (11) 3000-1000
- **Horário**: Segunda a Sexta, 9h-18h

### Recursos Adicionais

- [Documentação Técnica](README.md)
- [API Reference](API-ENDPOINTS.md)
- [Vídeos Tutoriais](../Divulgacao/Video/)

---

##  Dicas de Boas Práticas

### Para Gestores
- Agende questionários trimestralmente
- Analise resultados em até 7 dias
- Implemente ações corretivas rapidamente
- Comunique mudanças à equipe
- Monitore evolução mês a mês

### Para Funcionários
- Responda com honestidade
- Reserve tempo adequado
- Use denúncias quando necessário
- Acompanhe seu IRP
- Converse com gestor sobre melhorias

### Para Todos
- Mantenha senhas seguras
- Não compartilhe credenciais
- Reporte bugs/problemas
- Dê feedback sobre o sistema

---

**Última Atualização**: Novembro 2024  
**Versão do Guia**: 1.0
