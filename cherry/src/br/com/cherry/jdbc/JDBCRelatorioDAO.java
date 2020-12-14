package br.com.cherry.jdbc;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.List;

import br.com.cherry.auth.Base64Code;
import br.com.cherry.auth.JWTCode;
import br.com.cherry.auth.MD5Code;
import br.com.cherry.modelo.ProdutoMaisVendido;
import br.com.cherry.modelo.Retorno;

public class JDBCRelatorioDAO extends JDBCUtils {
	private Connection conexao;
	JWTCode jwtCode = new JWTCode();
	MD5Code md5Code = new MD5Code();
	Base64Code base64 = new Base64Code();
	
	public JDBCRelatorioDAO(Connection conexao) {
		this.conexao = conexao;
	}
	
	public Retorno produtosMaisVendidos(String dt_inicio, String dt_fim, String tokenBase64) {
		Retorno retorno = new Retorno();
		
		try {
			if (jwtCode.valid(tokenBase64, this.conexao, true)) {
				dt_inicio += " 00:00:00";
				dt_fim += " 23:59:59";
				
				String selectProdutosVendidos = "SELECT p.id, p.nome, pv.quantidade, p.valor as valor_unit FROM vendas v INNER JOIN produtos_vendidos pv ON pv.venda_id = v.id INNER JOIN produtos p ON pv.produto_id = p.id WHERE v.dt_realizado >= ? AND v.dt_realizado <= ?;";
			
				PreparedStatement p = this.conexao.prepareStatement(selectProdutosVendidos);
				p.setString(1, dt_inicio);
				p.setString(2, dt_fim);
				ResultSet rs = p.executeQuery();
				
				List<ProdutoMaisVendido> produtos = new ArrayList<ProdutoMaisVendido>();
						
				while (rs.next()) {
					int id = rs.getInt("id");
					String nome = rs.getString("nome");
					int quantidade = rs.getInt("quantidade");
					float valor_unit = rs.getFloat("valor_unit");
					float valor_total = valor_unit * quantidade;
					
					ProdutoMaisVendido produto = new ProdutoMaisVendido();
					produto.setId(id);
					produto.setNome(nome);
					produto.setQuantidade(quantidade);
					produto.setValorUnit(valor_unit);
					produto.setValorTotal(valor_total);
					
					produtos.add(produto);
				}
				
				List<ProdutoMaisVendido> produtosMaisVendidos = new ArrayList<ProdutoMaisVendido>();
				
				for (ProdutoMaisVendido produto : produtos) {
					if (this.inArrayProdutos(produtosMaisVendidos, produto.getId())) {
						int index = this.returnIndexOf(produtosMaisVendidos, produto.getId());
						
						int current_qtd = produtosMaisVendidos.get(index).getQuantidade();
						float current_total = produtosMaisVendidos.get(index).getValorTotal();
						
						produtosMaisVendidos.get(index).setQuantidade(produto.getQuantidade() + current_qtd);
						produtosMaisVendidos.get(index).setValorTotal(produto.getValorTotal() + current_total);
					}
					else {
						produtosMaisVendidos.add(produto);
					}
				}
				
				retorno.setStatus(200);
				retorno.setListProdutosMaisVendidos(produtosMaisVendidos);
			}
			else {
				retorno.setStatus(401);
				retorno.setMessage("Requisição não autorizada!");
			}
		}
		catch(Exception e) {
			e.printStackTrace();
			
			retorno.setStatus(500);
			retorno.setMessage("Falha interna! Não foi possível gerar o relatório.");
		}
		
		return retorno;
	}
	
	public Retorno lucroDiario(String dt_inicio, String dt_fim, String tokenBase64) {
		Retorno retorno = new Retorno();
		
		try {
			if (jwtCode.valid(tokenBase64, this.conexao, true)) {
				dt_inicio += " 00:00:00";
				dt_fim += " 23:59:59";
			
			}
			else {
				retorno.setStatus(401);
				retorno.setMessage("Requisição não autorizada!");
			}
		}
		catch(Exception e) {
			e.printStackTrace();
			
			retorno.setStatus(500);
			retorno.setMessage("Falha interna! Não foi possível gerar o relatório.");
		}
		
		return retorno;
	}
}
