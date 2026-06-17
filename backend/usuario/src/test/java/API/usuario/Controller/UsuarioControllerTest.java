package API.usuario.Controller;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.Arrays;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import com.fasterxml.jackson.databind.ObjectMapper;

import API.usuario.DTO.UsuarioDTO;
import API.usuario.DTO.UsuarioRegistroDTO;
import API.usuario.Model.Usuario;
import API.usuario.Service.UsuarioService;

@WebMvcTest(UsuarioController.class)
public class UsuarioControllerTest {
    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private UsuarioService usuarioService;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    public void testGetUsuarios_DeberiaDevolverLista() throws Exception {
        Usuario u1 = new Usuario(1, "Alice", "p1", "alice@mail.com", "USER");
        UsuarioDTO dto1 = new UsuarioDTO();
        dto1.setId(1);
        dto1.setName("Alice");
        dto1.setEmail("alice@mail.com");
        dto1.setRole("USER");

        when(usuarioService.getAllUsuarios()).thenReturn(Arrays.asList(u1));
        when(usuarioService.toDTO(u1)).thenReturn(dto1);

        mockMvc.perform(get("/api/usuario")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray()) 
                .andExpect(jsonPath("$[0].name").value("Alice")); 
    }

    @Test
    public void testGetUsuarioById_CuandoExiste_DeberiaDevolverUsuario() throws Exception {
        UsuarioDTO dto = new UsuarioDTO();
        dto.setId(1);
        dto.setName("John Doe");
        dto.setEmail("john@mail.com");
        dto.setRole("USER");

        when(usuarioService.getUsuarioDTOById(1)).thenReturn(dto);

        mockMvc.perform(get("/api/usuario/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("John Doe"))
                .andExpect(jsonPath("$.email").value("john@mail.com"));
    }

    @Test
    public void testGetUsuarioById_CuandoNoExiste_DeberiaDevolver404() throws Exception {
        when(usuarioService.getUsuarioDTOById(99))
                .thenThrow(new RuntimeException("Not found"));

        mockMvc.perform(get("/api/usuario/99"))
                .andExpect(status().isNotFound()); 
    }

    @Test
    public void testCreateUsuario_Exitoso() throws Exception {
        UsuarioRegistroDTO registroDTO = new UsuarioRegistroDTO();
        registroDTO.setName("Carlos");
        registroDTO.setEmail("carlos@mail.com");
        registroDTO.setPassword("clave123");
        registroDTO.setRole("USER");

        Usuario usuarioCreado = new Usuario(5, "Carlos", "encriptada", "carlos@mail.com", "USER");
        UsuarioDTO dtoResultado = new UsuarioDTO();
        dtoResultado.setId(5);
        dtoResultado.setName("Carlos");
        dtoResultado.setEmail("carlos@mail.com");
        dtoResultado.setRole("USER");

        when(usuarioService.saveUsuarioDesdeDTO(any(UsuarioRegistroDTO.class))).thenReturn(usuarioCreado);
        when(usuarioService.toDTO(usuarioCreado)).thenReturn(dtoResultado);

        mockMvc.perform(post("/api/usuario")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(registroDTO))) 
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(5))
                .andExpect(jsonPath("$.name").value("Carlos"));
    }
}
