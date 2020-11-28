package br.com.cherry.auth;

import java.security.Key;
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
import com.google.gson.Gson;

import br.com.cherry.modelo.Usuario;
import io.jsonwebtoken.JwsHeader;
import io.jsonwebtoken.JwtBuilder;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;

public class JWTCode {
	private static String SECRET_KEY = "oeRaYY7Wo24sDqKSX3IM9ASGmdGPmkTd9jo1QTy4b7P9Ze5_9hKolVX8xNrQDcNRfVEdTZNOuOyqEGhXEbdJI-ZQ19k_o9MI0y3eZN2lp9jow55FfXMiINEdt1XR85VipRLSOkT6kSpzs2x-jbLDiz9iFVzkd81YKxMgPA7VfZeQUm4n-mOmnWMaVX30zGFU4L3oPBctYKkl4dYfqYWqRNfrgPJVi5DGFjywgxx0ASEiJHtV72paI3fDR2XwlSkyhhmY-ICjCRmsJN4fX1pdoL8a18-aQrvyu4j0Os6dVPYIoPvvY0SAZtWYKHfM15g7A3HD4cVREf9cUsprCRK93w";
	
	public String encode(Usuario usuario) {
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
	
	public Usuario decode(String token) throws JsonProcessingException {
		JwsHeader<?> header = Jwts.parser()
		        .setSigningKey(DatatypeConverter.parseBase64Binary(SECRET_KEY))
		        .parseClaimsJws(token).getHeader();
		
		ObjectMapper mapper = new ObjectMapper();
		String headerJson = mapper.writeValueAsString(header.get("usuario"));
		
		Usuario usuario = new Gson().fromJson(headerJson, Usuario.class);
		
		return usuario;
	}
	
	public Boolean valid(String tokenBase64, Connection conexao) throws SQLException {
		if (tokenBase64 == null) {
			return false;
		}
		
		String buscaToken = "SELECT * FROM tokens WHERE code = ?";
		
		Base64Code base64 = new Base64Code();
		String token = base64.decode(tokenBase64);
		
		MD5Code md5Code = new MD5Code();
		String hashToken = md5Code.encode(token);
		
		PreparedStatement p = conexao.prepareStatement(buscaToken);
		p.setString(1, hashToken);
		
		ResultSet rs = p.executeQuery();
		
		if (rs.next()) {
			return true;
		}
		else {
			return false;			
		}
	}
}