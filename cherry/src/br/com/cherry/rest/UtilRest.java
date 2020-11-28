package br.com.cherry.rest;

import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.ResponseBuilder;

import com.google.gson.Gson;

public class UtilRest {
	public Response buildResponse(Object result) {
		try {
			String valorResposta = new Gson().toJson(result);
			return Response.ok(valorResposta).build();
		} catch(Exception e) {
			e.printStackTrace();
			return this.buildErrorResponse(e.getMessage(), 500);
		}
	}
	
	public Response buildErrorResponse(String str, int code) {
		ResponseBuilder rb = Response.status(code);
		
		rb = rb.entity(str);
		rb = rb.type("text/plain");
		
		return rb.build();
	}
}