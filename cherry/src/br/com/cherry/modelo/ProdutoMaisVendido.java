package br.com.cherry.modelo;

public class ProdutoMaisVendido {
	private int id;
	private String nome;
	private int quantidade;
	private float valor_unit;
	private float valor_total;
	
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
	
	// Valor unitario
	public float getValorUnit() {
		return this.valor_unit;
	}
	
	public void setValorUnit(float valor_unit) {
		this.valor_unit = valor_unit;
	}
	
	// Valor unitario
	public float getValorTotal() {
		return this.valor_total;
	}
	
	public void setValorTotal(float valor_total) {
		this.valor_total = valor_total;
	}
	
	// Quantidade
	public int getQuantidade() {
		return this.quantidade;
	}
	
	public void setQuantidade(int quantidade) {
		this.quantidade = quantidade;
	}
}
