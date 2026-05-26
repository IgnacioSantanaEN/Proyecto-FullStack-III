package API.producto.Service;

import API.producto.DTO.CreateProductoDTO;
import API.producto.DTO.ProductoDTO;
import API.producto.Model.Producto;

public class ProductoMapper {

    public static Producto toEntity(CreateProductoDTO dto) {
        Producto p = new Producto();
        p.setName(dto.getName());
        p.setStock(dto.getStock());
        p.setMarca(dto.getMarca());
        p.setPrecio(dto.getPrecio());
        return p;
    }

    public static Producto toEntity(ProductoDTO dto) {
        Producto p = new Producto();
        p.setName(dto.getName());
        p.setStock(dto.getStock());
        p.setMarca(dto.getMarca());
        p.setPrecio(dto.getPrecio());
        return p;
    }

    public static ProductoDTO toDTO(Producto p) {
        if (p == null) return null;
        ProductoDTO dto = new ProductoDTO();
        dto.setName(p.getName());
        dto.setStock(p.getStock());
        dto.setMarca(p.getMarca());
        dto.setPrecio(p.getPrecio());
        return dto;
    }
}
