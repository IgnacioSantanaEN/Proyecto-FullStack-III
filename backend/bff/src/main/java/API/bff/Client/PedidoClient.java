package API.bff.Client;

import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestClient;

import API.bff.DTO.Integration.Pedido.BFFPedidoDTO;

@Component
public class PedidoClient {
    
    private final RestClient restClient;

    public PedidoClient(RestClient.Builder builder, @Value("${microservicio.pedido.url}") String pedidoUrl) {
        this.restClient = builder.baseUrl(pedidoUrl).build();
    }

    public List<BFFPedidoDTO> obtenerTodosLosPedidos() {
        BFFPedidoDTO[] pedidos = restClient.get()
                .uri("/api/pedido")
                .retrieve()
                .body(BFFPedidoDTO[].class);
        return pedidos != null ? Arrays.asList(pedidos) : List.of();
    }

    public BFFPedidoDTO obtenerPedidoPorId(int id) {
        return restClient.get()
                .uri("/api/pedido/{id}", id)
                .retrieve()
                .body(BFFPedidoDTO.class);
    }

    public BFFPedidoDTO crearPedido(BFFPedidoDTO dto) {
        return restClient.post()
                .uri("/api/pedido")
                .contentType(MediaType.APPLICATION_JSON)
                .body(dto)
                .retrieve()
                .body(BFFPedidoDTO.class);
    }

    public BFFPedidoDTO actualizarPedido(int id, BFFPedidoDTO dto) {
        return restClient.put()
                .uri("/api/pedido/{id}", id)
                .contentType(MediaType.APPLICATION_JSON)
                .body(dto)
                .retrieve()
                .body(BFFPedidoDTO.class);
    }

    public boolean eliminarPedido(int id) {
        try {
            restClient.delete()
                .uri("/api/pedido/{id}", id)
                .retrieve()
                .toBodilessEntity();
            return true;
        } catch (HttpClientErrorException.NotFound e) {
            return false;
        } catch (HttpClientErrorException e) {
            return false;
        }
    }
}
