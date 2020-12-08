package br.com.cherry.modelo;

import java.util.ArrayList;
import java.util.List;
import com.google.gson.JsonObject;

public class Retorno {	
	// Geral
	private int status;
	private String message;
	
	public int getStatus() {
		return this.status;
	}
	
	public void setStatus(int status) {
		this.status = status;
	}
	
	public String getMessage() {
		return this.message;
	}
	
	public void setMessage(String message) {
		this.message = message;
	}
	
	// Usuarios
	private Usuario usuario;
	private List<Usuario> listUsuarios = new ArrayList<Usuario>();
	
	public Usuario getUsuario() {
		return this.usuario;
	}
	
	public void setUsuario(Usuario usuario) {
		this.usuario = usuario;
	}
	
	public List<Usuario> getListUsuarios() {
		return this.listUsuarios;
	}
	
	public void setListUsuarios(List<Usuario> listUsuarios) {
		this.listUsuarios = listUsuarios;
	}
	
	
	// Produtos
	private Produto produto;
	private List<Produto> listProdutos = new ArrayList<Produto>();
	
	public Produto getProduto() {
		return this.produto;
	}
	
	public void setProduto(Produto produto) {
		this.produto = produto;
	}
	
	public List<Produto> getListProdutos() {
		return this.listProdutos;
	}
	
	public void setListProdutos(List<Produto> listProdutos) {
		this.listProdutos = listProdutos;
	}
	
	// Vendas
	private Venda venda;
	private List<Venda> listVendas = new ArrayList<Venda>();
	
	public Venda getVenda() {
		return this.venda;
	}
	
	public void setVenda(Venda venda) {
		this.venda = venda;
	}
	
	public List<Venda> getListVendas() {
		return this.listVendas;
	}
	
	public void setListVendas(List<Venda> listVendas) {
		this.listVendas = listVendas;
	}
	
	// Tipos
	private Tipo tipo;
	private List<Tipo> listTipos = new ArrayList<Tipo>();
	
	public Tipo getTipo() {
		return this.tipo;
	}
	
	public void setTipo(Tipo tipo) {
		this.tipo = tipo;
	}
	
	public List<Tipo> getListTipos() {
		return this.listTipos;
	}
	
	public void setListTipos(List<Tipo> listTipos) {
		this.listTipos = listTipos;
	}
	
	// JsonObject
	private List<JsonObject> listJson = new ArrayList<JsonObject>();
	
	public List<JsonObject> getListJson() {
		return this.listJson;
	}
	
	public void setListJson(List<JsonObject> listJson) {
		this.listJson = listJson;
	}
	
	// Auth
	private Auth auth;
	
	public void setAuth(Auth auth) {
		this.auth = auth;
	}
	
	public Auth getAuth() {
		return this.auth;
	}
	
	// Relatórios
	// Produtos Mais Vendidos
	private List<ProdutoMaisVendido> listProdutosMaisVendidos = new ArrayList<ProdutoMaisVendido>();
	
	public List<ProdutoMaisVendido> getListProdutosMaisVendidos() {
		return this.listProdutosMaisVendidos;
	}
	
	public void setListProdutosMaisVendidos(List<ProdutoMaisVendido> listProdutosMaisVendidos) {
		this.listProdutosMaisVendidos = listProdutosMaisVendidos;
	}
	
	private List<LucroDiario> listLucrosDiarios = new ArrayList<LucroDiario>();
	
	public List<LucroDiario> getListLucrosDiarios() {
		return this.listLucrosDiarios;
	}
	
	public void setListLucrosDiarios(List<LucroDiario> listLucrosDiarios) {
		this.listLucrosDiarios = listLucrosDiarios;
	}
}