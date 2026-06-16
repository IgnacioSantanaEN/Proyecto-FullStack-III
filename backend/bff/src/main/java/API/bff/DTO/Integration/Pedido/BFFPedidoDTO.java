package API.bff.DTO.Integration.Pedido;

import lombok.Data;

@Data
public class BFFPedidoDTO {
    private int orderNumber;
    private String client;
    private String status;
    private String monto;
    private int items;
    private int idCliente;
}
