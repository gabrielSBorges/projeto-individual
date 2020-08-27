package br.com.cherry.jdbc;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;

import com.google.gson.JsonObject;

import br.com.cherry.modelo.Produto;
import br.com.cherry.modelo.Retorno;

public class JDBCProdutoDAO {
	private Connection conexao;
	private JsonObject produto;
	
	public JDBCProdutoDAO(Connection conexao) {
		this.conexao = conexao;
	}

	public Retorno buscarPorId(int prodId) {
		Retorno retorno = new Retorno();
		String comando = "SELECT * FROM produtos WHERE id = ?";
		Produto produto = new Produto();
		
		try {
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
			
			retorno.setStatus("sucesso");
			retorno.setProduto(produto);	
		} catch(Exception e) {
			e.printStackTrace();
			
			retorno.setStatus("erro");
			retorno.setMessage("Ocorreu um erro ao tentar buscar o produto! \n Erro: \n" + e.getMessage());
		}
		
		return retorno;
	}
	
	public Retorno buscarPorNome(String nomeProduto) {
		Retorno retorno = new Retorno();
		String comando = "SELECT * FROM produtos ";
		
		if (!nomeProduto.contentEquals("")) {
			comando += "WHERE nome LIKE '%" + nomeProduto + "%' ";
		}
		
		comando += "ORDER BY nome ASC";
		
		List<JsonObject> listaProdutos = new ArrayList<JsonObject>();
		produto = null;
		
		try {
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
			
			retorno.setStatus("sucesso");
			retorno.setListJson(listaProdutos);
		} catch(Exception e) {
			e.printStackTrace();
			
			retorno.setStatus("erro");
			retorno.setMessage("Ocorreu um erro ao tentar listar os produtos! \n Erro: \n" + e.getMessage());
		}
		
		return retorno;
	}
	
	public Retorno inserir(Produto produto) {
		Retorno retorno = new Retorno();
		String insertProduto = "INSERT INTO produtos (nome, valor, usuario_id) VALUES (?, ?, ?)";
		
		PreparedStatement p;
		
		try {
			// Cadastrar produto
			p = this.conexao.prepareStatement(insertProduto);
			
			p.setString(1, produto.getNome());
			p.setFloat(2, produto.getValor());
			p.setInt(3, produto.getUsuarioId());
			
			p.execute();
			
			retorno.setStatus("sucesso");
			retorno.setMessage("Produto cadastrado com sucesso!");
		} catch(SQLException e) {
			retorno.setStatus("erro");
			retorno.setMessage("Ocorreu um erro ao tentar cadastrar o produto! \n Erro: \n" + e.getMessage());
		}
		
		return retorno;
	}

	public Retorno alterar(Produto produto) {
		Retorno retorno = new Retorno();
		String comando = "UPDATE produtos SET nome=?, valor=? WHERE id=?";
		PreparedStatement p;
		
		try {
			p = this.conexao.prepareStatement(comando);
			p.setString(1, produto.getNome());
			p.setFloat(2, produto.getValor());
			p.setInt(3, produto.getId());
			p.executeUpdate();

			retorno.setStatus("sucesso");
			retorno.setMessage("Produto alterado com sucesso!");
			
		} catch(SQLException e) {
			e.printStackTrace();
			
			retorno.setStatus("erro");
			retorno.setMessage("Ocorreu um erro ao tentar alterar esse produto! \n Erro: \n" + e.getMessage());
		}
		
		return retorno;
	}
	
	public Retorno deletar(int id) {
		Retorno retorno = new Retorno();
		String comando = "DELETE FROM produtos WHERE id = ?";
		PreparedStatement p;
		
		try {
			p = this.conexao.prepareStatement(comando);
			p.setInt(1, id);
			p.execute();
			
			retorno.setStatus("sucesso");
			retorno.setMessage("Produto removido com sucesso!");
		} catch(Exception e) {
			e.printStackTrace();
			
			retorno.setStatus("erro");
			retorno.setMessage("Ocorreu um erro ao tentar remover o produto! \n Erro: \n" + e.getMessage());
		}
		
		return retorno;
	}

}