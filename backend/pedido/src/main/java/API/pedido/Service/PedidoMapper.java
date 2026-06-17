package API.pedido.Service;

import API.pedido.DTO.PedidoDTO;
import API.pedido.Model.Pedido;

public class PedidoMapper {
    
    public static PedidoDTO toDTO(Pedido pedido) {
        PedidoDTO dto = new PedidoDTO();
        dto.setOrderNumber(pedido.getOrderNumber());
        dto.setClient(pedido.getClient());
        dto.setStatus(pedido.getStatus());
        dto.setTotal(pedido.getTotal());
        dto.setItems(pedido.getItems());
        dto.setIdCliente(pedido.getIdCliente());
        return dto;
    }

    public static Pedido toEntity(PedidoDTO pedidoDTO) {
        Pedido pedido = new Pedido();
        pedido.setOrderNumber(pedidoDTO.getOrderNumber());
        pedido.setClient(pedidoDTO.getClient());
        pedido.setStatus(pedidoDTO.getStatus());
        pedido.setTotal(pedidoDTO.getTotal());
        pedido.setItems(pedidoDTO.getItems());
        pedido.setIdCliente(pedidoDTO.getIdCliente());
        return pedido;
    }
}
