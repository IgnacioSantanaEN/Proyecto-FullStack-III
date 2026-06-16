package API.pedido.Model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Data
@Table(name = "pedido")
public class Pedido {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    @Column(name = "n_pedido")
    private int orderNumber;
    @Column(name = "nom_cli")
    private String client;
    @Column(name = "estado")
    private String status;
    @Column(name = "monto")
    private double total;
    @Column(name = "items")
    private int items;
    @Column(name = "id_cliente")
    private int idCliente;
}
