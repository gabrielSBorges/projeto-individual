package br.com.cherry.jdbc;

import java.util.List;

import br.com.cherry.modelo.ProdutoMaisVendido;

public class JDBCUtils {
	public Boolean inArrayProdutos(List<ProdutoMaisVendido> produtosMaisVendidos, int id) {
		for (ProdutoMaisVendido produto : produtosMaisVendidos) {
			if (produto.getId() == id) {
				return true;
			}
		}
		
		return false;
	}
	
	public int returnIndexOf(List<ProdutoMaisVendido> produtosMaisVendidos, int id) {
		for (int i = 0; i < produtosMaisVendidos.size(); i++) {
			if (produtosMaisVendidos.get(i).getId() == id) {
				return i;
			}
		}
		
		return -0;
	}
}
