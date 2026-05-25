package API.producto.Service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import API.producto.DTO.CreatePedidoDTO;
import API.producto.DTO.PedidoDTO;
import API.producto.Model.Pedido;
import API.producto.Repository.PedidoRepository;

@Service
public class PedidoService {

    @Autowired
    private PedidoRepository repository;

    public List<PedidoDTO> getAll(Integer userId, String role) {
        List<Pedido> pedidos;
        if (role != null && role.equalsIgnoreCase("admin")) {
            pedidos = repository.findAll();
        } else if (userId != null) {
            pedidos = repository.findByOwnerId(userId);
        } else {
            pedidos = repository.findAll();
        }
        return pedidos.stream()
            .map(PedidoMapper::toDTO)
            .collect(Collectors.toList());
    }

    public PedidoDTO getById(int id) {
        Pedido pedido = repository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Pedido no encontrado"));
        return PedidoMapper.toDTO(pedido);
    }

    public PedidoDTO create(CreatePedidoDTO dto, Integer userId) {
        Pedido pedido = PedidoMapper.toEntity(dto);
        pedido.setOwnerId(userId);
        if (pedido.getOrderNumber() == null || pedido.getOrderNumber().isBlank()) {
            pedido.setOrderNumber(generateOrderNumber());
        }
        Pedido saved = repository.save(pedido);
        if (saved.getOrderNumber() == null || saved.getOrderNumber().isBlank()) {
            saved.setOrderNumber("PED-" + saved.getId());
            repository.save(saved);
        }
        return PedidoMapper.toDTO(saved);
    }

    public PedidoDTO update(int id, PedidoDTO dto) {
        Pedido existing = repository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Pedido no encontrado"));
        existing.setOrderNumber(dto.getOrderNumber());
        existing.setCliente(dto.getCliente());
        existing.setEstado(dto.getEstado());
        existing.setFecha(dto.getFecha());
        existing.setMonto(dto.getMonto());
        existing.setItems(dto.getItems());
        Pedido saved = repository.save(existing);
        return PedidoMapper.toDTO(saved);
    }

    public void delete(int id) {
        if (!repository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Pedido no encontrado");
        }
        repository.deleteById(id);
    }

    private String generateOrderNumber() {
        return "PED-" + (int) ((Math.random() * 9000) + 1000);
    }
}
