package br.com.cherry.jdbc;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;

import com.google.gson.JsonObject;

import br.com.cherry.auth.JWTCode;
import br.com.cherry.modelo.Produto;
import br.com.cherry.modelo.Retorno;

public class JDBCProdutoDAO {
	private Connection conexao;
	private JsonObject produto;
	JWTCode jwtCode = new JWTCode();
	
	public JDBCProdutoDAO(Connection conexao) {
		this.conexao = conexao;
	}

	public Retorno buscarPorId(int prodId, String tokenBase64) {
		Retorno retorno = new Retorno();
		String comando = "SELECT * FROM produtos WHERE id = ?";
		Produto produto = new Produto();
		
		try {
			if (jwtCode.valid(tokenBase64, this.conexao, true)) {
				PreparedStatement p = this.conexao.prepareStatement(comando);
				p.setInt(1, prodId);
				ResultSet rs = p.executeQuery();
				
				while (rs.next()) {
					int id = rs.getInt("id");
					String nome = rs.getString("nome");
					float valor = rs.getFloat("valor");
					int usuario_id = rs.getInt("usuario_id");
					
					produto.setId(id);
					produto.setNome(nome);
					produto.setValor(valor);
					produto.setUsuarioId(usuario_id);
				}
				
				retorno.setStatus(200);
				retorno.setProduto(produto);	
			}
			else {
				retorno.setStatus(401);
				retorno.setMessage("Requisição não autorizada!");
			}
		} catch(Exception e) {
			e.printStackTrace();
			
			retorno.setStatus(500);
			retorno.setMessage("Falha interna! Não foi possível buscar os dados do produto.");
		}
		
		return retorno;
	}
	
	public Retorno buscarPorNome(String nomeProduto, String tokenBase64) {
		Retorno retorno = new Retorno();
		String comando = "SELECT * FROM produtos ";
		
		if (!nomeProduto.contentEquals("")) {
			comando += "WHERE nome LIKE '%" + nomeProduto + "%' ";
		}
		
		comando += "ORDER BY nome ASC";
		
		List<JsonObject> listaProdutos = new ArrayList<JsonObject>();
		produto = null;
		
		try {
			if (jwtCode.valid(tokenBase64, this.conexao, true)) {
				Statement stmt = conexao.createStatement();
				ResultSet rs = stmt.executeQuery(comando);
				
				while (rs.next()) {
					int id = rs.getInt("id");
					String nome = rs.getString("nome");
					float valor = rs.getFloat("valor");
					
					
					produto = new JsonObject();
					produto.addProperty("id", id);
					produto.addProperty("nome", nome);
					produto.addProperty("valor", valor);
					
					listaProdutos.add(produto);
					
				}
				
				retorno.setStatus(200);
				retorno.setListJson(listaProdutos);				
			}
			else {
				retorno.setStatus(401);
				retorno.setMessage("Requisição não autorizada!");
			}
		} catch(Exception e) {
			e.printStackTrace();
			
			retorno.setStatus(500);
			retorno.setMessage("Falha interna! Não foi possível listar os produtos.");
		}
		
		return retorno;
	}
	
	public Retorno inserir(Produto produto, String tokenBase64) {
		Retorno retorno = new Retorno();
		String insertProduto = "INSERT INTO produtos (nome, valor, usuario_id) VALUES (?, ?, ?)";
		
		PreparedStatement p;
		
		try {
			if (jwtCode.valid(tokenBase64, this.conexao, true)) {
				p = this.conexao.prepareStatement(insertProduto);
				
				p.setString(1, produto.getNome());
				p.setFloat(2, produto.getValor());
				p.setInt(3, produto.getUsuarioId());
				
				p.execute();
				
				retorno.setStatus(200);
				retorno.setMessage("Produto cadastrado com sucesso!");				
			}
			else {
				retorno.setStatus(401);
				retorno.setMessage("Requisição não autorizada!");
			}
		} catch(SQLException e) {
			retorno.setStatus(500);
			retorno.setMessage("Falha interna! Não foi possível cadastrar o produto.");
		}
		
		return retorno;
	}

	public Retorno alterar(Produto produto, String tokenBase64) {
		Retorno retorno = new Retorno();
		String comando = "UPDATE produtos SET nome=?, valor=? WHERE id=?";
		PreparedStatement p;
		
		try {
			if (jwtCode.valid(tokenBase64, this.conexao, true)) {
				p = this.conexao.prepareStatement(comando);
				p.setString(1, produto.getNome());
				p.setFloat(2, produto.getValor());
				p.setInt(3, produto.getId());
				p.executeUpdate();
	
				retorno.setStatus(200);
				retorno.setMessage("Produto alterado com sucesso!");
			}
			else {
				retorno.setStatus(401);
				retorno.setMessage("Requisição não autorizada!");
			}
		} catch(SQLException e) {
			e.printStackTrace();
			
			retorno.setStatus(500);
			retorno.setMessage("Falha interna! Não foi possível alterar os dados do produto.");
		}
		
		return retorno;
	}
	
	public Retorno deletar(int id, String tokenBase64) {
		Retorno retorno = new Retorno();
		String buscaVenda = "SELECT id FROM produtos_vendidos WHERE produto_id = ?";
		String comando = "DELETE FROM produtos WHERE id = ?";
		PreparedStatement p;
		
		try {
			if (jwtCode.valid(tokenBase64, this.conexao, true)) {
				p = this.conexao.prepareStatement(buscaVenda);
				p.setInt(1, id);
				ResultSet rsVenda = p.executeQuery();
				
				if (!rsVenda.next()) {
					p = this.conexao.prepareStatement(comando);
					p.setInt(1, id);
					p.execute();
					
					retorno.setStatus(200);
					retorno.setMessage("Produto removido com sucesso!");
				}
				else {
					retorno.setStatus(400);
					retorno.setMessage("Não foi possível deletar o produto! Há vendas que foram realizadas com ele.");
				}
			}
			else {
				retorno.setStatus(401);
				retorno.setMessage("Requisição não autorizada!");
			}
		} catch(Exception e) {
			e.printStackTrace();
			
			retorno.setStatus(500);
			retorno.setMessage("Falha interna! Não foi possível remover o produto.");
		}
		
		return retorno;
	}

}