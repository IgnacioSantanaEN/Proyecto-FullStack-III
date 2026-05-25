package API.usuario.Service;

import java.util.List;
import java.util.Objects;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import API.usuario.Model.Usuario;
import API.usuario.Repository.UsuarioRepository;
import API.usuario.DTO.UsuarioDTO;
import API.usuario.DTO.UsuarioRegistroDTO;
import API.usuario.DTO.LoginDTO;

@Service
public class UsuarioService {

	@Autowired
	private UsuarioRepository usuarioRepository;
	
	private BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

	public List<Usuario> getAllUsuarios() {
		return usuarioRepository.findAll();
	}

    public Usuario saveUsuario(Usuario usuario) {
        Objects.requireNonNull(usuario, "No se ha proporcionado un usuario válido");
        return usuarioRepository.save(usuario);
    }

    public Usuario getUsuarioById(int id) {
        return usuarioRepository.findById(id)
        .orElseThrow(() -> new RuntimeException("No se ha encontrado un usuario con id " + id));
    }

    public void deleteUsuario(int id) {
        usuarioRepository.deleteById(id);
    }

    public Usuario updateUsuarioById(int id, Usuario usuarioDetails) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("No se ha encontrado un usuario con id " + id));
        usuario.setName(usuarioDetails.getName());
        usuario.setEmail(usuarioDetails.getEmail());
        return usuarioRepository.save(usuario);
    }

    public UsuarioDTO toDTO(Usuario usuario) {
        if (usuario == null) return null;
        UsuarioDTO dto = new UsuarioDTO();
        dto.setId(usuario.getId());
        dto.setName(usuario.getName());
        dto.setLastname(usuario.getLastname());
        dto.setEmail(usuario.getEmail());
        dto.setRole(usuario.getRole());
        return dto;
    }

    public Usuario fromRegistroDTO(UsuarioRegistroDTO registro) {
        if (registro == null) return null;
        Usuario usuario = new Usuario();
        usuario.setName(registro.getName());
        usuario.setLastname(registro.getLastname());
        usuario.setPassword(registro.getPassword());
        usuario.setEmail(registro.getEmail());
        usuario.setRole(registro.getRole());
        return usuario;
    }

    public UsuarioDTO getUsuarioDTOById(int id) {
        Usuario usuario = getUsuarioById(id);
        return toDTO(usuario);
    }
    
    public Usuario saveUsuarioDesdeDTO(UsuarioRegistroDTO registroDTO) {
        // Verificar si el email ya existe
        Usuario existente = usuarioRepository.findByEmail(registroDTO.getEmail());
        if (existente != null) {
            throw new RuntimeException("El correo electrónico ya está registrado");
        }
        
        Usuario usuario = fromRegistroDTO(registroDTO);
        
        String passwordHasheada = passwordEncoder.encode(usuario.getPassword());
        usuario.setPassword(passwordHasheada);
        
        return usuarioRepository.save(usuario);
    }
    
    public UsuarioDTO login(LoginDTO loginDTO) {
        Usuario usuario = usuarioRepository.findByEmail(loginDTO.getEmail());
        
        if (usuario == null) {
            throw new RuntimeException("El correo electrónico no está registrado");
        }
        
        if (!passwordEncoder.matches(loginDTO.getPassword(), usuario.getPassword())) {
            throw new RuntimeException("La contraseña es incorrecta");
        }
        
        return toDTO(usuario);
    }
}
