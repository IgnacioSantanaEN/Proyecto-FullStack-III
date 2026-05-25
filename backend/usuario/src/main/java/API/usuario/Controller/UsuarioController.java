package API.usuario.Controller;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import API.usuario.Model.Usuario;
import API.usuario.Service.UsuarioService;
import jakarta.validation.Valid;

import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.http.ResponseEntity;
import API.usuario.DTO.UsuarioDTO;
import API.usuario.DTO.UsuarioRegistroDTO;
import API.usuario.DTO.LoginDTO;
import org.springframework.web.bind.MethodArgumentNotValidException;



@RestController
@RequestMapping("/api")
public class UsuarioController {

    @Autowired
    private UsuarioService usuarioService;

    @GetMapping("/users")
    public List<UsuarioDTO> getUsuarios() {
        return usuarioService.getAllUsuarios()
                .stream()
                .map(usuarioService::toDTO)
                .collect(Collectors.toList());
    }

    @GetMapping("/users/{id}")
    public ResponseEntity<UsuarioDTO> getUsuarioById(@PathVariable int id) {
        try {
            UsuarioDTO dto = usuarioService.getUsuarioDTOById(id);
            return ResponseEntity.ok(dto);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    /* POST Usuario usando DTO resuelto */
    @PostMapping("/users")
    public ResponseEntity<?> createUsuario(@Valid @RequestBody UsuarioRegistroDTO registroDTO) {
        try {
            Usuario savedUsuario = usuarioService.saveUsuarioDesdeDTO(registroDTO);
            UsuarioDTO dto = usuarioService.toDTO(savedUsuario);
            return ResponseEntity.ok(dto);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        }
    }

    @PutMapping("/users/{id}")
    public ResponseEntity<UsuarioDTO> updateUsuario(@PathVariable int id, @Valid @RequestBody Usuario usuarioDetails) {
        try {
            Usuario updatedUsuario = usuarioService.updateUsuarioById(id, usuarioDetails);
            UsuarioDTO dto = usuarioService.toDTO(updatedUsuario);
            return ResponseEntity.ok(dto);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<?> deleteUsuario(@PathVariable int id) {
        usuarioService.deleteUsuario(id);
        return ResponseEntity.noContent().build();
    }
    
    /* POST Login */
    @PostMapping("/auth/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginDTO loginDTO) {
        try {
            UsuarioDTO usuarioDTO = usuarioService.login(loginDTO);
            return ResponseEntity.ok(usuarioDTO);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        }
    }
    
    /* Endpoint de prueba para verificar que el servidor está corriendo */
    @GetMapping("/health")
    public ResponseEntity<?> health() {
        return ResponseEntity.ok(new ErrorResponse("El servidor de usuarios está en línea"));
    }
    
    /* Clase interna para respuesta de error */
    public static class ErrorResponse {
        public String error;
        
        public ErrorResponse(String error) {
            this.error = error;
        }
        
        public String getError() {
            return error;
        }
    }
}
