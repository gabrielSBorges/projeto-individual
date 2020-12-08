package br.com.cherry.modelo;

public class LucroDiario {
	private String data;
	private int qtd_vendas;
	private float lucro;
	
	public void setData(String data) {
		this.data = data;
	}
	
	public String getData() {
		return this.data;
	}
	
	public void setQtdVendas(int qtd_vendas) {
		this.qtd_vendas = qtd_vendas;
	}
	
	public int getQtdVendas() {
		return this.qtd_vendas;
	}
	
	public void setLucro(float lucro) {
		this.lucro = lucro;
	}
	
	public float getLucro() {
		return this.lucro;
	}
} 
