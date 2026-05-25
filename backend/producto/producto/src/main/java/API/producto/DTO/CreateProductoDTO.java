package API.producto.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CreateProductoDTO {
    private String name;
    private double stock;
    private String marca;
    private double precio;
}
