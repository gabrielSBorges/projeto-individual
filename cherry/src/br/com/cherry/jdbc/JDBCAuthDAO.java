package br.com.cherry.jdbc;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;

import br.com.cherry.modelo.Auth;
import br.com.cherry.modelo.Retorno;
import br.com.cherry.modelo.Usuario;
import br.com.cherry.auth.*;

public class JDBCAuthDAO {
	private Connection conexao;
	
	Base64Code base64 = new Base64Code();
	MD5Code md5Code = new MD5Code();
	JWTCode jwtCode = new JWTCode();
	
	public JDBCAuthDAO(Connection conexao) {
		this.conexao = conexao;
	}
	
	public Retorno getMe(String tokenBase64) {
		Retorno retorno = new Retorno();
		
		try {
			String token = base64.decode(tokenBase64);
			
			if (jwtCode.valid(tokenBase64, this.conexao)) {
				Usuario usuario = jwtCode.decode(token);
				
				String comando = "SELECT u.id, u.email, u.nome, u.ativo, t.nome as tipo, u.tipo_id FROM usuarios u INNER JOIN tipos t ON u.tipo_id = t.id WHERE u.id = ?";
				
				PreparedStatement p = this.conexao.prepareStatement(comando);
				p.setInt(1, usuario.getId());
				
				ResultSet rs = p.executeQuery();
				if (rs.next()) {
					String email = rs.getString("email");
					String nome = rs.getString("nome");
					String tipo = rs.getString("tipo");
					int tipo_id = rs.getInt("tipo_id");
					int ativo = rs.getInt("ativo");
					
					usuario.setEmail(email);
					usuario.setNome(nome);
					usuario.setTipo(tipo);
					usuario.setTipoId(tipo_id);
					usuario.setAtivo(ativo);
					
					retorno.setStatus(200);
					retorno.setUsuario(usuario);
				}
				else {
					retorno.setStatus(400);
					retorno.setMessage("Usuário não encontrado!");
				}
			}
			else {
				retorno.setStatus(401);
				retorno.setMessage("Requisição não autorizada!");
			}
		}
		catch(Exception e) {
			e.printStackTrace();
			
			retorno.setStatus(500);
			retorno.setMessage("Falha interna! Não foi possível buscar os dados da sessão.");
		}
		
		return retorno;
	}
	
	public Retorno login(Usuario usuarioForm) {
		Retorno retorno = new Retorno();
		
		String comando = "SELECT u.id, u.email, u.nome, u.ativo, t.nome as tipo, u.tipo_id FROM usuarios u INNER JOIN tipos t ON u.tipo_id = t.id WHERE email = ? AND senha = ?";
		String deleteToken = "DELETE FROM tokens WHERE usuario_id = ?";
		String saveToken = "INSERT INTO tokens (code, usuario_id) VALUES (?, ?)";
		
		try {
			String senha = base64.decode(usuarioForm.getSenha());

			usuarioForm.setSenha(md5Code.encode(senha));
			
			PreparedStatement p = this.conexao.prepareStatement(comando);
			p.setString(1, usuarioForm.getEmail());
			p.setString(2, usuarioForm.getSenha());
			
			ResultSet rs = p.executeQuery();
			if (rs.next()) {
				int id = rs.getInt("id");
				String email = rs.getString("email");
				String nome = rs.getString("nome");
				String tipo = rs.getString("tipo");
				int tipo_id = rs.getInt("tipo_id");
				int ativo = rs.getInt("ativo");
				
				if (tipo_id == 1 || ativo == 1) {
					Usuario usuario = new Usuario();
					usuario.setId(id);
					usuario.setEmail(email);
					usuario.setNome(nome);
					usuario.setTipo(tipo);
					usuario.setTipoId(tipo_id);
					usuario.setAtivo(ativo);
					
					String token = jwtCode.encode(usuario, 24);
					
					Auth auth = new Auth();
					auth.setToken(base64.encode(token));
					
					p = this.conexao.prepareStatement(deleteToken);
					p.setInt(1, usuario.getId());
					p.execute();
					
					p = this.conexao.prepareStatement(saveToken);
					p.setString(1, md5Code.encode(token));
					p.setInt(2, usuario.getId());
					p.execute();
					
					retorno.setStatus(200);
					retorno.setAuth(auth);					
				}
				else {
					retorno.setStatus(400);
					retorno.setMessage("Usuário desativado!");
				}
			}
			else {
				retorno.setStatus(400);
				retorno.setMessage("Usuário não encontrado! E-mail ou senha incorretos.");
			}
		} catch(Exception e) {
			e.printStackTrace();
			
			retorno.setStatus(500);
			retorno.setMessage("Falha interna! Não foi possível concluir o login.");
		}
		
		return retorno;
	}
	
	public Retorno recuperarSenha(Usuario usuarioForm) {
		Retorno retorno = new Retorno();
		
		String comando = "SELECT nome FROM usuarios WHERE email = ?";
		String deleteToken = "DELETE FROM tokens WHERE usuario_id = ?";
		String saveToken = "INSERT INTO tokens (code, usuario_id) VALUES (?, ?)";
		
		try {			
			PreparedStatement p = this.conexao.prepareStatement(comando);
			p.setString(1, usuarioForm.getEmail());
			
			ResultSet rs = p.executeQuery();
			if (rs.next()) {
				int id = rs.getInt("id");
				int tipo_id = rs.getInt("tipo_id");
				int ativo = rs.getInt("ativo");
				
				if (tipo_id == 1 || ativo == 1) {
					Usuario usuario = new Usuario();
					usuario.setId(id);
					usuario.setTipoId(tipo_id);
					usuario.setAtivo(ativo);
					
					String token = jwtCode.encode(usuario, 1);
					
					Auth auth = new Auth();
					auth.setToken(base64.encode(token));
					
					p = this.conexao.prepareStatement(deleteToken);
					p.setInt(1, usuario.getId());
					p.execute();
					
					p = this.conexao.prepareStatement(saveToken);
					p.setString(1, token);
					p.setInt(2, usuario.getId());
					
					ResultSet rsToken = p.getGeneratedKeys();
					
					if (rsToken.next()) {
						int token_id = rsToken.getInt(1);
						
						String url = "http://localhost:8080/cherry/#/recuperar_senha/" + base64.encode(Integer.toString(token_id));
						
						System.out.println(url);
					}
					
					retorno.setStatus(200);
					retorno.setAuth(auth);					
				}
				else {
					retorno.setStatus(400);
					retorno.setMessage("Usuário desativado!");
				}
			}
			else {
				retorno.setStatus(400);
				retorno.setMessage("Usuário não encontrado! E-mail incorreto.");
			}
		} catch(Exception e) {
			e.printStackTrace();
			
			retorno.setStatus(500);
			retorno.setMessage("Falha interna! Não foi possível realizar o envio do e-mail.");
		}
		
		return retorno;
	}
	
	public Retorno logout(String tokenBase64) {
		Retorno retorno = new Retorno();
		
		String deleteToken = "DELETE FROM tokens WHERE code = ?";
		
		try {
			String token = base64.decode(tokenBase64);
			
			PreparedStatement p = this.conexao.prepareStatement(deleteToken);
			p.setString(1, md5Code.encode(token));
			p.execute();
			
			retorno.setStatus(200);
			retorno.setMessage("Logout realizado com sucesso!");
			
		} catch(Exception e) {
			e.printStackTrace();
			
			retorno.setStatus(500);
			retorno.setMessage("Falha interna! Não foi possível realizar o logout adequadamente.");
		}
		
		return retorno;
	}
}
