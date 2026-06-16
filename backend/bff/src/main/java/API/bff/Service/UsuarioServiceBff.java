package API.bff.Service;

import java.util.List;

import org.springframework.stereotype.Service;

import API.bff.Client.UsuarioClient;
import API.bff.DTO.Integration.Usuario.BFFLoginDTO;
import API.bff.DTO.Integration.Usuario.BFFRegistroDTO;
import API.bff.DTO.Integration.Usuario.BFFUsuarioDTO;

@Service
public class UsuarioServiceBff {

    private final UsuarioClient usuarioClient;

    public UsuarioServiceBff(UsuarioClient usuarioClient) {
        this.usuarioClient = usuarioClient;
    }

    public BFFUsuarioDTO login(BFFLoginDTO dto) {
        return usuarioClient.login(dto);
    }

    public List<BFFUsuarioDTO> obtenerTodosLosUsuarios() {
        return usuarioClient.obtenerTodosLosUsuarios();
    }

    public BFFUsuarioDTO obtenerUsuarioPorId(int id) {
        return usuarioClient.obtenerUsuarioPorId(id);
    }

    public BFFUsuarioDTO crearUsuario(BFFRegistroDTO dto) {
        return usuarioClient.crearUsuario(dto);
    }

    public BFFUsuarioDTO actualizarUsuario(int id, BFFUsuarioDTO dto) {
        return usuarioClient.actualizarUsuario(id, dto);
    }

    public boolean eliminarUsuario(int id) {
        return usuarioClient.eliminarUsuario(id);
    }
}
