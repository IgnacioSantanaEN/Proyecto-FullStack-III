package API.producto.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import API.producto.Model.Producto;

public interface ProductoRepository extends JpaRepository<Producto, Integer> {
    List<Producto> findByOwnerId(Integer ownerId);
}