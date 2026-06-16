package API.bff.DTO.Integration.Usuario;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class BFFLoginDTO {
    @NotBlank(message = "El email es obligatorio")
    private String email;
    
    @NotBlank(message = "La contraseña es obligatoria")
    private String password;
}
