package API.bff.DTO.Integration;

import lombok.Data;

@Data
public class UsuarioDTO {
    private int id;
    private String name;
    private String email;
    private String password;
}
