package API.producto.DTO;

import lombok.Data;

@Data
public class PedidoDTO {
    private int id;
    private String orderNumber;
    private String cliente;
    private String estado;
    private String fecha;
    private String monto;
    private int items;
}
