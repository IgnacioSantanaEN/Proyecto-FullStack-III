package API.bff.Service;

import java.util.List;

import org.springframework.stereotype.Service;

import API.bff.Client.ProductoClient;
import API.bff.DTO.Integration.Producto.BFFProductoDTO;

@Service
public class ProductoService {
    
    private final ProductoClient client;

    public ProductoService(ProductoClient client) {
        this.client = client;
    }

    public List<BFFProductoDTO> getAllProductos() {
        return client.obtenerTodosLosProductos();
    }

    public BFFProductoDTO getProductoById(int id) {
        return client.obtenerProductoPorId(id);
    }

    public BFFProductoDTO createProducto(BFFProductoDTO dto) {
        return client.crearProducto(dto);
    }

    public BFFProductoDTO updateProducto(int id, BFFProductoDTO dto) {
        return client.actualizarProducto(id, dto);
    }

    public void deleteProducto(int id) {
        client.eliminarProducto(id);
    }

}
