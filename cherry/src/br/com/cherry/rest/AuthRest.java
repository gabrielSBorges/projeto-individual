package br.com.cherry.rest;

import java.sql.Connection;

import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.HeaderParam;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import com.google.gson.Gson;

import br.com.cherry.db.MySql;
import br.com.cherry.jdbc.JDBCAuthDAO;
import br.com.cherry.modelo.Message;
import br.com.cherry.modelo.Retorno;
import br.com.cherry.modelo.Usuario;

@Path("auth")
public class AuthRest extends UtilRest {
	Message message = new Message();
	
	@GET
	@Path("/me")
	@Produces(MediaType.APPLICATION_JSON)
	public Response getMe(@HeaderParam("Authorization") String token) {
		try {
			MySql my_sql = new MySql();
			Connection conexao = my_sql.abrirConexao();
			
			JDBCAuthDAO jdbcAuth = new JDBCAuthDAO(conexao);
			Retorno retorno = jdbcAuth.getMe(token);
			
			my_sql.fecharConexao();
			
			if (retorno.getStatus() == 200) {				
				return this.buildResponse(retorno.getUsuario(), retorno.getStatus());
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
	@Path("/login")
	@Consumes("application/*")
	@Produces(MediaType.APPLICATION_JSON)
	public Response login(String usuarioParam) {
		try {
			Usuario usuario = new Gson().fromJson(usuarioParam, Usuario.class);
			
			MySql my_sql = new MySql();
			Connection conexao = my_sql.abrirConexao();
			
			JDBCAuthDAO jdbcAuth = new JDBCAuthDAO(conexao);
			Retorno retorno = jdbcAuth.login(usuario);
						
			my_sql.fecharConexao();
	
			if (retorno.getStatus() == 200) {				
				return this.buildResponse(retorno.getAuth(), retorno.getStatus());
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
	@Path("/recuperar-senha")
	@Consumes("application/*")
	@Produces(MediaType.APPLICATION_JSON)
	public Response recuperarSenha(String usuarioParam) {
		try {
			Usuario usuario = new Gson().fromJson(usuarioParam, Usuario.class);
			
			MySql my_sql = new MySql();
			Connection conexao = my_sql.abrirConexao();
			
			JDBCAuthDAO jdbcAuth = new JDBCAuthDAO(conexao);
			Retorno retorno = jdbcAuth.recuperarSenha(usuario);
						
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
	
	@POST
	@Path("/resetar-senha")
	@Consumes("application/*")
	@Produces(MediaType.APPLICATION_JSON)
	public Response resetarSenha(String usuarioParam, @QueryParam("code") String token_id) {
		try {
			Usuario usuario = new Gson().fromJson(usuarioParam, Usuario.class);
			
			MySql my_sql = new MySql();
			Connection conexao = my_sql.abrirConexao();
			
			JDBCAuthDAO jdbcAuth = new JDBCAuthDAO(conexao);
			Retorno retorno = jdbcAuth.resetarSenha(usuario, token_id);
						
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
	@Path("/logout")
	@Produces(MediaType.APPLICATION_JSON)
	public Response logout(@HeaderParam("Authorization") String token) {
		try {
			MySql my_sql = new MySql();
			Connection conexao = my_sql.abrirConexao();
			
			JDBCAuthDAO jdbcAuth = new JDBCAuthDAO(conexao);
			Retorno retorno = jdbcAuth.logout(token);
			
			my_sql.fecharConexao();
			
			return this.buildResponse(retorno.getMessage(), retorno.getStatus());		
		} catch (Exception e) {
			e.printStackTrace();
			
			message.setMessage(this.errorMsg);
			
			return this.buildResponse(message, 500);
		}
	}
}
