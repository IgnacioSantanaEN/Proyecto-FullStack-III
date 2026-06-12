package API.pedido.DTO;

import lombok.Data;

@Data
public class PedidoDTO {
    private int orderNumber;
    private String client;
    private String status;
    private String monto;
    private int items;
    private int idCliente;
}
