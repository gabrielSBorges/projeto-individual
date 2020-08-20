package br.com.cherry.jdbc;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;

import com.google.gson.JsonObject;

import br.com.cherry.jdbcinterface.ProdutoDAO;
import br.com.cherry.modelo.Produto;
import br.com.cherry.modelo.Retorno;

public class JDBCProdutoDAO implements ProdutoDAO {
	private Connection conexao;
	private JsonObject produto;
	
	public JDBCProdutoDAO(Connection conexao) {
		this.conexao = conexao;
	}

	public Retorno buscarPorId(int prodId) {
		Retorno retorno = new Retorno();
		String comando = "select * from produtos where produtos.id = ?";
		Produto produto = new Produto();
		
		try {
			PreparedStatement p = this.conexao.prepareStatement(comando);
			p.setInt(1, prodId);
			ResultSet rs = p.executeQuery();
			
			while (rs.next()) {
				int id = rs.getInt("id");
				int categoria = rs.getInt("categoria");
				String modelo = rs.getString("modelo");
				int capacidade = rs.getInt("capacidade");
				float valor = rs.getFloat("valor");
				int marcaId = rs.getInt("marcas_id");

				produto.setId(id);
				produto.setCategoria(categoria);
				produto.setMarcaId(marcaId);
				produto.setModelo(modelo);
				produto.setCapacidade(capacidade);
				produto.setValor(valor);
			}
			
			retorno.setStatus("sucesso");
			retorno.setProduto(produto);	
		} catch(Exception e) {
			e.printStackTrace();
			
			retorno.setStatus("erro");
			retorno.setMessage("Ocorreu um erro ao tentar listar os produtos! \n Erro: \n" + e.getMessage());
		}
		
		return retorno;
	}
	
	public Retorno buscarPorNome(String nome) {
		Retorno retorno = new Retorno();
		String comando = "SELECT produtos.*, marcas.nome as marca FROM produtos INNER JOIN marcas ON produtos.marcas_id = marcas.id ";
		
		if (!nome.contentEquals("")) {
			comando += "WHERE modelo LIKE '%" + nome + "%' ";
		}
		
		comando += "ORDER BY categoria ASC, marcas.nome ASC, modelo ASC";
		
		List<JsonObject> listaProdutos = new ArrayList<JsonObject>();
		produto = null;
		
		try {
			Statement stmt = conexao.createStatement();
			ResultSet rs = stmt.executeQuery(comando);
			
			while (rs.next()) {
				int id = rs.getInt("id");
				String categoria = rs.getString("categoria");
				String modelo = rs.getString("modelo");
				int capacidade = rs.getInt("capacidade");
				float valor = rs.getFloat("valor");
				String marcaNome = rs.getString("marca");
				
				if (categoria.contentEquals("1")) {
					categoria = "Geladeira";
				} else if (categoria.contentEquals("2")) {
					categoria = "Freezer";
				}
				
				produto = new JsonObject();
				produto.addProperty("id", id);
				produto.addProperty("categoria", categoria);
				produto.addProperty("modelo", modelo);
				produto.addProperty("capacidade", capacidade);
				produto.addProperty("valor", valor);
				produto.addProperty("marcaNome", marcaNome);
				
				listaProdutos.add(produto);
				
			}
			
			retorno.setStatus("sucesso");
			retorno.setListJson(listaProdutos);
		} catch(Exception e) {
			e.printStackTrace();
			
			retorno.setStatus("erro");
			retorno.setMessage("Ocorreu um erro ao tentar listar as marcas! \n Erro: \n" + e.getMessage());
		}
		
		
		return retorno;
	}
	
	public Retorno inserir(Produto produto) {
		Retorno retorno = new Retorno();
		String insertProduto = "INSERT INTO produtos (categoria, modelo, capacidade, valor, marcas_id) VALUES (?, ?, ?, ?, ?)";
		String findMarca = "SELECT id FROM marcas WHERE id = ? LIMIT 1";
		
		PreparedStatement p;
		
		try {
			// Verificar se a marca existe
			p = this.conexao.prepareStatement(findMarca);	
			p.setInt(1, produto.getMarcaId());
			ResultSet rs = p.executeQuery();
			
			if (rs.next() == true) {
				// Cadastrar produto
				p = this.conexao.prepareStatement(insertProduto);
				
				p.setInt(1, produto.getCategoria());
				p.setString(2, produto.getModelo());
				p.setInt(3, produto.getCapacidade());
				p.setFloat(4, produto.getValor());
				p.setInt(5, produto.getMarcaId());
				
				p.execute();
				
				retorno.setStatus("sucesso");
				retorno.setMessage("Produto cadastrado com sucesso!");
			}
			
			else {
				// Retornar mensagem de erro:
				retorno.setStatus("erro");
				retorno.setMessage("Marca informa não existe! Por favor, atualize a página.");
			}
		} catch(SQLException e) {
			retorno.setStatus("erro");
			retorno.setMessage("Ocorreu um erro ao tentar cadastrar o produto! \n Erro: \n" + e.getMessage());
		}
		
		return retorno;
	}

	public Retorno alterar(Produto produto) {
		Retorno retorno = new Retorno();
		String comando = "UPDATE produtos SET categoria=?, modelo=?, capacidade=?, valor=?, marcas_id=? WHERE id=?";
		String findMarca = "SELECT id FROM marcas WHERE id=? LIMIT 1";
		PreparedStatement p;
		
		try {
			p = this.conexao.prepareStatement(findMarca);
			
			p.setInt(1, produto.getMarcaId());
			ResultSet rs = p.executeQuery();
			
			if (rs.next() == true) {
				p = this.conexao.prepareStatement(comando);
				p.setInt(1, produto.getCategoria());
				p.setString(2, produto.getModelo());
				p.setInt(3, produto.getCapacidade());
				p.setFloat(4, produto.getValor());
				p.setInt(5, produto.getMarcaId());
				p.setInt(6, produto.getId());
				p.executeUpdate();

				retorno.setStatus("sucesso");
				retorno.setMessage("Produto alterado com sucesso!");
			}
			else {
				retorno.setStatus("erro");
				retorno.setMessage("Marca informada não existe!");
			}
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