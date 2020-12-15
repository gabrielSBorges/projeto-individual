package br.com.cherry.jdbc;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.Statement;

import br.com.cherry.modelo.Auth;
import br.com.cherry.modelo.Retorno;
import br.com.cherry.modelo.Usuario;
import br.com.cherry.auth.*;

import java.util.Properties;
import javax.mail.Address;
import javax.mail.Message;
import javax.mail.PasswordAuthentication;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;

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
			
			if (jwtCode.valid(tokenBase64, this.conexao, true)) {
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
		
		String comando = "SELECT id, nome, tipo_id, ativo FROM usuarios WHERE email = ?";
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
					
					// Enviar e-mail
					Properties props = new Properties();
				    props.put("mail.smtp.host", "smtp.gmail.com");
				    props.put("mail.smtp.socketFactory.port", "465");
				    props.put("mail.smtp.socketFactory.class", "javax.net.ssl.SSLSocketFactory");
				    props.put("mail.smtp.auth", "true");
				    props.put("mail.smtp.port", "465");
				    
//				    props.put("mail.transport.protocol", "smtp");
//		            props.put("mail.smtp.host", "smtp.live.com");
//		            props.put("mail.smtp.socketFactory.port", "587");
//		            props.put("mail.smtp.socketFactory.fallback", "false");
//		            props.put("mail.smtp.starttls.enable", "true");
//		            props.put("mail.smtp.auth", "true");
//		            props.put("mail.smtp.port", "587");
				    
				    System.out.println("Teste1");
				    
				    Session session = Session.getDefaultInstance(props,
		    	      new javax.mail.Authenticator() {
		    	           protected PasswordAuthentication getPasswordAuthentication()
		    	           {
		    	                 return new PasswordAuthentication("sistema.cherry@gmail.com", "Cherry@123456");
		    	           }
		    	      });
				    
		    	    session.setDebug(true);
		    	    
		    	    System.out.println("Teste 2");
		    	    
		    	    try {
		    	    	String token = jwtCode.encode(usuario, 1);
						
						p = this.conexao.prepareStatement(deleteToken);
						p.setInt(1, usuario.getId());
						p.execute();
						
						p = this.conexao.prepareStatement(saveToken, Statement.RETURN_GENERATED_KEYS);
						p.setString(1, token);
						p.setInt(2, usuario.getId());
						p.execute();
						
						ResultSet rsToken = p.getGeneratedKeys();
		    	    	
		    	    	if (rsToken.next()) {
		    	    		int token_id = rsToken.getInt(1);
							
							String url = "http://localhost:8080/cherry/#/resetar_senha?code=" + base64.encode(Integer.toString(token_id));
							
		    	    		Message message = new MimeMessage(session);
	    	    	        message.setFrom(new InternetAddress("cherry.sistema@gmail.com"));

		    	    	    Address[] toUser = InternetAddress.parse(usuarioForm.getEmail());

		    	    	    message.setRecipients(Message.RecipientType.TO, toUser);
		    	    	    message.setSubject("Recuperação de senha - Cherry");
		    	    	    message.setText("Acesse o link para resetar sua senha: " + url);
		    	    	      
		    	    	    Transport.send(message);
		    	    		
		    	    		retorno.setStatus(200);
		    	    		retorno.setMessage("E-mail enviado. Verifique sua caixa de entrada!");				
		    	    	}
		    	    	else {
		    	    		retorno.setStatus(500);
							retorno.setMessage("Falha interna! Não foi possível gerar o token de acesso!.");
		    	    	}
		    	    	
		    	    }
		    	    catch(Exception e) {
		    	    	retorno.setStatus(500);
		    			retorno.setMessage("Falha interna! Não foi possível realizar o envio do e-mail.");
		    	    }				
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
	
	public Retorno resetarSenha(Usuario usuarioForm, String token_id_base64) {
		Retorno retorno = new Retorno();
		
		String findToken = "SELECT code FROM tokens WHERE id = ?;";
		String updatePassword = "UPDATE usuarios SET senha = ? WHERE id = ?;";
		
		try {
			int token_id = Integer.parseInt(base64.decode(token_id_base64));
			
			PreparedStatement p = this.conexao.prepareStatement(findToken);
			p.setInt(1, token_id);
			
			ResultSet rs = p.executeQuery();
			if (rs.next()) {
				String token = rs.getString("code");
				
				if (jwtCode.valid(base64.encode(token), this.conexao, false)) {
					Usuario usuario = jwtCode.decode(token);
					
					String senhaMD5 = md5Code.encode(base64.decode(usuarioForm.getSenha()));
					
					p = this.conexao.prepareStatement(updatePassword);
					p.setString(1, senhaMD5);
					p.setInt(2, usuario.getId());
					p.execute();
					
					retorno.setStatus(200);
					retorno.setMessage("Senha alterada com sucesso!");
				}
				else {
					retorno.setStatus(401);
					retorno.setMessage("Requisição não autorizada!");
				}
			}
			else {
				retorno.setStatus(401);
				retorno.setMessage("Token inválido!");
			}
			
		}
		catch(Exception e) {
			e.printStackTrace();
			
			retorno.setStatus(500);
			retorno.setMessage("Falha interna! Não foi possível alterar a senha.");
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
