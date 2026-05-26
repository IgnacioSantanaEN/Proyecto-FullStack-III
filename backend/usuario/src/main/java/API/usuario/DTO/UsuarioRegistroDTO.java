package API.usuario.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.validation.constraints.NotBlank;


/* Aqui se encuentra el modelo de datos para el registro de usuarios */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class UsuarioRegistroDTO {
    @NotBlank(message = "El nombre es obligatorio")
    private String name;
    @NotBlank(message = "La contraseña es obligatoria")
    private String password;
    @NotBlank(message = "El email es obligatorio")
    private String email;
    private String role;
}
