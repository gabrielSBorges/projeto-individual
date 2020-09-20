package br.com.cherry.modelo;

import java.io.Serializable;

public class Produto implements Serializable {
	private static final long serialVersionUID = 1L;
	
	private int id;
	private String nome;
	private float valor;
	private int quantidade;
	private int usuario_id;
	
	
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
	
	// Valor
	public float getValor() {
		return this.valor;
	}
	
	public void setValor(float valor) {
		this.valor = valor;
	}
	
	// Quantidade
	public int getQuantidade() {
		return this.quantidade;
	}
	
	public void setQuantidade(int quantidade) {
		this.quantidade = quantidade;
	}
	
	// Usuario ID
	public int getUsuarioId() {
		return this.usuario_id;
	}
	
	public void setUsuarioId(int usuario_id) {
		this.usuario_id = usuario_id;
	}
}