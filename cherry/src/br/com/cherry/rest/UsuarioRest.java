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
import br.com.cherry.jdbc.JDBCUsuarioDAO;
import br.com.cherry.modelo.Usuario;
import br.com.cherry.modelo.Message;
import br.com.cherry.modelo.Retorno;


@Path("usuario")
public class UsuarioRest extends UtilRest {
	Message message = new Message();
	
	@GET
	@Path("/buscarPorId")
	@Consumes("application/*")
	@Produces(MediaType.APPLICATION_JSON)
	public Response buscarPorId(@QueryParam("id") int id, @HeaderParam("Authorization") String token) {
		try {
			MySql my_sql = new MySql();
			Connection conexao = my_sql.abrirConexao();
			
			JDBCUsuarioDAO jdbcUsuario = new JDBCUsuarioDAO(conexao);
			Retorno retorno = jdbcUsuario.buscarPorId(id, token);
			
			my_sql.fecharConexao();
			
			if (retorno.getStatus() == 200) {				
				return this.buildResponse(retorno.getUsuario(), 200);
			}
			else {
				return this.buildResponse(retorno.getMessage(), retorno.getStatus());				
			}			
		} catch (Exception e) {
			e.printStackTrace();
			
			message.setMessage("Ocorreu um erro ao tentar buscar o usuario!");
			
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
			
			JDBCUsuarioDAO jdbcUsuario = new JDBCUsuarioDAO(conexao);
			Retorno retorno = jdbcUsuario.buscarPorNome(nome, token);
			
			my_sql.fecharConexao();
			
			if (retorno.getStatus() == 200) {
				return this.buildResponse(retorno.getListUsuarios(), retorno.getStatus());
			}
			else {
				return this.buildResponse(retorno.getMessage(), retorno.getStatus());
			}
		} catch (Exception e) {
			e.printStackTrace();
			
			message.setMessage("Ocorreu um erro ao tentar listar os usuarios!");
			
			return this.buildResponse(message, 500);
		}
	}
	
	@POST
	@Path("/inserir")
	@Consumes("application/*")
	@Produces(MediaType.APPLICATION_JSON)
	public Response inserir(String usuarioParam, @HeaderParam("Authorization") String token) {
		try {
			Usuario usuario = new Gson().fromJson(usuarioParam, Usuario.class);
			
			MySql my_sql = new MySql();
			Connection conexao = my_sql.abrirConexao();
			
			JDBCUsuarioDAO jdbcUsuario = new JDBCUsuarioDAO(conexao);
			Retorno retorno = jdbcUsuario.inserir(usuario, token);
			
			my_sql.fecharConexao();
	
			if (retorno.getStatus() == 200) {				
				return this.buildResponse(retorno.getMessage(), retorno.getStatus());
			}
			else {
				return this.buildResponse(retorno.getMessage(), retorno.getStatus());
			}
		} catch (Exception e) {
			e.printStackTrace();
			
			message.setMessage("Ocorreu um erro ao tentar cadastrar o usuario!");
			
			return this.buildResponse(message, 500);
		}
	}
	
	@PUT
	@Path("/alterar")
	@Consumes("application/*")
	public Response alterar(String usuarioParam, @HeaderParam("Authorization") String token) {
		try {	
			Usuario usuario = new Gson().fromJson(usuarioParam, Usuario.class);
			
			MySql my_sql = new MySql();
			Connection conexao = my_sql.abrirConexao();
			
			JDBCUsuarioDAO jdbcUsuario = new JDBCUsuarioDAO(conexao);
			Retorno retorno = jdbcUsuario.alterar(usuario, token);
			
			my_sql.fecharConexao();
			
			if (retorno.getStatus() == 200) {				
				return this.buildResponse(retorno.getMessage(), retorno.getStatus());
			}
			else {
				return this.buildResponse(retorno.getMessage(), retorno.getStatus());				
			}
		} catch (Exception e) {
			e.printStackTrace();
			
			message.setMessage("Ocorreu um erro ao tentar alterar os dados do usuario!");
			
			return this.buildResponse(message, 500);
		}
	}
	
	@PUT
	@Path("/alterar-senha")
	@Consumes("application/*")
	public Response alterarSenha(String usuarioParam, @HeaderParam("Authorization") String token) {
		try {	
			Usuario usuario = new Gson().fromJson(usuarioParam, Usuario.class);
			
			MySql my_sql = new MySql();
			Connection conexao = my_sql.abrirConexao();
			
			JDBCUsuarioDAO jdbcUsuario = new JDBCUsuarioDAO(conexao);
			Retorno retorno = jdbcUsuario.alterarSenha(usuario, token);
			
			my_sql.fecharConexao();
			
			if (retorno.getStatus() == 200) {				
				return this.buildResponse(retorno.getMessage(), retorno.getStatus());
			}
			else {
				return this.buildResponse(retorno.getMessage(), retorno.getStatus());				
			}
		} catch (Exception e) {
			e.printStackTrace();
			
			message.setMessage("Ocorreu um erro ao tentar alterar a senha do usuario!");
			
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
			
			JDBCUsuarioDAO jdbcUsuario = new JDBCUsuarioDAO(conexao);
			Retorno retorno = jdbcUsuario.deletar(id, token);
	
			my_sql.fecharConexao();
			
			if (retorno.getStatus() == 200) {
				return this.buildResponse(retorno.getMessage(), retorno.getStatus());				
			}
			else {
				return this.buildResponse(retorno.getMessage(), retorno.getStatus());				
			}
		} catch (Exception e) {
			e.printStackTrace();
			
			message.setMessage("Ocorreu um erro ao tentar remover o usuario!");
			
			return this.buildResponse(message, 500);
		}
	}
}