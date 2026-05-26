package API.producto.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import API.producto.Model.Producto;

@Repository
public interface ProductoRepository extends JpaRepository<Producto, Integer> {

}