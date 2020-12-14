package br.com.cherry.jdbc;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;

import br.com.cherry.auth.JWTCode;
import br.com.cherry.modelo.Produto;
import br.com.cherry.modelo.Retorno;
import br.com.cherry.modelo.Venda;

public class JDBCVendaDAO {
	private Connection conexao;
	JWTCode jwtCode = new JWTCode();
	
	public JDBCVendaDAO(Connection conexao) {
		this.conexao = conexao;
	}
	
	public Retorno buscarPorId(int vendaId, String tokenBase64) {
		Retorno retorno = new Retorno();
		
		String buscaVenda = "SELECT v.*, u.nome AS usuario_nome FROM vendas v INNER JOIN usuarios u ON v.usuario_id = u.id WHERE v.id = ?";
		String buscaProdutos = "SELECT p.id, p.nome, pv.quantidade, pv.valor_unit AS valor FROM produtos_vendidos pv INNER JOIN produtos p ON pv.produto_id = p.id WHERE pv.venda_id = ?";
		
		Venda venda = new Venda();
		
		try {
			if (jwtCode.valid(tokenBase64, this.conexao, true)) {
				PreparedStatement p = this.conexao.prepareStatement(buscaVenda);
				p.setInt(1, vendaId);
				ResultSet rsVenda = p.executeQuery();
				
				while (rsVenda.next()) {
					int id = rsVenda.getInt("id");
					String dt_realizado = rsVenda.getString("dt_realizado");
					float valor = rsVenda.getFloat("valor");
					int usuario_id = rsVenda.getInt("usuario_id");
					String usuario_nome = rsVenda.getString("usuario_nome");
					
					venda.setId(id);
					venda.setValor(valor);
					venda.setDataRealizado(dt_realizado);
					venda.setUsuarioId(usuario_id);		
					venda.setUsuarioNome(usuario_nome);
				}
				
				p = this.conexao.prepareStatement(buscaProdutos);
				p.setInt(1, vendaId);
				ResultSet rsProduto = p.executeQuery();
				
				List<Produto> produtos = new ArrayList<Produto>();
				
				while (rsProduto.next()) {				
					int produto_id = rsProduto.getInt("id");
					String nome = rsProduto.getString("nome");
					int quantidade = rsProduto.getInt("quantidade");
					float produto_valor = rsProduto.getFloat("valor");
					
					Produto produto = new Produto();
					produto.setId(produto_id);
					produto.setNome(nome);
					produto.setQuantidade(quantidade);
					produto.setValor(produto_valor);
					
					produtos.add(produto);
				}
				
				venda.setListProdutos(produtos);
				
				retorno.setStatus(200);
				retorno.setVenda(venda);
			}
			else {
				retorno.setStatus(401);
				retorno.setMessage("Requisição não autorizada!");
			}
		} catch(Exception e) {
			e.printStackTrace();
			
			retorno.setStatus(500);
			retorno.setMessage("Falha interna! Não foi possível buscar os dados da venda.");
		}
		
		return retorno;
	}
	
