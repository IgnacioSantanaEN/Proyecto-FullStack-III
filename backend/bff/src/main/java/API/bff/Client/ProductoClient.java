package API.bff.Client;

import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Component;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestClient;

import API.bff.DTO.Integration.ProductoDTO;

@Component
public class ProductoClient {
    private final RestClient restClient;

    // Inyectamos el bean configurado específicamente para productos
    public ProductoClient(@Qualifier("productoRestClient") RestClient restClient) {
        this.restClient = restClient;
    }

    // GET: Obtener todos los productos
    public List<ProductoDTO> obtenerTodosLosProductos() {
        ProductoDTO[] productos = restClient.get()
            .uri("/producto")
                .retrieve()
                .body(ProductoDTO[].class);
        return productos != null ? Arrays.asList(productos) : List.of();
    }

    // GET: Obtener producto por ID
    public ProductoDTO obtenerProductoPorId(int id) {
        try {
                return restClient.get()
                    .uri("/producto/{id}", id)
                    .retrieve()
                    .body(ProductoDTO.class);
        } catch (HttpClientErrorException.NotFound e) {
            return null;
        }
    }

    // POST: Crear Producto
    public ProductoDTO crearProducto(ProductoDTO dto) {
        // Mantener compatibilidad: llamar al método con userId=0 por defecto
        return crearProducto(dto, 0);
    }

    // POST: Crear Producto con userId (el microservicio espera `userId` como RequestParam)
    public ProductoDTO crearProducto(ProductoDTO dto, int userId) {
        return restClient.post()
                .uri(uriBuilder -> uriBuilder.path("/producto").queryParam("userId", userId).build())
                .body(dto)
                .retrieve()
                .body(ProductoDTO.class);
    }

    // PUT: Actualizar Producto
    public ProductoDTO actualizarProducto(int id, ProductoDTO dto) {
        try {
            return restClient.put()
                    .uri("/productos/{id}", id)
                    .body(dto)
                    .retrieve()
                    .body(ProductoDTO.class);
        } catch (HttpClientErrorException.NotFound e) {
            return null;
        }
    }

    // DELETE: Eliminar Producto
    public boolean eliminarProducto(int id) {
        try {
            restClient.delete()
                    .uri("/productos/{id}", id)
                    .retrieve()
                    .toBodilessEntity();
            return true;
        } catch (HttpClientErrorException.NotFound e) {
            return false;
        }
    }
}
