package br.com.cherry.jdbcinterface;

import br.com.cherry.modelo.Produto;
import br.com.cherry.modelo.Retorno;

public interface ProdutoDAO {
	public Retorno buscarPorId(int id);
	public Retorno buscarPorNome(String nome);
	public Retorno inserir(Produto produto);
	public Retorno deletar(int id);
	public Retorno alterar(Produto produto);
}