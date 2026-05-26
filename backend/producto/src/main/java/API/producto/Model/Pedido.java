package API.producto.Model;

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
    private String orderNumber;
    @Column(name = "nom_cli")
    private String cliente;
    @Column(name = "estado")
    private String estado;
    @Column(name = "monto")
    private String monto;
    @Column(name = "items")
    private int items;
    @Column(name = "owner_id")
    private Integer ownerId;
}
