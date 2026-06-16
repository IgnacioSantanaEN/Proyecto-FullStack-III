package API.bff.Client;

import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Component;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestClient;

import API.bff.DTO.Integration.Usuario.BFFLoginDTO;
import API.bff.DTO.Integration.Usuario.BFFRegistroDTO;
import API.bff.DTO.Integration.Usuario.BFFUsuarioDTO;

@Component
public class UsuarioClient {
    
    private final RestClient restClient;

    // Inyectamos el bean configurado específicamente para usuarios
    public UsuarioClient(@Qualifier("usuarioRestClient") RestClient restClient) {
        this.restClient = restClient;
    }

    public BFFUsuarioDTO login(BFFLoginDTO dto) {
        try {
            return restClient.post()
                    .uri("/usuario/auth/login")
                    .body(dto)
                    .retrieve()
                    .body(BFFUsuarioDTO.class);
        } catch (HttpClientErrorException.Unauthorized e) {
            return null; // Login fallido
        } catch (HttpClientErrorException.NotFound e) {
            return null; // Usuario no encontrado
        }
    }

    // GET: Obtener todos los usuarios
    public List<BFFUsuarioDTO> obtenerTodosLosUsuarios() {
        BFFUsuarioDTO[] usuarios = restClient.get()
                .uri("/usuario")
                .retrieve()
                .body(BFFUsuarioDTO[].class);
        return usuarios != null ? Arrays.asList(usuarios) : List.of();
    }

    // GET: Obtener usuario por ID
    public BFFUsuarioDTO obtenerUsuarioPorId(int id) {
        try {
            return restClient.get()
                    .uri("/usuario/{id}", id)
                    .retrieve()
                    .body(BFFUsuarioDTO.class);
        } catch (HttpClientErrorException.NotFound e) {
            return null;
        }
    }

    // POST: Crear Usuario (Envía JSON automáticamente)
    public BFFUsuarioDTO crearUsuario(BFFRegistroDTO dto) {
        return restClient.post()
                .uri("/usuario")
                .body(dto) // Spring lo transforma a JSON gracias al header global
                .retrieve()
                .body(BFFUsuarioDTO.class);
    }

    // PUT: Actualizar Usuario
    public BFFUsuarioDTO actualizarUsuario(int id, BFFUsuarioDTO dto) {
        try {
            return restClient.put()
                    .uri("/usuario/{id}", id)
                    .body(dto)
                    .retrieve()
                    .body(BFFUsuarioDTO.class);
        } catch (HttpClientErrorException.NotFound e) {
            return null;
        }
    }

    // DELETE: Eliminar Usuario
    public boolean eliminarUsuario(int id) {
        try {
            restClient.delete()
                    .uri("/usuario/{id}", id)
                    .retrieve()
                    .toBodilessEntity();
            return true;
        } catch (HttpClientErrorException.NotFound e) {
            return false;
        }
    }
}
