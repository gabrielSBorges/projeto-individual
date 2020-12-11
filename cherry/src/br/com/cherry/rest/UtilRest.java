package br.com.cherry.rest;

import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.ResponseBuilder;

import com.google.gson.Gson;

import br.com.cherry.modelo.Message;

public class UtilRest {
	public String errorMsg = "Falha interna! Ocorreu um erro na conexão com o banco de dados.";
	
	public Response buildResponse(Object result, int status) {
		try {
			String objeto = new Gson().toJson(result);
			
			ResponseBuilder response = Response.status(status); 
			
			response.entity(objeto);
			
			return response.build();
		} catch(Exception e) {
			e.printStackTrace();
			
			Message message = new Message();
			message.setMessage(e.getMessage());
			
			return this.buildErrorResponse(message, 500);
		}
	}
	
	public Response buildErrorResponse(Message str, int code) {
		ResponseBuilder rb = Response.status(code);
		
		rb = rb.entity(str.getMessage());
		rb = rb.type("text/plain");
		
		return rb.build();
	}
}