package br.com.cherry.modelo;

public class Auth {
	private String message = "Login realizado com sucesso!";
	private String token;
	
	public void setToken(String token) {
		this.token = token;
	}
	
	public String getToken() {
		return this.token;
	}
	
	public String getMessage() {
		return this.message;
	}
}
