package API.producto.DTO;

import lombok.Data;

@Data
public class ProductoDTO {
    private String name;
    private String sku;
    private String categoria;
    private double stock;
    private String estado;
    private String marca;
    private double precio;
}