package API.bff.Service;

import org.springframework.stereotype.Service;

import API.bff.Client.PedidoClient;

@Service
public class PedidoService {
    
    private final PedidoClient pedidoClient;

    public PedidoService(PedidoClient pedidoClient) {
        this.pedidoClient = pedidoClient;
    }

    public Object obtenerTodosLosPedidos() {
        return pedidoClient.obtenerTodosLosPedidos();
    }

    public Object obtenerPedidoPorId(int id) {
        return pedidoClient.obtenerPedidoPorId(id);
    }

    public Object crearPedido(Object dto) {
        return pedidoClient.crearPedido((API.bff.DTO.Integration.PedidoDTO) dto);
    }

    public Object actualizarPedido(int id, Object dto) {
        return pedidoClient.actualizarPedido(id, (API.bff.DTO.Integration.PedidoDTO) dto);
    }

    public Object eliminarPedido(int id) {
        return pedidoClient.eliminarPedido(id);
    }
}
