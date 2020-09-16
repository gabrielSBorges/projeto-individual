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
import br.com.cherry.jdbc.JDBCUsuarioDAO;
import br.com.cherry.modelo.Usuario;
import br.com.cherry.modelo.Retorno;


@Path("usuario")
public class UsuarioRest extends UtilRest {
	@GET
	@Path("/buscarPorId")
	@Consumes("application/*")
	@Produces(MediaType.APPLICATION_JSON)
	public Response buscarPorId(@QueryParam("id") int id) {
		try {
			Conexao conec = new Conexao();
			Connection conexao = conec.abrirConexao();
			
			JDBCUsuarioDAO jdbcUsuario = new JDBCUsuarioDAO(conexao);
			Retorno retorno = jdbcUsuario.buscarPorId(id);
			
			conec.fecharConexao();
			
			if (retorno.getStatus() == "sucesso") {				
				return this.buildResponse(retorno.getUsuario());
			}
			else {
				return this.buildErrorResponse(retorno.getMessage());				
			}			
		} catch (Exception e) {
			e.printStackTrace();
			
			return this.buildErrorResponse("Ocorreu um erro ao tentar buscar o usuario! \n Erro: \n" + e.getMessage());
		}
	}
	
	@GET
	@Path("/buscar")
	@Consumes("application/*")
	@Produces(MediaType.APPLICATION_JSON)
	public Response buscaPorNome(@QueryParam("nome") String nome) {
		try {
			Conexao con = new Conexao();
			Connection conexao = con.abrirConexao();
			
			JDBCUsuarioDAO jdbcUsuario = new JDBCUsuarioDAO(conexao);
			Retorno retorno = jdbcUsuario.buscarPorNome(nome);
			
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
			
			return this.buildErrorResponse("Ocorreu um erro ao tentar listar os usuarios! \n Erro: \n" + e.getMessage());
		}
	}
	
	@POST
	@Path("/inserir")
	@Consumes("application/*")
	public Response inserir(String usuarioParam) {
		try {
			Usuario usuario = new Gson().fromJson(usuarioParam, Usuario.class);
			
			Conexao con = new Conexao();
			Connection conexao = con.abrirConexao();
			
			JDBCUsuarioDAO jdbcUsuario = new JDBCUsuarioDAO(conexao);
			Retorno retorno = jdbcUsuario.inserir(usuario);
			
			con.fecharConexao();
	
			if (retorno.getStatus() == "sucesso") {				
				return this.buildResponse(retorno.getMessage());
			}
			else {
				return this.buildErrorResponse(retorno.getMessage());
			}
		} catch (Exception e) {
			e.printStackTrace();
			
			return this.buildErrorResponse("Ocorreu um erro ao tentar cadastrar o usuario! \n Erro: \n" + e.getMessage());
		}
	}
	
	@PUT
	@Path("/alterar")
	@Consumes("application/*")
	public Response alterar(String usuarioParam) {
		try {	
			Usuario usuario = new Gson().fromJson(usuarioParam, Usuario.class);
			
			Conexao conec = new Conexao();
			Connection conexao = conec.abrirConexao();
			
			JDBCUsuarioDAO jdbcUsuario = new JDBCUsuarioDAO(conexao);
			Retorno retorno = jdbcUsuario.alterar(usuario);
			
			conec.fecharConexao();
			
			if (retorno.getStatus() == "sucesso") {				
				return this.buildResponse(retorno.getMessage());
			}
			else {
				return this.buildErrorResponse(retorno.getMessage());				
			}
		} catch (Exception e) {
			e.printStackTrace();
			
			return this.buildErrorResponse("Ocorreu um erro ao tentar alterar o usuario! \n Erro: \n" + e.getMessage());
		}
	}
	
	@PUT
	@Path("/alterar-senha")
	@Consumes("application/*")
	public Response alterarSenha(String usuarioParam) {
		try {	
			Usuario usuario = new Gson().fromJson(usuarioParam, Usuario.class);
			
			Conexao conec = new Conexao();
			Connection conexao = conec.abrirConexao();
			
			JDBCUsuarioDAO jdbcUsuario = new JDBCUsuarioDAO(conexao);
			Retorno retorno = jdbcUsuario.alterarSenha(usuario);
			
			conec.fecharConexao();
			
			if (retorno.getStatus() == "sucesso") {				
				return this.buildResponse(retorno.getMessage());
			}
			else {
				return this.buildErrorResponse(retorno.getMessage());				
			}
		} catch (Exception e) {
			e.printStackTrace();
			
			return this.buildErrorResponse("Ocorreu um erro ao tentar alterar a senha do usuario! \n Erro: \n" + e.getMessage());
		}
	}

	@DELETE
	@Path("/excluir/{id}")
	@Consumes("application/*")
	public Response excluir(@PathParam("id") int id) {
		try {
			Conexao conec = new Conexao();
			Connection conexao = conec.abrirConexao();
			
			JDBCUsuarioDAO jdbcUsuario = new JDBCUsuarioDAO(conexao);
			Retorno retorno = jdbcUsuario.deletar(id);
	
			conec.fecharConexao();
			
			if (retorno.getStatus() == "sucesso") {
				return this.buildResponse(retorno.getMessage());				
			}
			else {
				return this.buildErrorResponse(retorno.getMessage());				
			}
		} catch (Exception e) {
			e.printStackTrace();
			
			return this.buildErrorResponse("Ocorreu um erro ao tentar remover o usuario! \n Erro: \n" + e.getMessage());
		}
	}
}