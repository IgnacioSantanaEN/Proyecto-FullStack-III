package API.bff.Service;

import org.springframework.stereotype.Service;

import API.bff.Client.ProductoClient;

@Service
public class ProductoService {
    
    private final ProductoClient productoClient;

    public ProductoService(ProductoClient productoClient) {
        this.productoClient = productoClient;
    }

    public Object obtenerTodosLosProductos() {
        return productoClient.obtenerTodosLosProductos();
    }

    public Object obtenerProductoPorId(int id) {
        return productoClient.obtenerProductoPorId(id);
    }

    public Object crearProducto(Object dto) {
        return productoClient.crearProducto((API.bff.DTO.Integration.ProductoDTO) dto);
    }

    public Object actualizarProducto(int id, Object dto) {
        return productoClient.actualizarProducto(id, (API.bff.DTO.Integration.ProductoDTO) dto);
    }

    public Object eliminarProducto(int id) {
        return productoClient.eliminarProducto(id);
    }
}
