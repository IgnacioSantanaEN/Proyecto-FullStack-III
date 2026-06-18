package API.bff.Client;

import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

import API.bff.DTO.Integration.Producto.BFFProductoDTO;

@Component
public class ProductoClient {
    
    private final RestClient restClient;

    public ProductoClient(RestClient.Builder builder, @Value("${microservicio.producto.url}") String productoUrl) {
        this.restClient = builder.baseUrl(productoUrl).build();
    }

    public List<BFFProductoDTO> obtenerTodosLosProductos() {
        return restClient.get()
                .uri("/api/producto")
                .retrieve()
                .body(new ParameterizedTypeReference<List<BFFProductoDTO>>() {});
    }

    public BFFProductoDTO obtenerProductoPorId(int id) {
        return restClient.get()
                .uri("/api/producto/{id}", id)
                .retrieve()
                .body(BFFProductoDTO.class);
    }

    public BFFProductoDTO crearProducto(BFFProductoDTO dto) {
        return restClient.post()
                .uri("/api/producto")
                .contentType(MediaType.APPLICATION_JSON)
                .body(dto)
                .retrieve()
                .body(BFFProductoDTO.class);
    }

    public BFFProductoDTO actualizarProducto(int id, BFFProductoDTO dto) {
        return restClient.put()
                .uri("/api/producto/{id}", id)
                .contentType(MediaType.APPLICATION_JSON)
                .body(dto)
                .retrieve()
                .body(BFFProductoDTO.class);
    }

    public void eliminarProducto(int id) {
        restClient.delete()
            .uri("/api/producto/{id}", id)
            .retrieve()
            .toBodilessEntity();
    }
}
