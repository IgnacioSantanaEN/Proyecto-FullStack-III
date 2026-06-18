package API.bff.Controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import API.bff.DTO.Integration.Usuario.BFFLoginDTO;
import API.bff.DTO.Integration.Usuario.BFFRegistroDTO;
import API.bff.DTO.Integration.Usuario.BFFUsuarioDTO;
import API.bff.Service.UsuarioServiceBff;

@RestController
@RequestMapping("/api/bff/usuario")
@CrossOrigin(origins = "http://localhost:5173")
public class UsuarioControllerBff {
    
    private final UsuarioServiceBff usuarioService;

    public UsuarioControllerBff(UsuarioServiceBff usuarioService) {
        this.usuarioService = usuarioService;
    }

    @PostMapping("/auth/login")
    public ResponseEntity<BFFUsuarioDTO> login(@RequestBody BFFLoginDTO dto) {
        BFFUsuarioDTO usuario = usuarioService.login(dto);
        if (usuario != null) {
            return ResponseEntity.ok(usuario);
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }

    @GetMapping
    public ResponseEntity<List<BFFUsuarioDTO>> getAllUsuarios() {
        List<BFFUsuarioDTO> usuarios = usuarioService.obtenerTodosLosUsuarios();
        return ResponseEntity.ok(usuarios);
    }

    @GetMapping("/{id}")
    public ResponseEntity<BFFUsuarioDTO> getUsuarioById(@PathVariable int id) {
        BFFUsuarioDTO usuario = usuarioService.obtenerUsuarioPorId(id);
        if (usuario != null) {
            return ResponseEntity.ok(usuario);
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping
    public ResponseEntity<BFFUsuarioDTO> createUsuario(@RequestBody BFFRegistroDTO dto) {
        BFFUsuarioDTO nuevoUsuario = usuarioService.crearUsuario(dto);
        return ResponseEntity.status(HttpStatus.OK).body(nuevoUsuario);
    }

    @PutMapping("/{id}")
    public ResponseEntity<BFFUsuarioDTO> updateUsuario(@PathVariable int id, @RequestBody BFFUsuarioDTO dto) {
        BFFUsuarioDTO updatedUsuario = usuarioService.actualizarUsuario(id, dto);
        if (updatedUsuario != null) {
            return ResponseEntity.ok(updatedUsuario);
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUsuario(@PathVariable int id) {
        boolean deleted = usuarioService.eliminarUsuario(id);
        if (deleted) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
