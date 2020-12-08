package br.com.cherry.rest;

import java.sql.Connection;

import javax.ws.rs.GET;
import javax.ws.rs.HeaderParam;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import br.com.cherry.db.MySql;
import br.com.cherry.jdbc.JDBCRelatorioDAO;
import br.com.cherry.modelo.Retorno;

@Path("relatorio")
public class RelatorioRest extends UtilRest {
	@GET
	@Path("/produtos-vendidos")
	@Produces(MediaType.APPLICATION_JSON)
	public Response produtosMaisVendidos(@QueryParam("dt_inicio") String dt_inicio, @QueryParam("dt_fim") String dt_fim, @HeaderParam("Authorization") String token) {
		try {
			MySql my_sql = new MySql();
			Connection conexao = my_sql.abrirConexao();
			
			JDBCRelatorioDAO jdbcRelatorio = new JDBCRelatorioDAO(conexao);
			Retorno retorno = jdbcRelatorio.produtosMaisVendidos(dt_inicio, dt_fim, token);
			
			my_sql.fecharConexao();
			
			if (retorno.getStatus() == 200) {				
				return this.buildResponse(retorno.getListProdutosMaisVendidos());
			}
			else {
				return this.buildErrorResponse(retorno.getMessage(), retorno.getStatus());				
			}			
		} catch (Exception e) {
			e.printStackTrace();
			
			return this.buildErrorResponse("Ocorreu um erro ao tentar buscar o usuario! \n Erro: \n" + e.getMessage(), 500);
		}
	}
	
	@GET
	@Path("/lucro-diario")
	@Produces(MediaType.APPLICATION_JSON)
	public Response lucroDiario(@QueryParam("dt_inicio") String dt_inicio, @QueryParam("dt_fim") String dt_fim, @HeaderParam("Authorization") String token) {
		try {
			MySql my_sql = new MySql();
			Connection conexao = my_sql.abrirConexao();
			
			JDBCRelatorioDAO jdbcRelatorio = new JDBCRelatorioDAO(conexao);
			Retorno retorno = jdbcRelatorio.lucroDiario(dt_inicio, dt_fim, token);
			
			my_sql.fecharConexao();
			
			if (retorno.getStatus() == 200) {				
				return this.buildResponse(retorno.getListLucrosDiarios());
			}
			else {
				return this.buildErrorResponse(retorno.getMessage(), retorno.getStatus());				
			}			
		} catch (Exception e) {
			e.printStackTrace();
			
			return this.buildErrorResponse("Ocorreu um erro ao tentar buscar o usuario! \n Erro: \n" + e.getMessage(), 500);
		}
	}
}
