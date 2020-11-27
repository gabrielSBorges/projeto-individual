DROP DATABASE IF EXISTS db_auth;

CREATE DATABASE IF NOT EXISTS db_auth DEFAULT CHARACTER SET utf8 COLLATE utf8_bin ;

USE db_auth;

DROP TABLE IF EXISTS db_auth.usuarios;

CREATE TABLE IF NOT EXISTS db_auth.usuarios (
  id INT UNSIGNED ZEROFILL NOT NULL AUTO_INCREMENT COMMENT 'Identificação do usuário.',
  nome VARCHAR(60) NOT NULL COMMENT 'Nome do usuário.',
  senha VARCHAR(45) NOT NULL COMMENT 'Senha criptografada do usuário.',
  PRIMARY KEY (id)
);

INSERT INTO usuarios (nome, senha) VALUES("Gabriel", "e10adc3949ba59abbe56e057f20f883e");

SELECT * FROM usuarios;