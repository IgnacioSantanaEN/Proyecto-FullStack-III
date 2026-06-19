package API.usuario.Service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

import java.util.Arrays;
import java.util.List;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.server.ResponseStatusException;

import API.usuario.DTO.LoginDTO;
import API.usuario.DTO.UsuarioDTO;
import API.usuario.DTO.UsuarioRegistroDTO;
import API.usuario.Model.Usuario;
import API.usuario.Repository.UsuarioRepository;

@ExtendWith(MockitoExtension.class)
public class UsuarioServiceTest {

    @Mock
    private UsuarioRepository usuarioRepository;

    @InjectMocks
    private UsuarioService usuarioService;

    // Testeo para método de traer todos los usuarios
    @Test
    public void testGetAllUsuarios() {
        // Arrange
        Usuario u1 = new Usuario(1, "John Doe", "p1", "password123", "USER");
        Usuario u2 = new Usuario(2, "Jane Smith", "p2", "password456", "ADMIN");

        when(usuarioRepository.findAll()).thenReturn(Arrays.asList(u1, u2));

        List<Usuario> result = usuarioService.getAllUsuarios();

        assertEquals(2, result.size());
        assertTrue(result.contains(u1));
        verify(usuarioRepository, times(1)).findAll();
    }

    // Testeo para métodos de traer usuario por id
    @Test
    public void testGetUsuarioById() {
        Usuario usuariofalso = new Usuario(1, "John Doe", "p1", "j@gmail.com", "USER");
        when(usuarioRepository.findById(1)).thenReturn(java.util.Optional.of(usuariofalso));
    
        Usuario result = usuarioService.getUsuarioById(1);

        assertNotNull(result);
        assertEquals("John Doe", result.getName());
        assertEquals("j@gmail.com", result.getEmail());
        verify(usuarioRepository, times(1)).findById(1);
    }

    @Test
    public void testGetUsuarioById_NotFound() {
        when(usuarioRepository.findById(2)).thenReturn(java.util.Optional.empty());

        ResponseStatusException exception = assertThrows(ResponseStatusException.class, () -> {
            usuarioService.getUsuarioById(2);
        });

        assertEquals(HttpStatus.NOT_FOUND, exception.getStatusCode());
    }

    // Testeo para métodos de guardado usuarioDTO
    @Test
    public void testCreateUsuarioDTO() {
        UsuarioRegistroDTO registroDTO = new UsuarioRegistroDTO();
        registroDTO.setName("Carlos");
        registroDTO.setPassword("p3");
        registroDTO.setEmail("carlos@mail.com");
        registroDTO.setRole("USER");

        when(usuarioRepository.findByEmail("carlos@mail.com")).thenReturn(null);

        Usuario savedUsuario = new Usuario(3, "Carlos", "contraseña_encriptada", "carlos@mail.com", "USER");
        when(usuarioRepository.save(any(Usuario.class))).thenReturn(savedUsuario);

        Usuario resultado = usuarioService.saveUsuarioDesdeDTO(registroDTO);

        assertNotNull(resultado);
        assertEquals(3, resultado.getId());
        assertEquals("Carlos", resultado.getName());
        verify(usuarioRepository, times(1)).save(any(Usuario.class));
    }

    // Testeo para método de login
    @Test
    public void testLogin_Success() {
        LoginDTO loginDTO = new LoginDTO();
        loginDTO.setEmail("carlos@mail.com");
        loginDTO.setPassword("p3");

        String hashed = new BCryptPasswordEncoder().encode("p3");

        when(usuarioRepository.findByEmail("carlos@mail.com")).thenReturn(new Usuario());
        Usuario usuario = new Usuario(1, "Carlos", hashed, "carlos@mail.com", "USER");

        when(usuarioRepository.findByEmail("carlos@mail.com")).thenReturn(usuario);

        UsuarioDTO result = usuarioService.login(loginDTO);
        
        assertNotNull(result);
        assertEquals("Carlos", result.getName());
        assertEquals("carlos@mail.com", result.getEmail());
    }

}