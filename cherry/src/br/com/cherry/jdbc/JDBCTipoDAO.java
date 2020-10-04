package br.com.cherry.jdbc;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;

import br.com.cherry.modelo.Retorno;
import br.com.cherry.modelo.Tipo;

public class JDBCTipoDAO {
	private Connection conexao;
	
	public JDBCTipoDAO(Connection conexao) {
		this.conexao = conexao;
	}
	
	public Retorno buscarPorNome(String nomeTipo) {
		Retorno retorno = new Retorno();
		String comando = "SELECT * from tipos WHERE id <> 1 ";
		
		if (!nomeTipo.contentEquals("")) {
			comando += "AND nome LIKE '%" + nomeTipo + "%' ";
		}
		
		comando += "ORDER BY nome ASC";
		
		List<Tipo> listaTipos = new ArrayList<Tipo>();
		
		try {
			Statement stmt = conexao.createStatement();
			ResultSet rs = stmt.executeQuery(comando);
			
			while (rs.next()) {
				int id = rs.getInt("id");
				String nome = rs.getString("nome");
				
				
				Tipo tipo = new Tipo();
				tipo.setId(id);
				tipo.setNome(nome);
				
				listaTipos.add(tipo);
			}
			
			retorno.setStatus("sucesso");
			retorno.setListTipos(listaTipos);
		} catch(Exception e) {
			e.printStackTrace();
			
			retorno.setStatus("erro");
			retorno.setMessage("Ocorreu um erro ao tentar listar os usuarios! \n Erro: \n" + e.getMessage());
		}
		
		return retorno;
	}
}
