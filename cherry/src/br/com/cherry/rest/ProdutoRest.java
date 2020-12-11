package br.com.cherry.rest;

import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.HeaderParam;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import com.google.gson.Gson;

import java.sql.Connection;

import br.com.cherry.db.MySql;
import br.com.cherry.jdbc.JDBCProdutoDAO;
import br.com.cherry.modelo.Message;
import br.com.cherry.modelo.Produto;
import br.com.cherry.modelo.Retorno;


@Path("produto")
public class ProdutoRest extends UtilRest {
	Message message = new Message();
	
	@GET
	@Path("/buscarPorId")
	@Produces(MediaType.APPLICATION_JSON)
	public Response buscarPorId(@QueryParam("id") int id, @HeaderParam("Authorization") String token) {
		try {
			MySql my_sql = new MySql();
			Connection conexao = my_sql.abrirConexao();
			
			JDBCProdutoDAO jdbcProduto = new JDBCProdutoDAO(conexao);
			Retorno retorno = jdbcProduto.buscarPorId(id, token);
			
			my_sql.fecharConexao();
			
			if (retorno.getStatus() == 200) {				
				return this.buildResponse(retorno.getProduto(), retorno.getStatus());
			}
			else {
				return this.buildResponse(retorno.getMessage(), retorno.getStatus());				
			}			
		} catch (Exception e) {
			e.printStackTrace();
			
			message.setMessage(this.errorMsg);
			
			return this.buildResponse(message, 500);
		}
	}
	
	@GET
	@Path("/buscar")
	@Consumes("application/*")
	@Produces(MediaType.APPLICATION_JSON)
	public Response buscaPorNome(@QueryParam("nome") String nome, @HeaderParam("Authorization") String token) {
		try {
			MySql my_sql = new MySql();
			Connection conexao = my_sql.abrirConexao();
			
			JDBCProdutoDAO jdbcProduto = new JDBCProdutoDAO(conexao);
			Retorno retorno = jdbcProduto.buscarPorNome(nome, token);
			
			my_sql.fecharConexao();
			
			if (retorno.getStatus() == 200) {
				String json = new Gson().toJson(retorno.getListJson());
				return this.buildResponse(json, retorno.getStatus());
			}
			else {
				return this.buildResponse(retorno.getMessage(), retorno.getStatus());
			}
		} catch (Exception e) {
			e.printStackTrace();
			
			message.setMessage(this.errorMsg);
			
			return this.buildResponse(message, 500);
		}
	}
	
	@POST
	@Path("/inserir")
	@Consumes("application/*")
	public Response inserir(String produtoParam, @HeaderParam("Authorization") String token) {
		try {
			Produto produto = new Gson().fromJson(produtoParam, Produto.class);
			
			MySql my_sql = new MySql();
			Connection conexao = my_sql.abrirConexao();
			
			JDBCProdutoDAO jdbcProduto = new JDBCProdutoDAO(conexao);
			Retorno retorno = jdbcProduto.inserir(produto, token);
			
			my_sql.fecharConexao();
	
			if (retorno.getStatus() == 200) {				
				return this.buildResponse(retorno.getMessage(), retorno.getStatus());
			}
			else {
				return this.buildResponse(retorno.getMessage(), retorno.getStatus());
			}
		} catch (Exception e) {
			e.printStackTrace();
			
			message.setMessage(this.errorMsg);
			
			return this.buildResponse(message, 500);
		}
	}
	
	@PUT
	@Path("/alterar")
	@Consumes("application/*")
	public Response alterar(String produtoParam, @HeaderParam("Authorization") String token) {
		try {	
			Produto produto = new Gson().fromJson(produtoParam, Produto.class);
			
			MySql my_sql = new MySql();
			Connection conexao = my_sql.abrirConexao();
			
			JDBCProdutoDAO jdbcProduto = new JDBCProdutoDAO(conexao);
			Retorno retorno = jdbcProduto.alterar(produto, token);
			
			my_sql.fecharConexao();
			
			if (retorno.getStatus() == 200) {				
				return this.buildResponse(retorno.getMessage(), retorno.getStatus());
			}
			else {
				return this.buildResponse(retorno.getMessage(), retorno.getStatus());				
			}
		} catch (Exception e) {
			e.printStackTrace();
			
			message.setMessage(this.errorMsg);
			
			return this.buildResponse(message, 500);
		}
	}

	@DELETE
	@Path("/excluir/{id}")
	@Consumes("application/*")
	public Response excluir(@PathParam("id") int id, @HeaderParam("Authorization") String token) {
		try {
			MySql my_sql = new MySql();
			Connection conexao = my_sql.abrirConexao();
			
			JDBCProdutoDAO jdbcProduto = new JDBCProdutoDAO(conexao);
			Retorno retorno = jdbcProduto.deletar(id, token);
	
			my_sql.fecharConexao();
			
			if (retorno.getStatus() == 200) {
				return this.buildResponse(retorno.getMessage(), retorno.getStatus());				
			}
			else {
				return this.buildResponse(retorno.getMessage(), retorno.getStatus());				
			}
		} catch (Exception e) {
			e.printStackTrace();
			
			message.setMessage(this.errorMsg);
			
			return this.buildResponse(message, 500);
		}
	}
}