	public Retorno listar(String dt_re, int usu_id, String tokenBase64) {
		Retorno retorno = new Retorno();
		
		String dt_inicio = dt_re + " 00:00:00";
		String dt_fim = dt_re + " 23:59:59";
		
		String buscaVendas = "SELECT v.*, u.nome AS usuario_nome FROM vendas v INNER JOIN usuarios u ON v.usuario_id = u.id";
		
		if (!dt_re.contentEquals("") && usu_id != 0) {	
			buscaVendas += " WHERE v.dt_realizado >= ? AND v.dt_realizado <= ? AND v.usuario_id = ?";
		}
		else if (usu_id != 0) {
			buscaVendas += " WHERE v.usuario_id = ?";
		}
		else if (!dt_re.contentEquals("")) {
			buscaVendas += " WHERE v.dt_realizado >= ? AND v.dt_realizado <= ?";
		}
		
		String buscaProdutos = "SELECT p.id, p.nome, pv.quantidade, pv.valor_unit AS valor FROM produtos_vendidos pv INNER JOIN produtos p ON pv.produto_id = p.id WHERE pv.venda_id = ?";
		
		List<Venda> listaVendas = new ArrayList<Venda>();
		
		try {
			if (jwtCode.valid(tokenBase64, this.conexao, true)) {
				PreparedStatement p = this.conexao.prepareStatement(buscaVendas);
				
				if (!dt_re.contentEquals("") && usu_id != 0) {	
					p.setString(1, dt_inicio);
					p.setString(2, dt_fim);
					p.setInt(3, usu_id);
				}
				else if (usu_id != 0) {
					p.setInt(1, usu_id);
				}
				else if (!dt_re.contentEquals("")) {
					p.setString(1, dt_inicio);
					p.setString(2, dt_fim);
				}
				
				ResultSet rsVenda = p.executeQuery();
				
				while (rsVenda.next()) {
					int id = rsVenda.getInt("id");
					String dt_realizado = rsVenda.getString("dt_realizado");
					float valor = rsVenda.getFloat("valor");
					int usuario_id = rsVenda.getInt("usuario_id");
					String usuario_nome = rsVenda.getString("usuario_nome");
					
					Venda venda = new Venda();
					venda.setId(id);
					venda.setDataRealizado(dt_realizado);
					venda.setValor(valor);
					venda.setUsuarioId(usuario_id);
					venda.setUsuarioNome(usuario_nome);
					
					p = this.conexao.prepareStatement(buscaProdutos);
					p.setInt(1, id);
					ResultSet rsProduto = p.executeQuery();
					
					List<Produto> produtos = new ArrayList<Produto>();
					
					while (rsProduto.next()) {				
						int produto_id = rsProduto.getInt("id");
						String nome = rsProduto.getString("nome");
						int quantidade = rsProduto.getInt("quantidade");
						float produto_valor = rsProduto.getFloat("valor");
						
						Produto produto = new Produto();
						produto.setId(produto_id);
						produto.setNome(nome);
						produto.setQuantidade(quantidade);
						produto.setValor(produto_valor);
						
						produtos.add(produto);
					}
					
					venda.setListProdutos(produtos);
					
					listaVendas.add(venda);
				}
				
				retorno.setStatus(200);
				retorno.setListVendas(listaVendas);
			}
			else {
				retorno.setStatus(401);
				retorno.setMessage("Requisição não autorizada!");
			}
		} catch(Exception e) {
			e.printStackTrace();
			
			retorno.setStatus(500);
			retorno.setMessage("Falha interna! Não foi possível listar as vendas.");
		}
		
		return retorno;
	}
	
	public Retorno inserir(Venda venda, String tokenBase64) {
		Retorno retorno = new Retorno();
		
		String insertVenda = "INSERT INTO vendas (valor, dt_realizado, usuario_id) VALUES (?, ?, ?)";
		String insertProdutoVendido = "INSERT INTO produtos_vendidos (quantidade, valor_unit, venda_id, produto_id) VALUES (?, ?, ?, ?)";
		
		PreparedStatement p;
		
		try {
			if (jwtCode.valid(tokenBase64, this.conexao, true)) {
				p = this.conexao.prepareStatement(insertVenda, Statement.RETURN_GENERATED_KEYS);
				
				// Venda
				p.setFloat(1, venda.getValor());
				p.setString(2, venda.getDataRealizado());
				p.setInt(3, venda.getUsuarioId());
				
				p.execute();
				
				ResultSet rs = p.getGeneratedKeys();
				
				// Produtos Vendidos
				if (rs.next()) {
					int venda_id = rs.getInt(1);
					
					for (Produto produto : venda.getListProdutos()) {
						p = this.conexao.prepareStatement(insertProdutoVendido);
						
						p.setInt(1, produto.getQuantidade());
						p.setFloat(2, produto.getValor());
						p.setInt(3, venda_id);
						p.setInt(4, produto.getId());
						
						p.execute();
					}
					
				}
				
				retorno.setStatus(200);
				retorno.setMessage("Venda cadastrada com sucesso!");
			}
			else {
				retorno.setStatus(401);
				retorno.setMessage("Requisição não autorizada!");
			}
		} catch(SQLException e) {
			retorno.setStatus(500);
			retorno.setMessage("Falha interna! Não foi possível cadastrar a venda.");
		}
		
		return retorno;
	}
	
	public Retorno deletar(int id, String tokenBase64) {
		Retorno retorno = new Retorno();
		String comando = "DELETE FROM vendas WHERE id = ?";
		PreparedStatement p;
		
		try {
			if (jwtCode.valid(tokenBase64, this.conexao, true)) {
				p = this.conexao.prepareStatement(comando);
				p.setInt(1, id);
				p.execute();
				
				retorno.setStatus(200);
				retorno.setMessage("Venda excluída com sucesso!");				
			}
			else {
				retorno.setStatus(401);
				retorno.setMessage("Requisição não autorizada!");
			}
		} catch(Exception e) {
			e.printStackTrace();
			
			retorno.setStatus(500);
			retorno.setMessage("Falha interna! Não foi possível excluir a venda.");
		}
		
		return retorno;
	}
}
