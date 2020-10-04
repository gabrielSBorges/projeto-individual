package br.com.cherry.jdbc;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;

import br.com.cherry.modelo.Usuario;
import br.com.cherry.modelo.Retorno;

public class JDBCUsuarioDAO {
	private Connection conexao;
	
	public JDBCUsuarioDAO(Connection conexao) {
		this.conexao = conexao;
	}
	
	public String criptografarSenha(String senha) throws NoSuchAlgorithmException {
		MessageDigest md = MessageDigest.getInstance("MD5");
        
        md.update(senha.getBytes());
        
        byte[] bytes = md.digest();
        
        StringBuilder sb = new StringBuilder();
        
        for (int i=0; i< bytes.length ;i++) {
        	sb.append(Integer.toString((bytes[i] & 0xff) + 0x100, 16).substring(1));
        }
        
        return sb.toString();
	}

	public Retorno buscarPorId(int usuId) {
		Retorno retorno = new Retorno();
		String comando = "SELECT u.*, t.nome as tipo FROM usuarios u INNER JOIN tipos t ON u.tipo_id = t.id WHERE u.id = ?";
		Usuario usuario = new Usuario();
		
		try {
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
			
			retorno.setStatus("sucesso");
			retorno.setUsuario(usuario);	
		} catch(Exception e) {
			e.printStackTrace();
			
			retorno.setStatus("erro");
			retorno.setMessage("Ocorreu um erro ao tentar buscar o usuario! \n Erro: \n" + e.getMessage());
		}
		
		return retorno;
	}
	
	public Retorno buscarPorNome(String nomeUsuario) {
		Retorno retorno = new Retorno();
		String comando = "SELECT u.*, t.nome as tipo FROM usuarios u INNER JOIN tipos t ON u.tipo_id = t.id ";
		
		if (!nomeUsuario.contentEquals("")) {
			comando += "WHERE u.nome LIKE '%" + nomeUsuario + "%' ";
		}
		
		comando += "ORDER BY u.nome ASC";
		
		List<Usuario> listaUsuarios = new ArrayList<Usuario>();
		
		try {
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
			
			retorno.setStatus("sucesso");
			retorno.setListUsuarios(listaUsuarios);
		} catch(Exception e) {
			e.printStackTrace();
			
			retorno.setStatus("erro");
			retorno.setMessage("Ocorreu um erro ao tentar listar os usuarios! \n Erro: \n" + e.getMessage());
		}
		
		return retorno;
	}
	
	public Retorno inserir(Usuario usuario) throws NoSuchAlgorithmException {
		Retorno retorno = new Retorno();
		String insertUsuario = "INSERT INTO usuarios (nome, email, senha, ativo, tipo_id) VALUES (?, ?, ?, ?, ?)";
		
		PreparedStatement p;
		
		try {
			p = this.conexao.prepareStatement(insertUsuario);
			
			//Criptografia da senha
            String senhaCriptografada = criptografarSenha(usuario.getSenha());
			
            // Cadastro
			p.setString(1, usuario.getNome());
			p.setString(2, usuario.getEmail());
			p.setString(3, senhaCriptografada);
			p.setInt(4, usuario.getAtivo());
			p.setInt(5, usuario.getTipoId());
			
			p.execute();
			
			retorno.setStatus("sucesso");
			retorno.setMessage("Usuario cadastrado com sucesso!");
		} catch(SQLException e) {
			retorno.setStatus("erro");
			retorno.setMessage("Ocorreu um erro ao tentar cadastrar o usuario! \n Erro: \n" + e.getMessage());
		}
		
		return retorno;
	}

	public Retorno alterar(Usuario usuario) {
		Retorno retorno = new Retorno();
		String comando = "UPDATE usuarios SET nome=?, email=?, ativo=?, tipo_id=? WHERE id=?";
		PreparedStatement p;
		
		try {
			p = this.conexao.prepareStatement(comando);
			p.setString(1, usuario.getNome());
			p.setString(2, usuario.getEmail());
			p.setInt(3, usuario.getAtivo());
			p.setInt(4, usuario.getTipoId());
			p.setInt(5, usuario.getId());
			p.executeUpdate();

			retorno.setStatus("sucesso");
			retorno.setMessage("Usuario alterado com sucesso!");
		} catch(SQLException e) {
			e.printStackTrace();
			
			retorno.setStatus("erro");
			retorno.setMessage("Ocorreu um erro ao tentar alterar esse usuario! \n Erro: \n" + e.getMessage());
		}
		
		return retorno;
	}
	
	public Retorno alterarSenha(Usuario usuario) throws NoSuchAlgorithmException {
		Retorno retorno = new Retorno();
		String comando = "UPDATE usuarios SET senha=? WHERE id=?";
		PreparedStatement p;
		
		try {
			String senhaCriptografada = criptografarSenha(usuario.getSenha());
			
			p = this.conexao.prepareStatement(comando);
			p.setString(1, senhaCriptografada);
			p.setInt(2, usuario.getId());
			p.executeUpdate();

			retorno.setStatus("sucesso");
			retorno.setMessage("Senha alterada com sucesso!");
		} catch(SQLException e) {
			e.printStackTrace();
			
			retorno.setStatus("erro");
			retorno.setMessage("Ocorreu um erro ao tentar alterar a senha desse usuario! \n Erro: \n" + e.getMessage());
		}
		
		return retorno;
	}
	
	public Retorno deletar(int id) {
		Retorno retorno = new Retorno();
		String comando = "DELETE FROM usuarios WHERE id = ?";
		PreparedStatement p;
		
		try {
			p = this.conexao.prepareStatement(comando);
			p.setInt(1, id);
			p.execute();
			
			retorno.setStatus("sucesso");
			retorno.setMessage("Usuario removido com sucesso!");
		} catch(Exception e) {
			e.printStackTrace();
			
			retorno.setStatus("erro");
			retorno.setMessage("Ocorreu um erro ao tentar remover o usuario! \n Erro: \n" + e.getMessage());
		}
		
		return retorno;
	}

}