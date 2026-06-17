package API.pedido.DTO;

import lombok.Data;

@Data
public class PedidoDTO {
    private int orderNumber;
    private String client;
    private String status;
    private Double total;
    private int items;
    private int idCliente;
}
