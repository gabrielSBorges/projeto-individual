package br.com.cherry.jdbc;

import java.security.NoSuchAlgorithmException;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;

import br.com.cherry.modelo.Usuario;
import br.com.cherry.auth.Base64Code;
import br.com.cherry.auth.JWTCode;
import br.com.cherry.auth.MD5Code;
import br.com.cherry.modelo.Retorno;

public class JDBCUsuarioDAO {
	private Connection conexao;
	JWTCode jwtCode = new JWTCode();
	MD5Code md5Code = new MD5Code();
	Base64Code base64 = new Base64Code();
	
	public JDBCUsuarioDAO(Connection conexao) {
		this.conexao = conexao;
	}

	public Retorno buscarPorId(int usuId, String tokenBase64) {
		Retorno retorno = new Retorno();
		String comando = "SELECT u.*, t.nome as tipo FROM usuarios u INNER JOIN tipos t ON u.tipo_id = t.id WHERE u.id = ?";
		Usuario usuario = new Usuario();
		
		try {
			if (jwtCode.valid(tokenBase64, this.conexao, true)) {
				PreparedStatement p = this.conexao.prepareStatement(comando);
				p.setInt(1, usuId);
				ResultSet rs = p.executeQuery();
				
				while (rs.next()) {
					int id = rs.getInt("id");
					String nome = rs.getString("nome");
					String email = rs.getString("email");
					int ativo = rs.getInt("ativo");
					int tipo_id = rs.getInt("tipo_id");
					String tipo = rs.getNString("tipo");
					
					usuario.setId(id);
					usuario.setNome(nome);
					usuario.setEmail(email);
					usuario.setAtivo(ativo);
					usuario.setTipoId(tipo_id);
					usuario.setTipo(tipo);
				}
				
				retorno.setStatus(200);
				retorno.setUsuario(usuario);					
			}
			else {
				retorno.setStatus(401);
				retorno.setMessage("Requisição não autorizada!");
			}
		} catch(Exception e) {
			e.printStackTrace();
			
			retorno.setStatus(500);
			retorno.setMessage("Falha interna! Não foi possível buscar os dados do usuário.");
		}
		
		return retorno;
	}
	
	public Retorno buscarPorNome(String nomeUsuario, String tokenBase64) {
		Retorno retorno = new Retorno();
		String comando = "SELECT u.*, t.nome as tipo FROM usuarios u INNER JOIN tipos t ON u.tipo_id = t.id WHERE u.tipo_id <> 1 ";
		
		if (!nomeUsuario.contentEquals("")) {
			comando += "AND u.nome LIKE '%" + nomeUsuario + "%' ";
		}
		
		comando += "ORDER BY u.nome ASC";
		
		List<Usuario> listaUsuarios = new ArrayList<Usuario>();
		
		try {
			if (jwtCode.valid(tokenBase64, this.conexao, true)) {
				Statement stmt = conexao.createStatement();
				ResultSet rs = stmt.executeQuery(comando);
				
				while (rs.next()) {
					int id = rs.getInt("id");
					String nome = rs.getString("nome");
					String email = rs.getString("email");
					int ativo = rs.getInt("ativo");
					int tipo_id = rs.getInt("tipo_id");
					String tipo = rs.getNString("tipo");
					
					
					Usuario usuario = new Usuario();
					usuario.setId(id);
					usuario.setNome(nome);
					usuario.setEmail(email);
					usuario.setAtivo(ativo);
					usuario.setTipoId(tipo_id);
					usuario.setTipo(tipo);
					
					listaUsuarios.add(usuario);
				}
				
				retorno.setStatus(200);
				retorno.setListUsuarios(listaUsuarios);				
			}
			else {
				retorno.setStatus(401);
				retorno.setMessage("Requisição não autorizada!");
			}
		} catch(Exception e) {
			e.printStackTrace();
			
			retorno.setStatus(500);
			retorno.setMessage("Falha interna! Não foi possível listar os usuários.");
		}
		
		return retorno;
	}
	
