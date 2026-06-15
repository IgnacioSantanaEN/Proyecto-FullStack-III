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

import API.bff.DTO.Integration.PedidoDTO;

@Component
public class PedidoClient {
    
    private final RestClient restClient;

    public PedidoClient(@Qualifier("pedidoRestClient") RestClient restClient) {
        this.restClient = restClient;
    }

    public List<PedidoDTO> obtenerTodosLosPedidos() {
        PedidoDTO[] pedidos = restClient.get()
                .uri("/pedido")
                .retrieve()
                .body(PedidoDTO[].class);
        return pedidos != null ? Arrays.asList(pedidos) : List.of();
    }

    public PedidoDTO obtenerPedidoPorId(int id) {
        return restClient.get()
                .uri("/pedido/{id}", id)
                .retrieve()
                .body(PedidoDTO.class);
    }

    public PedidoDTO crearPedido(PedidoDTO dto) {
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
                .body(PedidoDTO.class);
    }

    public PedidoDTO actualizarPedido(int id, PedidoDTO dto) {
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
                .body(PedidoDTO.class);
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
