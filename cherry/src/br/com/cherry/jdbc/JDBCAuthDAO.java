package br.com.cherry.jdbc;

import java.math.BigInteger;
import java.security.Key;
import java.security.MessageDigest;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;

import javax.crypto.spec.SecretKeySpec;
import javax.xml.bind.DatatypeConverter;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.common.io.BaseEncoding;
import com.google.gson.Gson;

import br.com.cherry.modelo.Auth;
import br.com.cherry.modelo.Retorno;
import br.com.cherry.modelo.Usuario;
import io.jsonwebtoken.JwsHeader;
import io.jsonwebtoken.JwtBuilder;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;

public class JDBCAuthDAO {
	private Connection conexao;
	private static String SECRET_KEY = "oeRaYY7Wo24sDqKSX3IM9ASGmdGPmkTd9jo1QTy4b7P9Ze5_9hKolVX8xNrQDcNRfVEdTZNOuOyqEGhXEbdJI-ZQ19k_o9MI0y3eZN2lp9jow55FfXMiINEdt1XR85VipRLSOkT6kSpzs2x-jbLDiz9iFVzkd81YKxMgPA7VfZeQUm4n-mOmnWMaVX30zGFU4L3oPBctYKkl4dYfqYWqRNfrgPJVi5DGFjywgxx0ASEiJHtV72paI3fDR2XwlSkyhhmY-ICjCRmsJN4fX1pdoL8a18-aQrvyu4j0Os6dVPYIoPvvY0SAZtWYKHfM15g7A3HD4cVREf9cUsprCRK93w";
	
	public JDBCAuthDAO(Connection conexao) {
		this.conexao = conexao;
	}
	
	private String decodeBase64(String value) {
		return new String(BaseEncoding.base64().decode(value));
	}
	
	private String encrypt(String value) {
		MessageDigest md = null;
		try {
			md = MessageDigest.getInstance("MD5");
		}
		catch (Exception e) {
			e.printStackTrace();
		}
		
		md.update(value.getBytes(), 0, value.length());
		
		return new BigInteger(1, md.digest()).toString(16);
	}
	
	public static String createJWT(Usuario usuario) {
		Instant now = Instant.now();
		
		SignatureAlgorithm signatureAlgorithm = SignatureAlgorithm.HS256;
		byte[] apiKeySecretBytes = DatatypeConverter.parseBase64Binary(SECRET_KEY);
	    Key signingKey = new SecretKeySpec(apiKeySecretBytes, signatureAlgorithm.getJcaName());
	    
	    JwtBuilder builder = Jwts.builder()
			.setId(Integer.toString(usuario.getId()))
			.setSubject(usuario.getNome())
			.setHeaderParam("usuario", usuario)
			.setIssuedAt(Date.from(now))
			.setExpiration(Date.from(now.plus(24, ChronoUnit.HOURS)))
			.signWith(signatureAlgorithm, signingKey);
	    
	    return builder.compact();
	}
	
	private Usuario decodeJWT(String token) throws JsonProcessingException {
		JwsHeader<?> header = Jwts.parser()
		        .setSigningKey(DatatypeConverter.parseBase64Binary(SECRET_KEY))
		        .parseClaimsJws(token).getHeader();
		
		ObjectMapper mapper = new ObjectMapper();
		String headerJson = mapper.writeValueAsString(header.get("usuario"));
		
		Usuario usuario = new Gson().fromJson(headerJson, Usuario.class);
		
		return usuario;
	}
	
	private Boolean tokenValido(String token) throws SQLException {
		String buscaToken = "SELECT * FROM tokens WHERE code = ?";
		
		String hashToken = encrypt(token);
		
		PreparedStatement p = this.conexao.prepareStatement(buscaToken);
		p.setString(1, hashToken);
		
		ResultSet rs = p.executeQuery();
		
		if (rs.next()) {
			return true;
		}
		else {
			return false;			
		}
	}
	
	public Retorno getMe(String tokenBase64) {
		Retorno retorno = new Retorno();
		
		try {
			String token = decodeBase64(tokenBase64);
			
			if (tokenValido(token)) {
				retorno.setStatus("sucesso");
				retorno.setUsuario(decodeJWT(token));
			}
			else {
				retorno.setStatus("erro");
				retorno.setMessage("Token inválido!");
			}
		}
		catch(Exception e) {
			e.printStackTrace();
			
			retorno.setStatus("erro");
			retorno.setMessage("Ocorreu um erro ao definir os dados da sessão! \n Erro: \n" + e.getMessage());
		}
		
		System.out.println("OOO");
		
		return retorno;
	}
	
	public Retorno login(Usuario usuarioForm) {
		Retorno retorno = new Retorno();
		
		String comando = "SELECT u.id, u.email, u.nome, u.ativo, t.nome as tipo, u.tipo_id FROM usuarios u INNER JOIN tipos t ON u.tipo_id = t.id WHERE email = ? AND senha = ?";
		String deleteToken = "DELETE FROM tokens WHERE usuario_id = ?";
		String saveToken = "INSERT INTO tokens (code, usuario_id) VALUES (?, ?)";
		
		try {
			String senha = decodeBase64(usuarioForm.getSenha());

			usuarioForm.setSenha(encrypt(senha));
			
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
					
					String token = createJWT(usuario);
					
					Auth auth = new Auth();
					auth.setToken(token);
					
					p = this.conexao.prepareStatement(deleteToken);
					p.setInt(1, usuario.getId());
					p.execute();
					
					p = this.conexao.prepareStatement(saveToken);
					p.setString(1, encrypt(token));
					p.setInt(2, usuario.getId());
					p.execute();
					
					retorno.setStatus("sucesso");
					retorno.setAuth(auth);					
				}
				else {
					retorno.setStatus("erro");
					retorno.setMessage("Usuário desativado!");
				}
			}
			else {
				retorno.setStatus("erro");
				retorno.setMessage("Usuário não encontrado!");
			}
		} catch(Exception e) {
			e.printStackTrace();
			
			retorno.setStatus("erro");
			retorno.setMessage("Ocorreu um erro na autenticação! \n Erro: \n" + e.getMessage());
		}
		
		return retorno;
	}
	
	public Retorno logout(String tokenBase64) {
		Retorno retorno = new Retorno();
		
		String deleteToken = "DELETE FROM tokens WHERE code = ?";
		
		try {
			String token = decodeBase64(tokenBase64);
			
			PreparedStatement p = this.conexao.prepareStatement(deleteToken);
			p.setString(1, encrypt(token));
			p.execute();
			
			retorno.setStatus("sucesso");
			retorno.setMessage("Logout realizado com sucesso!");
			
		} catch(Exception e) {
			e.printStackTrace();
			
			retorno.setStatus("erro");
			retorno.setMessage("Ocorreu um erro ao tentar realizar o logout! \n Erro: \n" + e.getMessage());
		}
		
		return retorno;
	}
}
