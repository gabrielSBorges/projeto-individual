package br.com.cherry.rest;

import java.sql.Connection;

import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.HeaderParam;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import com.google.gson.Gson;

import br.com.cherry.db.MySql;
import br.com.cherry.jdbc.JDBCVendaDAO;
import br.com.cherry.modelo.Retorno;
import br.com.cherry.modelo.Venda;

@Path("venda")
public class VendaRest extends UtilRest {
	@GET
	@Path("/buscarPorId")
	@Produces(MediaType.APPLICATION_JSON)
	public Response buscarPorId(@QueryParam("id") int id, @HeaderParam("Authorization") String token) {
		try {
			MySql my_sql = new MySql();
			Connection conexao = my_sql.abrirConexao();
			
			JDBCVendaDAO jdbcVenda = new JDBCVendaDAO(conexao);
			Retorno retorno = jdbcVenda.buscarPorId(id, token);
			
			my_sql.fecharConexao();
			
			if (retorno.getStatus() == 200) {				
				return this.buildResponse(retorno.getVenda());
			}
			else {
				return this.buildErrorResponse(retorno.getMessage(), retorno.getStatus());				
			}			
		} catch (Exception e) {
			e.printStackTrace();
			
			return this.buildErrorResponse("Ocorreu um erro ao tentar buscar a venda! \n Erro: \n" + e.getMessage(), 500);
		}
	}
	
	@GET
	@Path("/listar")
	@Produces(MediaType.APPLICATION_JSON)
	public Response listar(@QueryParam("dt_realizado") String dt_realizado, @QueryParam("usuario_id") int usuario_id, @HeaderParam("Authorization") String token) {
		try {
			MySql my_sql = new MySql();
			Connection conexao = my_sql.abrirConexao();
			
			JDBCVendaDAO jdbcVenda = new JDBCVendaDAO(conexao);
			Retorno retorno = jdbcVenda.listar(dt_realizado, usuario_id, token);
			
			my_sql.fecharConexao();
			
			if (retorno.getStatus() == 200) {
				return this.buildResponse(retorno.getListVendas());
			}
			else {
				return this.buildErrorResponse(retorno.getMessage(), retorno.getStatus());
			}
		} catch (Exception e) {
			e.printStackTrace();
			
			return this.buildErrorResponse("Ocorreu um erro ao tentar listar as vendas! \n Erro: \n" + e.getMessage(), 500);
		}
	}
	
	@POST
	@Path("/inserir")
	@Consumes("application/*")
	public Response inserir(String vendaParam, @HeaderParam("Authorization") String token) {
		try {
			Venda venda = new Gson().fromJson(vendaParam, Venda.class);
			
			MySql my_sql = new MySql();
			Connection conexao = my_sql.abrirConexao();
			
			JDBCVendaDAO jdbcVenda = new JDBCVendaDAO(conexao);
			Retorno retorno = jdbcVenda.inserir(venda, token);
			
			my_sql.fecharConexao();
	
			if (retorno.getStatus() == 200) {				
				return this.buildResponse(retorno.getMessage());
			}
			else {
				return this.buildErrorResponse(retorno.getMessage(), retorno.getStatus());
			}
		} catch (Exception e) {
			e.printStackTrace();
			
			return this.buildErrorResponse("Ocorreu um erro ao tentar cadastrar a venda! \n Erro: \n" + e.getMessage(), 500);
		}
	}
	
	@DELETE
	@Path("/excluir/{id}")
	@Consumes("application/*")
	public Response excluir(@PathParam("id") int id, @HeaderParam("Authorization") String token) {
		try {
			MySql my_sql = new MySql();
			Connection conexao = my_sql.abrirConexao();
			
			JDBCVendaDAO jdbcVenda = new JDBCVendaDAO(conexao);
			Retorno retorno = jdbcVenda.deletar(id, token);
	
			my_sql.fecharConexao();
			
			if (retorno.getStatus() == 200) {
				return this.buildResponse(retorno.getMessage());				
			}
			else {
				return this.buildErrorResponse(retorno.getMessage(), retorno.getStatus());				
			}
		} catch (Exception e) {
			e.printStackTrace();
			
			return this.buildErrorResponse("Ocorreu um erro ao tentar excluir a venda! \n Erro: \n" + e.getMessage(), 500);
		}
	}
}
