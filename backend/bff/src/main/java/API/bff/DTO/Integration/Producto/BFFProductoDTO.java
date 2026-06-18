package API.bff.DTO.Integration.Producto;

import lombok.Data;

@Data
public class BFFProductoDTO {
    private String name;
    private String sku;
    private String categoria;
    private double stock;
    private String estado;
    private String marca;
    private double precio;
}
