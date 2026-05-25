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
    public ResponseEntity<UsuarioDTO> createUsuario(@Valid @RequestBody UsuarioRegistroDTO registroDTO) {
        Usuario savedUsuario = usuarioService.saveUsuarioDesdeDTO(registroDTO);
        UsuarioDTO dto = usuarioService.toDTO(savedUsuario);
        return ResponseEntity.ok(dto);
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
}
