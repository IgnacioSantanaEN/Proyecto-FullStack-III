package API.bff.Client;

import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestClient;

import API.bff.DTO.Integration.Pedido.BFFPedidoDTO;

@Component
public class PedidoClient {
    
    private final RestClient restClient;

    public PedidoClient(@Qualifier("pedidoRestClient") RestClient restClient) {
        this.restClient = restClient;
    }

    public List<BFFPedidoDTO> obtenerTodosLosPedidos() {
        BFFPedidoDTO[] pedidos = restClient.get()
                .uri("/pedido")
                .retrieve()
                .body(BFFPedidoDTO[].class);
        return pedidos != null ? Arrays.asList(pedidos) : List.of();
    }

    public BFFPedidoDTO obtenerPedidoPorId(int id) {
        return restClient.get()
                .uri("/pedido/{id}", id)
                .retrieve()
                .body(BFFPedidoDTO.class);
    }

    public BFFPedidoDTO crearPedido(BFFPedidoDTO dto) {
        MultiValueMap<String, String> formData = new LinkedMultiValueMap<>();
        formData.add("orderNumber", String.valueOf(dto.getOrderNumber()));
        formData.add("client", dto.getClient());
        formData.add("status", dto.getStatus());
        formData.add("monto", dto.getMonto());
        formData.add("items", String.valueOf(dto.getItems()));
        formData.add("idCliente", String.valueOf(dto.getIdCliente()));

        return restClient.post()
            .uri("/pedido")
                .contentType(MediaType.APPLICATION_FORM_URLENCODED)
                .body(formData)
                .retrieve()
                .body(BFFPedidoDTO.class);
    }

    public BFFPedidoDTO actualizarPedido(int id, BFFPedidoDTO dto) {
        MultiValueMap<String, String> formData = new LinkedMultiValueMap<>();
        formData.add("orderNumber", String.valueOf(dto.getOrderNumber()));
        formData.add("client", dto.getClient());
        formData.add("status", dto.getStatus());
        formData.add("monto", dto.getMonto());
        formData.add("items", String.valueOf(dto.getItems()));
        formData.add("idCliente", String.valueOf(dto.getIdCliente()));

        try{
            return restClient.put()
                .uri("/pedido/{id}", id)
                .contentType(MediaType.APPLICATION_FORM_URLENCODED)
                .body(formData)
                .retrieve()
                .body(BFFPedidoDTO.class);
        } catch (HttpClientErrorException.NotFound e) {
            return null;
        }
    }

    public boolean eliminarPedido(int id) {
    try {
        restClient.delete()
                .uri("/{id}", id)
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
