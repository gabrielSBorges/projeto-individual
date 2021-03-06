package br.com.cherry.db;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

public class MySql {
	private Connection conexao;
	
	// Conex�o
	@SuppressWarnings("deprecation")
	public Connection abrirConexao() {
		String basepath = "localhost";
		String database = "db_cherry";
		String username = "root";
		String password = "";
		
		try {
			Class.forName("com.mysql.cj.jdbc.Driver").newInstance();
			conexao = java.sql.DriverManager.getConnection("jdbc:mysql://" + basepath + "/" + database + "?user=" + username + "&password=" + password + "&useTimezone=true&serverTimezone=UTC");
		} catch(Exception e) {
			e.printStackTrace();
		}
		
		return conexao;
	}
	
	public void fecharConexao() {
		try {
			conexao.close();
		} catch(Exception e) {
			e.printStackTrace();
		}
	}
}
