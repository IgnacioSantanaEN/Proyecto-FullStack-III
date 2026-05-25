package API.producto.Service;

import API.producto.DTO.CreatePedidoDTO;
import API.producto.DTO.PedidoDTO;
import API.producto.Model.Pedido;

public class PedidoMapper {

    public static PedidoDTO toDTO(Pedido pedido) {
        if (pedido == null) return null;
        PedidoDTO dto = new PedidoDTO();
        dto.setId(pedido.getId());
        dto.setOrderNumber(pedido.getOrderNumber());
        dto.setCliente(pedido.getCliente());
        dto.setEstado(pedido.getEstado());
        dto.setFecha(pedido.getFecha());
        dto.setMonto(pedido.getMonto());
        dto.setItems(pedido.getItems());
        return dto;
    }

    public static Pedido toEntity(CreatePedidoDTO dto) {
        if (dto == null) return null;
        Pedido pedido = new Pedido();
        pedido.setOrderNumber(dto.getOrderNumber());
        pedido.setCliente(dto.getCliente());
        pedido.setEstado(dto.getEstado());
        pedido.setFecha(dto.getFecha());
        pedido.setMonto(dto.getMonto());
        pedido.setItems(dto.getItems());
        return pedido;
    }
}
