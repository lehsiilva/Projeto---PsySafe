# PsySafe - Sistema de Gestão e Monitoramento de Riscos Psicossociais.

O PsySafe tem como objetivo automatizar a avaliação de riscos psicossociais no ambiente de trabalho, oferecendo uma solução para os desafios que as empresas enfrentam, como a inconformidade com a legislação, a gestão manual e fragmentada dos riscos e a falta de métricas claras para a tomada de decisões. A plataforma centraliza informações, gera dashboards interativos, relatórios e sugestões de ações corretivas, garantindo conformidade com a NR-1 e promovendo a proteção da saúde mental, a produtividade e o bem-estar dos colaboradores.

## Alunos integrantes da equipe

* Letícia Beatriz da Silva Lopes
* Luciano Gomes Eudes

## Professores responsáveis

* Marco Paulo Soares Gomes
* Max do Val Machado

## Instruções de utilização

## Requisitos

Antes de executar o sistema, certifique-se de ter instalado:

- **Java 11 ou superior**
- **Maven**
- **Node.js** (versão 18 ou superior recomendada)
- **npm** (geralmente instalado junto com o Node.js)

---

## Backend (Java + Spark)

O backend do sistema é desenvolvido em **Java** utilizando **Maven** e **Spark**.

### Passos para execução

1. Abra o terminal na pasta raiz do projeto backend (*plmg-cc-ti2-2025-2-G05-psysafe*). 
2. Execute o comando para compilar e gerar o JAR executável:

```bash
mvn clean install
cd target
java -jar psysafe-1.0-SNAPSHOT-exec.jar
```
O BackEnd está disponível em: http://localhost:4567

## FrontEnd (React + Tailwind CSS + Vite)

O frontend do sistema é desenvolvido em **React** utilizando **Tailwind CSS** e **Vite**.

### Passos para execução

1. Abra o terminal na pasta raiz do projeto frontend (*plmg-cc-ti2-2025-2-G05-psysafe\Codigo\frontend*). 
2. Execute o comando para compilar e abrir a aplicação:

```bash
npm install
npm run dev
```
O FrontEnd está disponível em: http://localhost:5173

## Banco de Dados

O backend do sistema se conecta a um banco de dados PostgreSQL hospedado no **Azure**.  
É possível utilizar o **pgAdmin4** local para gerenciamento visual, mas não é obrigatório.  

### DataBase

Caso o arquivo **DataBase** esteja sem as credenciais para ativar o Banco de Dados adicione nesse arquivo:

Disponível em *plmg-cc-ti2-2025-2-G05-psysafe\src\main\java\com\psysafe\database*

### Passos para execução

1. Abra o arquivo e preencha as seguintes informações. 

```bash
URL = "jdbc:postgresql://psysafe.postgres.database.azure.com:5432/psysafe_db";
USER = "psysafeAdm";
PASSWORD = "Adm12345"; 
```


