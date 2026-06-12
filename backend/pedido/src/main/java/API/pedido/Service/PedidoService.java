package API.pedido.Service;

import java.util.List;
import java.util.stream.Collectors;

import API.pedido.DTO.PedidoDTO;
import API.pedido.Model.Pedido;
import API.pedido.Repository.PedidoRepository;

public class PedidoService {
    
    private final PedidoRepository pedidoRepository;

    public PedidoService(PedidoRepository pedidoRepository) {
        this.pedidoRepository = pedidoRepository;
    }

    public List<PedidoDTO> getAllPedidos() {
        List<Pedido> pedidos = pedidoRepository.findAll();
        return pedidos.stream()
                .map(PedidoMapper::toDTO)
                .collect(Collectors.toList());
    }

    public PedidoDTO getPedidoById(int id) {
        Pedido pedido = pedidoRepository.findById(id).orElse(null);
        if (pedido == null) {
            return null;
        }
        return PedidoMapper.toDTO(pedido);
    }

    public PedidoDTO createPedido(PedidoDTO pedidoDTO) {
        Pedido pedido = PedidoMapper.toEntity(pedidoDTO);
        Pedido savedPedido = pedidoRepository.save(pedido);
        return PedidoMapper.toDTO(savedPedido);
    }

    public PedidoDTO updatePedido(int id, PedidoDTO pedidoDTO) {
        Pedido pedido = pedidoRepository.findById(id).orElse(null);
        if (pedido == null) {
            return null;
        }
        // Mantener el ID existente y aplicar los cambios del DTO
        Pedido updatedEntity = PedidoMapper.toEntity(pedidoDTO);
        updatedEntity.setId(pedido.getId());
        Pedido updatedPedido = pedidoRepository.save(updatedEntity);
        return PedidoMapper.toDTO(updatedPedido);
    }

    public boolean deletePedido(int id) {
        if (!pedidoRepository.existsById(id)) {
            return false;
        }
        pedidoRepository.deleteById(id);
        return true;
    }

    public boolean isHealthy() {
        try {
            // Intentar una operación sencilla para verificar conexión (no carga datos grandes)
            pedidoRepository.count();
            return true;
        } catch (Exception e) {
            return false;
        }
    }

}
