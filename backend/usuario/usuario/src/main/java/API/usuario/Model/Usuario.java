package API.usuario.Model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


/*
    Este archivo contiene el modelo de datos
    que se envia a la base de datos 
*/


@Entity
@AllArgsConstructor
@NoArgsConstructor
@Data

@Table(name = "usuario")
public class Usuario {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    @Column(name = "nombre")
    private String name;
    @Column(name = "apellido")
    private String lastname;
    @Column(name = "contrasena")
    private String password;
    @Column(name = "email")
    private String email;
    @Column(name = "rol")
    private String role;

    public int getId() {
        return id;
    }

    public void getInfo() {
        System.out.println("ID: " + id);
        System.out.println("Nombre: " + name);
        System.out.println("Apellido: " + lastname);
        System.out.println("Email: " + email);
        System.out.println("Rol: " + role);
    }
}
