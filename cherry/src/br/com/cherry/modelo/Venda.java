package br.com.cherry.modelo;

import java.util.ArrayList;
import java.util.List;

public class Venda {
	private int id;
	private float valor;
	private String dt_realizado;
	private int usuario_id;
	private String usuario_nome;
	private List<Produto> produtos = new ArrayList<Produto>();
	
	// ID
	public int getId() {
		return this.id;
	}
	
	public void setId(int id) {
		this.id = id;
	}
	
	// Valor
	public float getValor() {
		return this.valor;
	}
	
	public void setValor(float valor) {
		this.valor = valor;
	}
	
	// Data Realizado
	public String getDataRealizado() {
		return this.dt_realizado;
	}
	
	public void setDataRealizado(String dt_realizado) {
		this.dt_realizado = dt_realizado;
	}
	
	
	// Produtos	
	public List<Produto> getListProdutos() {
		return this.produtos;
	}
	
	public void setListProdutos(List<Produto> produtos) {
		this.produtos = produtos;
	}
	
	// Usuario ID
	public int getUsuarioId() {
		return this.usuario_id;
	}
	
	public void setUsuarioId(int usuario_id) {
		this.usuario_id = usuario_id;
	}
	
	// Usuario Nome
	public String getUsuarioNome() {
		return this.usuario_nome;
	}
	
	public void setUsuarioNome(String usuario_nome) {
		this.usuario_nome = usuario_nome;
	}
}
