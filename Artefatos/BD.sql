-- Remove a necessidade de prefixar os objetos com o nome do schema.
-- Em psql, você pode se conectar diretamente ao banco de dados com \c nomedobanco.
CREATE SCHEMA IF NOT EXISTS mydb;
SET search_path TO mydb;

-- -----------------------------------------------------
-- Tabela "Questionario"
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS Questionario (
  idQuestionario INT PRIMARY KEY,
  dataCriacao DATE NULL,
  dataEncerramento DATE NULL
);

-- -----------------------------------------------------
-- Tabela "Pergunta"
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS Pergunta (
  idPergunta INT PRIMARY KEY,
  conteudo TEXT NULL
);

-- -----------------------------------------------------
-- Tabela "Questionario_has_Pergunta" (Tabela de Junção)
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS Questionario_has_Pergunta (
  idQuestionario INT NOT NULL,
  idPergunta INT NOT NULL,
  numPergunta INT NULL,
  PRIMARY KEY (idQuestionario, idPergunta),
  CONSTRAINT fk_qp_questionario
    FOREIGN KEY (idQuestionario)
    REFERENCES Questionario (idQuestionario)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT fk_qp_pergunta
    FOREIGN KEY (idPergunta)
    REFERENCES Pergunta (idPergunta)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
);

-- Índices para a tabela de junção
CREATE INDEX fk_qp_pergunta_idx ON Questionario_has_Pergunta (idPergunta);

-- -----------------------------------------------------
-- Tabela "Usuario"
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS Usuario (
  idUsuario INT PRIMARY KEY,
  nome VARCHAR(45) NULL,
  departamento VARCHAR(45) NULL,
  equipe VARCHAR(45) NULL,
  dataNascimento DATE NULL
);

-- -----------------------------------------------------
-- Tabela "Resposta"
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS Resposta (
  conteudoResposta TEXT NOT NULL,
  idUsuario INT NOT NULL,
  idQuestionario INT NOT NULL,
  idPergunta INT NOT NULL,
  PRIMARY KEY (idUsuario, idQuestionario, idPergunta),
  CONSTRAINT fk_resposta_usuario
    FOREIGN KEY (idUsuario)
    REFERENCES Usuario (idUsuario)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT fk_resposta_qp
    FOREIGN KEY (idQuestionario, idPergunta)
    REFERENCES Questionario_has_Pergunta (idQuestionario, idPergunta)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
);

-- Índice para a tabela de respostas
CREATE INDEX fk_resposta_qp_idx ON Resposta (idQuestionario, idPergunta);

-- -----------------------------------------------------
-- Tabela "Denuncia"
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS Denuncia (
  idDenuncia INT NOT NULL,
  tipo TEXT NULL, -- TINYTEXT foi convertido para TEXT
  status SMALLINT NULL, -- TINYINT foi convertido para SMALLINT
  descricao VARCHAR(45) NULL,
  Usuario_idUsuario INT NOT NULL,
  PRIMARY KEY (idDenuncia, Usuario_idUsuario),
  CONSTRAINT fk_Denuncia_Usuario1
    FOREIGN KEY (Usuario_idUsuario)
    REFERENCES Usuario (idUsuario)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
);

-- Índice para a tabela de denúncias
CREATE INDEX fk_Denuncia_Usuario1_idx ON Denuncia (Usuario_idUsuario);