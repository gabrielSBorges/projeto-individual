package br.com.cherry.modelo;

import java.io.Serializable;

public class Usuario implements Serializable {
	private static final long serialVersionUID = 1L;
	
	private int id;
	private String nome;
	private String email;
	private String senha;
	private String tipo;
	private int ativo;
	private int tipo_id;
	
	
	// ID
	public int getId() {
		return this.id;
	}
	
	public void setId(int id) {
		this.id = id;
	}
	
	// Nome
	public String getNome() {
		return this.nome;
	}
	
	public void setNome(String nome) {
		this.nome = nome;
	}
	
	// E-mail
	public String getEmail() {
		return this.email;
	}
	
	public void setEmail(String email) {
		this.email = email;
	}
	
	// Senha
	public String getSenha() {
		return this.senha;
	}
	
	public void setSenha(String senha) {
		this.senha = senha;
	}
	
	// Ativo
	public int getAtivo() {
		return this.ativo;
	}
	
	public void setAtivo(int ativo) {
		this.ativo = ativo;
	}
	
	// Tipo ID
	public int getTipoId() {
		return this.tipo_id;
	}
	
	public void setTipoId(int tipo_id) {
		this.tipo_id = tipo_id;
	}
	
	// Tipo
	public String getTipo() {
		return this.tipo;
	}
	
	public void setTipo(String tipo) {
		this.tipo = tipo;
	}
}