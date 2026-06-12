package API.pedido.Repository;

import org.springframework.data.jpa.repository.JpaRepository;

import API.pedido.Model.Pedido;

public interface PedidoRepository extends JpaRepository<Pedido, Integer>{

}
