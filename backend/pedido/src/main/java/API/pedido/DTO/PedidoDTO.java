package API.pedido.DTO;

import lombok.Data;

@Data
public class PedidoDTO {
    private String orderNumber;
    private String name;
    private String status;
    private int monto;
    private int items;
    private int id_owner;
}
