package API.usuario.Repository;

import org.springframework.data.jpa.repository.JpaRepository;

import API.usuario.Model.Usuario;

/* Repositorio para la entidad Usuario */
public interface UsuarioRepository extends JpaRepository<Usuario, Integer> {
    /* Funcion para encontrar por email teniendo como argumento el elemento email de Usuario */
    public Usuario findByEmail(String email);

    /* Funcion para encontrar por nombre teniendo como argumento el elemento name de Usuario */
    public Usuario findByName(String name);

    /* Funcion para encontrar por rol teniendo como argumento el elemento role de Usuario */
    public Usuario findByRole(String role);
}