	public Retorno inserir(Usuario usuario, String tokenBase64) throws NoSuchAlgorithmException {
		Retorno retorno = new Retorno();
		String insertUsuario = "INSERT INTO usuarios (nome, email, senha, ativo, tipo_id) VALUES (?, ?, ?, ?, ?)";
		
		PreparedStatement p;
		
		try {
			if (jwtCode.valid(tokenBase64, this.conexao, true)) {
				p = this.conexao.prepareStatement(insertUsuario);
				
				//Criptografia da senha
				String senhaCriptografada = md5Code.encode(base64.decode(usuario.getSenha()));
				
				// Cadastro
				p.setString(1, usuario.getNome());
				p.setString(2, usuario.getEmail());
				p.setString(3, senhaCriptografada);
				p.setInt(4, usuario.getAtivo());
				p.setInt(5, usuario.getTipoId());
				
				p.execute();
				
				retorno.setStatus(200);
				retorno.setMessage("Usuário cadastrado com sucesso!");				
			}
			else {
				retorno.setStatus(401);
				retorno.setMessage("Requisição não autorizada!");
			}
		} catch(SQLException e) {
			retorno.setStatus(500);
			retorno.setMessage("Falha interna! Não foi possível cadastrar o usuário.");
		}
		
		return retorno;
	}

	public Retorno alterar(Usuario usuario, String tokenBase64) {
		Retorno retorno = new Retorno();
		String comando = "UPDATE usuarios SET nome=?, email=?, ativo=?, tipo_id=? WHERE id=?";
		PreparedStatement p;
		
		try {
			if (jwtCode.valid(tokenBase64, this.conexao, true)) {
				p = this.conexao.prepareStatement(comando);
				p.setString(1, usuario.getNome());
				p.setString(2, usuario.getEmail());
				p.setInt(3, usuario.getAtivo());
				p.setInt(4, usuario.getTipoId());
				p.setInt(5, usuario.getId());
				p.executeUpdate();
				
				retorno.setStatus(200);
				retorno.setMessage("Usuário alterado com sucesso!");				
			}
			else {
				retorno.setStatus(401);
				retorno.setMessage("Requisição não autorizada!");
			}
		} catch(SQLException e) {
			e.printStackTrace();
			
			retorno.setStatus(500);
			retorno.setMessage("Falha interna! Não foi possível alterar os dados do usuário!");
		}
		
		return retorno;
	}
	
	public Retorno alterarSenha(Usuario usuario, String tokenBase64) throws NoSuchAlgorithmException {
		Retorno retorno = new Retorno();
		String comando = "UPDATE usuarios SET senha=? WHERE id=?";
		PreparedStatement p;
		
		try {
			if (jwtCode.valid(tokenBase64, this.conexao, true)) {
				String senhaCriptografada = md5Code.encode(base64.decode(usuario.getSenha()));
				
				p = this.conexao.prepareStatement(comando);
				p.setString(1, senhaCriptografada);
				p.setInt(2, usuario.getId());
				p.executeUpdate();
				
				retorno.setStatus(200);
				retorno.setMessage("Senha alterada com sucesso!");				
			}
			else {
				retorno.setStatus(401);
				retorno.setMessage("Requisição não autorizada!");
			}
		} catch(SQLException e) {
			e.printStackTrace();
			
			retorno.setStatus(500);
			retorno.setMessage("Falha interna! Não foi possível alterar a senha do usuário.");
		}
		
		return retorno;
	}
	
	public Retorno deletar(int id, String tokenBase64) {
		Retorno retorno = new Retorno();
		String comando = "DELETE FROM usuarios WHERE id = ?";
		PreparedStatement p;
		
		try {
			if (jwtCode.valid(tokenBase64, this.conexao, true)) {
				p = this.conexao.prepareStatement(comando);
				p.setInt(1, id);
				p.execute();
				
				retorno.setStatus(200);
				retorno.setMessage("Usuário removido com sucesso!");
			}
			else {
				retorno.setStatus(401);
				retorno.setMessage("Requisição não autorizada!");
			}
		} catch(Exception e) {
			e.printStackTrace();
			
			retorno.setStatus(500);
			retorno.setMessage("Falha interna! Não foi possível deletar o usuário.");
		}
		
		return retorno;
	}

}