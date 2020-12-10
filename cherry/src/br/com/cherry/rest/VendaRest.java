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
import br.com.cherry.modelo.Message;
import br.com.cherry.modelo.Retorno;
import br.com.cherry.modelo.Venda;

@Path("venda")
public class VendaRest extends UtilRest {
	Message message = new Message();
	
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
				return this.buildResponse(retorno.getVenda(), retorno.getStatus());
			}
			else {
				return this.buildResponse(retorno.getMessage(), retorno.getStatus());				
			}			
		} catch (Exception e) {
			e.printStackTrace();
			
			message.setMessage("Ocorreu um erro ao tentar buscar a venda!");
			
			return this.buildResponse(message, 500);
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
				return this.buildResponse(retorno.getListVendas(), retorno.getStatus());
			}
			else {
				return this.buildResponse(retorno.getMessage(), retorno.getStatus());
			}
		} catch (Exception e) {
			e.printStackTrace();
			
			message.setMessage("Ocorreu um erro ao tentar listar as vendas!");
			
			return this.buildResponse(message, 500);
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
				return this.buildResponse(retorno.getMessage(), retorno.getStatus());
			}
			else {
				return this.buildResponse(retorno.getMessage(), retorno.getStatus());
			}
		} catch (Exception e) {
			e.printStackTrace();
			
			message.setMessage("Ocorreu um erro ao tentar cadastrar a venda!");
			
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
			
			JDBCVendaDAO jdbcVenda = new JDBCVendaDAO(conexao);
			Retorno retorno = jdbcVenda.deletar(id, token);
	
			my_sql.fecharConexao();
			
			if (retorno.getStatus() == 200) {
				return this.buildResponse(retorno.getMessage(), retorno.getStatus());				
			}
			else {
				return this.buildResponse(retorno.getMessage(), retorno.getStatus());				
			}
		} catch (Exception e) {
			e.printStackTrace();
			
			message.setMessage("Ocorreu um erro ao tentar excluir a venda!");
			
			return this.buildResponse(message, 500);
		}
	}
}
