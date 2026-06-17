package API.bff.DTO.Integration.Usuario;

import lombok.Data;

@Data
public class BFFRegistroDTO {
    private String name;
    private String email;
    private String password;
    private String role;
}
