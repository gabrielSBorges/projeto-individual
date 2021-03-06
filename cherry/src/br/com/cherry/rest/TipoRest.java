package br.com.cherry.rest;

import java.sql.Connection;

import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.HeaderParam;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import br.com.cherry.db.MySql;
import br.com.cherry.jdbc.JDBCTipoDAO;
import br.com.cherry.modelo.Message;
import br.com.cherry.modelo.Retorno;

@Path("tipo")
public class TipoRest extends UtilRest {
	Message message = new Message();
	
	@GET
	@Path("/buscar")
	@Consumes("application/*")
	@Produces(MediaType.APPLICATION_JSON)
	public Response buscaPorNome(@QueryParam("nome") String nome, @HeaderParam("Authorization") String token) {
		try {
			MySql my_sql = new MySql();
			Connection conexao = my_sql.abrirConexao();
			
			JDBCTipoDAO jdbcTipo = new JDBCTipoDAO(conexao);
			Retorno retorno = jdbcTipo.buscarPorNome(nome, token);
			
			my_sql.fecharConexao();
			
			if (retorno.getStatus() == 200) {
				return this.buildResponse(retorno.getListTipos(), retorno.getStatus());
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
