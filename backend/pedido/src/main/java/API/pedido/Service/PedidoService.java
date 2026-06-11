package API.pedido.Service;

import java.util.ArrayList;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.stereotype.Service;

import API.pedido.DTO.PedidoDTO;
import API.pedido.Model.Pedido;
import API.pedido.Repository.PedidoRepository;

@Service
public class PedidoService {
    
    private final PedidoRepository pedidoRepository;

    public PedidoService(PedidoRepository pedidoRepository) {
        this.pedidoRepository = pedidoRepository;
    }

    // Métodos CRUD para Pedido
    public ResponseEntity<List<PedidoDTO>> getAllPedidos() {
        try {
            List<Pedido> pedidos = pedidoRepository.findAll();
            List<PedidoDTO> pedidosDTO = new ArrayList<>();
            for (Pedido pedido : pedidos) {
                pedidosDTO.add(convertToDTO(pedido));
            }
            return ResponseEntity.ok(pedidosDTO);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    public ResponseEntity<PedidoDTO> getPedidoById(int id) {
        try {
            Pedido pedido = pedidoRepository.findById(id);
            if (pedido == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
            }
            return ResponseEntity.ok(convertToDTO(pedido));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    public ResponseEntity<PedidoDTO> createPedido(PedidoDTO pedidoDTO) {
        try {
            Pedido pedido = new Pedido();
            pedido.setOrderNumber(pedidoDTO.getOrderNumber());
            pedido.setCliente(pedidoDTO.getName());
            pedido.setEstado(pedidoDTO.getStatus());
            pedido.setMonto(pedidoDTO.getMonto());
            pedido.setItems(pedidoDTO.getItems());
            pedido.setId_owner(pedidoDTO.getId_owner());
            Pedido savedPedido = pedidoRepository.save(pedido);
            return ResponseEntity.status(HttpStatus.CREATED).body(convertToDTO(savedPedido));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    public ResponseEntity<PedidoDTO> updatePedido(int id, PedidoDTO pedidoDTO) {
        try {
            Pedido existingPedido = pedidoRepository.findById(id);
            if (existingPedido == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
            }
            existingPedido.setOrderNumber(pedidoDTO.getOrderNumber());
            existingPedido.setCliente(pedidoDTO.getName());
            existingPedido.setEstado(pedidoDTO.getStatus());
            existingPedido.setMonto(pedidoDTO.getMonto());
            existingPedido.setItems(pedidoDTO.getItems());
            existingPedido.setId_owner(pedidoDTO.getId_owner());
            Pedido updatedPedido = pedidoRepository.save(existingPedido);
            return ResponseEntity.ok(convertToDTO(updatedPedido));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    public ResponseEntity<Void> deletePedido(int id) {
        try {
            Pedido existingPedido = pedidoRepository.findById(id);
            if (existingPedido == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
            }
            pedidoRepository.delete(existingPedido);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Método auxiliar para convertir Pedido a PedidoDTO
    private PedidoDTO convertToDTO(Pedido pedido) {
        PedidoDTO pedidoDTO = new PedidoDTO();
        pedidoDTO.setOrderNumber(pedido.getOrderNumber());
        pedidoDTO.setName(pedido.getCliente());
        pedidoDTO.setStatus(pedido.getEstado());
        pedidoDTO.setMonto(pedido.getMonto());
        pedidoDTO.setItems(pedido.getItems());
        pedidoDTO.setId_owner(pedido.getId_owner());
        return pedidoDTO;
    }
}
