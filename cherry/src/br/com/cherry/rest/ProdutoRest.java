package br.com.cherry.rest;

import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
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

import br.com.cherry.db.Conexao;
import br.com.cherry.jdbc.JDBCProdutoDAO;
import br.com.cherry.modelo.Produto;
import br.com.cherry.modelo.Retorno;

@Path("produto")
public class ProdutoRest extends UtilRest {
	@GET
	@Path("/buscarPorId")
	@Consumes("application/*")
	@Produces(MediaType.APPLICATION_JSON)
	public Response buscarPorId(@QueryParam("id") int id) {
		try {
			Conexao conec = new Conexao();
			Connection conexao = conec.abrirConexao();
			
			JDBCProdutoDAO jdbcProduto = new JDBCProdutoDAO(conexao);
			Retorno retorno = jdbcProduto.buscarPorId(id);
			
			conec.fecharConexao();
			
			if (retorno.getStatus() == "sucesso") {				
				return this.buildResponse(retorno.getProduto());
			}
			else {
				return this.buildErrorResponse(retorno.getMessage());				
			}			
		} catch (Exception e) {
			e.printStackTrace();
			
			return this.buildErrorResponse("Ocorreu um erro ao tentar buscar o produto! \n Erro: \n" + e.getMessage());
		}
	}
	
	@GET
	@Path("/buscar")
	@Consumes("application/*")
	@Produces(MediaType.APPLICATION_JSON)
	public Response buscaPorNome(@QueryParam("valorBusca") String nome) {
		try {
			Conexao con = new Conexao();
			Connection conexao = con.abrirConexao();
			
			JDBCProdutoDAO jdbcProduto = new JDBCProdutoDAO(conexao);
			Retorno retorno = jdbcProduto.buscarPorNome(nome);
			
			con.fecharConexao();
			
			if (retorno.getStatus() == "sucesso") {
				String json = new Gson().toJson(retorno.getListJson());
				return this.buildResponse(json);
			}
			else {
				return this.buildErrorResponse(retorno.getMessage());
			}
		} catch (Exception e) {
			e.printStackTrace();
			
			return this.buildErrorResponse("Ocorreu um erro ao tentar listar os produtos! \n Erro: \n" + e.getMessage());
		}
	}
	
	@POST
	@Path("/inserir")
	@Consumes("application/*")
	public Response inserir(String produtoParam) {
		try {
			System.out.println("Testeeeee --------------------------------------------------------------------------------------------------");
			
			Produto produto = new Gson().fromJson(produtoParam, Produto.class);
			
			Conexao con = new Conexao();
			Connection conexao = con.abrirConexao();
			
			JDBCProdutoDAO jdbcProduto = new JDBCProdutoDAO(conexao);
			Retorno retorno = jdbcProduto.inserir(produto);
			
			con.fecharConexao();
	
			if (retorno.getStatus() == "sucesso") {				
				return this.buildResponse(retorno.getMessage());
			}
			else {
				return this.buildErrorResponse(retorno.getMessage());
			}
		} catch (Exception e) {
			e.printStackTrace();
			
			return this.buildErrorResponse("Ocorreu um erro ao tentar cadastrar o produto! \n Erro: \n" + e.getMessage());
		}
	}
	
	@PUT
	@Path("/alterar")
	@Consumes("application/*")
	public Response alterar(String produtoParam) {
		try {	
			Produto produto = new Gson().fromJson(produtoParam, Produto.class);
			
			Conexao conec = new Conexao();
			Connection conexao = conec.abrirConexao();
			
			JDBCProdutoDAO jdbcProduto = new JDBCProdutoDAO(conexao);
			Retorno retorno = jdbcProduto.alterar(produto);
			
			conec.fecharConexao();
			
			if (retorno.getStatus() == "sucesso") {				
				return this.buildResponse(retorno.getMessage());
			}
			else {
				return this.buildErrorResponse(retorno.getMessage());				
			}
		} catch (Exception e) {
			e.printStackTrace();
			
			return this.buildErrorResponse("Ocorreu um erro ao tentar alterar o produto! \n Erro: \n" + e.getMessage());
		}
	}

	@DELETE
	@Path("/excluir/{id}")
	@Consumes("application/*")
	public Response excluir(@PathParam("id") int id) {
		try {
			Conexao conec = new Conexao();
			Connection conexao = conec.abrirConexao();
			
			JDBCProdutoDAO jdbcProduto = new JDBCProdutoDAO(conexao);
			Retorno retorno = jdbcProduto.deletar(id);
	
			conec.fecharConexao();
			
			if (retorno.getStatus() == "sucesso") {
				return this.buildResponse(retorno.getMessage());				
			}
			else {
				return this.buildErrorResponse(retorno.getMessage());				
			}
		} catch (Exception e) {
			e.printStackTrace();
			
			return this.buildErrorResponse("Ocorreu um erro ao tentar remover o produto! \n Erro: \n" + e.getMessage());
		}
	}
}