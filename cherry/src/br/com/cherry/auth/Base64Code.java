package br.com.cherry.auth;

import com.google.common.io.BaseEncoding;

public class Base64Code {
	public String encode(String value) {
		return new String(BaseEncoding.base64().encode(value.getBytes()));
	}
	
	public String decode(String value) {
		return new String(BaseEncoding.base64().decode(value));
	}
}