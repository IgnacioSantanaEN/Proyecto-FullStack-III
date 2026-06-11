package API.pedido.Model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@Entity
@Table(name = "pedido")
public class Pedido {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    @Column(name = "id_pedido")
    private String orderNumber;
    @Column(name = "nom_cli")
    private String cliente;
    @Column(name = "estado")
    private String estado;
    @Column(name = "monto")
    private int monto;
    @Column(name = "items")
    private int items;
    @Column(name = "id_cliente")
    private int id_owner;
}
