package br.com.cherry.auth;

import java.math.BigInteger;
import java.security.MessageDigest;

public class MD5Code {
	public String encode(String value) {
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
}
