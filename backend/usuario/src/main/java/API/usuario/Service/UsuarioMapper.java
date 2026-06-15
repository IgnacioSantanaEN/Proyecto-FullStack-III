package API.usuario.Service;

import API.usuario.DTO.LoginDTO;
import API.usuario.DTO.UsuarioDTO;
import API.usuario.DTO.UsuarioRegistroDTO;
import API.usuario.Model.Usuario;

public class UsuarioMapper {

	public static UsuarioDTO toDTO(Usuario usuario) {
		if (usuario == null) return null;
		UsuarioDTO dto = new UsuarioDTO();
		dto.setId(usuario.getId());
		dto.setName(usuario.getName());
		dto.setEmail(usuario.getEmail());
		dto.setRole(usuario.getRole());
		return dto;
	}

	public static Usuario fromRegistroDTO(UsuarioRegistroDTO registro) {
		if (registro == null) return null;
		Usuario usuario = new Usuario();
		usuario.setName(registro.getName());
		usuario.setPassword(registro.getPassword());
		usuario.setEmail(registro.getEmail());
		usuario.setRole(registro.getRole());
		return usuario;
	}

	public static LoginDTO toLoginDTO(Usuario usuario) {
		if (usuario == null) return null;
		LoginDTO dto = new LoginDTO();
		dto.setEmail(usuario.getEmail());
		// No exponer contraseña
		return dto;
	}
}
