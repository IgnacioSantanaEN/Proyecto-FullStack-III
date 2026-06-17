package API.bff.Client;

import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Component;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestClient;

import API.bff.DTO.Integration.UsuarioDTO;

@Component
public class UsuarioClient {
    
    private final RestClient restClient;

    // Inyectamos el bean configurado específicamente para usuarios
    public UsuarioClient(@Qualifier("usuarioRestClient") RestClient restClient) {
        this.restClient = restClient;
    }

    // GET: Obtener todos los usuarios
    public List<UsuarioDTO> obtenerTodosLosUsuarios() {
        UsuarioDTO[] usuarios = restClient.get()
                .uri("/usuario") // endpoint singular español en el microservicio de usuarios
                .retrieve()
                .body(UsuarioDTO[].class);
        return usuarios != null ? Arrays.asList(usuarios) : List.of();
    }

    // GET: Obtener usuario por ID
    public UsuarioDTO obtenerUsuarioPorId(int id) {
        try {
            return restClient.get()
                    .uri("/usuario/{id}", id)
                    .retrieve()
                    .body(UsuarioDTO.class);
        } catch (HttpClientErrorException.NotFound e) {
            return null;
        }
    }

    // POST: Crear Usuario (Envía JSON automáticamente)
    public UsuarioDTO crearUsuario(UsuarioDTO dto) {
        return restClient.post()
                .uri("/usuario")
                .body(dto) // Spring lo transforma a JSON gracias al header global
                .retrieve()
                .body(UsuarioDTO.class);
    }

    // PUT: Actualizar Usuario
    public UsuarioDTO actualizarUsuario(int id, UsuarioDTO dto) {
        try {
            return restClient.put()
                    .uri("/usuario/{id}", id)
                    .body(dto)
                    .retrieve()
                    .body(UsuarioDTO.class);
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
