package br.com.cherry.modelo;

import java.io.Serializable;

public class Produto implements Serializable {
	private static final long serialVersionUID = 1L;
	
	private int id;
	private int categoria;
	private int marcas_id;
	private String modelo;
	private int capacidade;
	private float valor;
	
	public int getId() {
		return this.id;
	}
	
	public void setId(int id) {
		this.id = id;
	}
	
	public int getCategoria() {
		return this.categoria;
	}
	
	public void setCategoria(int categoria) {
		this.categoria = categoria;
	}
	
	public int getMarcaId() {
		return this.marcas_id;
	}
	
	public void setMarcaId(int marcaId) {
		this.marcas_id = marcaId;
	}
	
	public String getModelo() {
		return this.modelo;
	}
	
	public void setModelo(String modelo) {
		this.modelo = modelo;
	}
	
	public int getCapacidade() {
		return this.capacidade;
	}
	
	public void setCapacidade(int capacidade) {
		this.capacidade = capacidade;
	}
	
	public float getValor() {
		return this.valor;
	}
	
	public void setValor(float valor) {
		this.valor = valor;
	}
	
	@Override
    public String toString()
    {
        return "" + this.id + "";
    }
}