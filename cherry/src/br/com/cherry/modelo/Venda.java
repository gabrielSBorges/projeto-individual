package br.com.cherry.modelo;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

public class Venda implements Serializable {
	private static final long serialVersionUID = 1L;
	
	private int id;
	private Date dt_realizado;
	private float valor;
	private int usuario_id;
	private List<ProdutoVendido> produtos_vendidos = new ArrayList<ProdutoVendido>();
	
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
	
	// Dt Realizado
	public Date getDtRealizado() {
		return this.dt_realizado;
	}
	
	public void setDtRealizado(Date dt_realizado) {
		this.dt_realizado = dt_realizado;
	}
	
	// Usuario ID
	public int getUsuarioId() {
		return this.usuario_id;
	}
	
	public void setUsuarioId(int usuario_id) {
		this.usuario_id = usuario_id;
	}
	
	// Produtos Vendidos
	public List<ProdutoVendido> getProdutosVendidos() {
		return this.produtos_vendidos;
	}
	
	public void setProdutosVendidos(List<ProdutoVendido> produtos_vendidos) {
		this.produtos_vendidos = produtos_vendidos;
	}
}
