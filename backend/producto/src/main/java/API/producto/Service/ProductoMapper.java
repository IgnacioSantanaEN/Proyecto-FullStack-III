package API.producto.Service;

import API.producto.DTO.CreateProductoDTO;
import API.producto.DTO.ProductoDTO;
import API.producto.Model.Producto;

public class ProductoMapper {

    // Método para convertir de CreateProductoDTO a Producto (útil para creación)
    public static Producto toEntity(CreateProductoDTO dto) {
        if (dto == null) return null;
        Producto producto = new Producto();
        producto.setName(dto.getName());
        producto.setSku(dto.getSku());
        producto.setCategoria(dto.getCategoria());
        producto.setStock(dto.getStock());
        producto.setEstado(dto.getEstado());
        producto.setMarca(dto.getMarca());
        producto.setPrecio(dto.getPrecio());
        return producto;
    }

    // Método para convertir de ProductoDTO a Producto (útil para update)
    public static Producto toEntity(ProductoDTO dto) {
        if (dto == null) return null;
        Producto producto = new Producto();
        producto.setId(dto.getId());
        producto.setName(dto.getName());
        producto.setSku(dto.getSku());
        producto.setCategoria(dto.getCategoria());
        producto.setStock(dto.getStock());
        producto.setEstado(dto.getEstado());
        producto.setMarca(dto.getMarca());
        producto.setPrecio(dto.getPrecio());
        return producto;
    }

    // Método para convertir de Producto a ProductoDTO
    public static ProductoDTO toDTO(Producto p) {
        if (p == null) return null;
        ProductoDTO dto = new ProductoDTO();
        dto.setId(p.getId());
        dto.setName(p.getName());
        dto.setSku(p.getSku());
        dto.setCategoria(p.getCategoria());
        dto.setStock(p.getStock());
        dto.setEstado(p.getEstado());
        dto.setMarca(p.getMarca());
        dto.setPrecio(p.getPrecio());
        return dto;
    }
}
