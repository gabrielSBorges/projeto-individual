package br.com.cherry.modelo;

public class ProdutoVendido {
	private int id;
	private int quantidade;
	private float valor_unit;
	private int venda_id;
	private int produto_id;
	
	// ID
	public int getId() {
		return this.id;
	}
	
	public void setId(int id) {
		this.id = id;
	}
	
	// Valor unit�rio
	public float getValorUnit() {
		return this.valor_unit;
	}
	
	public void setValorUnit(float valor_unit) {
		this.valor_unit = valor_unit;
	}
	
	// Quantidade
	public int getQuantidade() {
		return this.quantidade;
	}
	
	public void setQuantidade(int quantidade) {
		this.quantidade = quantidade;
	}
	
	// Venda ID
	public int getVendaId() {
		return this.venda_id;
	}
	
	public void setVendaId(int venda_id) {
		this.venda_id = venda_id;
	}
	
	// Produto ID
	public int getProdutoId() {
		return this.produto_id;
	}
	
	public void setProdutoId(int produto_id) {
		this.produto_id = produto_id;
	}
}
