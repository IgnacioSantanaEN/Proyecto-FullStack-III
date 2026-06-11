package API.usuario.Service;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import API.usuario.Model.Usuario;
import API.usuario.Repository.UsuarioRepository;
import API.usuario.DTO.UsuarioDTO;
import API.usuario.DTO.UsuarioRegistroDTO;
import API.usuario.DTO.LoginDTO;

@Service
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    
    public UsuarioService(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    private BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public List<Usuario> getAllUsuarios() {
        return usuarioRepository.findAll();
    }

    public Usuario saveUsuario(Usuario usuario) {
        if (usuario == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "No se ha proporcionado un usuario válido");
        }
        return usuarioRepository.save(usuario);
    }

    public Usuario getUsuarioById(int id) {
        return usuarioRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "No se ha encontrado un usuario con id " + id));
    }

    public void deleteUsuario(int id) {
        if (!usuarioRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "No se ha encontrado un usuario con id " + id);
        }
        usuarioRepository.deleteById(id);
    }

    public Usuario updateUsuarioById(int id, Usuario usuarioDetails) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "No se ha encontrado un usuario con id " + id));
        usuario.setName(usuarioDetails.getName());
        usuario.setEmail(usuarioDetails.getEmail());
        return usuarioRepository.save(usuario);
    }

    public UsuarioDTO toDTO(Usuario usuario) {
        return UsuarioMapper.toDTO(usuario);
    }

    public Usuario fromRegistroDTO(UsuarioRegistroDTO registro) {
        return UsuarioMapper.fromRegistroDTO(registro);
    }

    public UsuarioDTO getUsuarioDTOById(int id) {
        Usuario usuario = getUsuarioById(id);
        return toDTO(usuario);
    }
    
    public Usuario saveUsuarioDesdeDTO(UsuarioRegistroDTO registroDTO) {
        // Verificar si el email ya existe
        Usuario existente = usuarioRepository.findByEmail(registroDTO.getEmail());
        if (existente != null) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "El correo electrónico ya está registrado");
        }
        
        Usuario usuario = fromRegistroDTO(registroDTO);
        
        String passwordHasheada = passwordEncoder.encode(usuario.getPassword());
        usuario.setPassword(passwordHasheada);
        
        return usuarioRepository.save(usuario);
    }
    
    public UsuarioDTO login(LoginDTO loginDTO) {
        Usuario usuario = usuarioRepository.findByEmail(loginDTO.getEmail());
        
        if (usuario == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "El correo electrónico no está registrado");
        }
        
        if (!passwordEncoder.matches(loginDTO.getPassword(), usuario.getPassword())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "La contraseña es incorrecta");
        }
        
        return toDTO(usuario);
    }
}