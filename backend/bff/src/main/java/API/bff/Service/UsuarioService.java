package API.bff.Service;

import org.springframework.stereotype.Service;

import API.bff.Client.UsuarioClient;

@Service
public class UsuarioService {
    
    private final UsuarioClient usuarioClient;

    public UsuarioService(UsuarioClient usuarioClient) {
        this.usuarioClient = usuarioClient;
    }

    public Object obtenerTodosLosUsuarios() {
        return usuarioClient.obtenerTodosLosUsuarios();
    }

    public Object obtenerUsuarioPorId(int id) {
        return usuarioClient.obtenerUsuarioPorId(id);
    }

    public Object crearUsuario(Object dto) {
        return usuarioClient.crearUsuario((API.bff.DTO.Integration.UsuarioDTO) dto);
    }

    public Object actualizarUsuario(int id, Object dto) {
        return usuarioClient.actualizarUsuario(id, (API.bff.DTO.Integration.UsuarioDTO) dto);
    }

    public Object eliminarUsuario(int id) {
        return usuarioClient.eliminarUsuario(id);
    }
}
