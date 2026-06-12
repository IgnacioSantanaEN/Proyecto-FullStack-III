package API.pedido.Controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import API.pedido.DTO.PedidoDTO;
import API.pedido.Service.PedidoService;

@RestController
@RequestMapping("/api/pedido")
public class PedidoController {
    
    private final PedidoService pedidoService;

    public PedidoController(PedidoService pedidoService) {
        this.pedidoService = pedidoService;
    }

    @GetMapping("/health")
    public ResponseEntity<String> health() {
        boolean ok = pedidoService.isHealthy();
        if (ok) {
            return ResponseEntity.ok("La conexión es estable, Pedido API!");
        } else {
            return ResponseEntity.status(503).body("Conexión a la base de datos no disponible");
        }
    }

    @GetMapping
    public ResponseEntity<List<PedidoDTO>> getAllPedidos() {
        List<PedidoDTO> pedidos = pedidoService.getAllPedidos();
        return ResponseEntity.ok(pedidos);
    }

    @GetMapping("/{id}")
    public ResponseEntity<PedidoDTO> getPedidoById(int id) {
        PedidoDTO pedido = pedidoService.getPedidoById(id);
        if (pedido == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(pedido);
    }

    @PostMapping
    public ResponseEntity<PedidoDTO> createPedido(PedidoDTO pedidoDTO) {
        PedidoDTO createdPedido = pedidoService.createPedido(pedidoDTO);
        return ResponseEntity.ok(createdPedido);
    }

    @PutMapping("/{id}")
    public ResponseEntity<PedidoDTO> updatePedido(int id, PedidoDTO pedidoDTO) {
        PedidoDTO updatedPedido = pedidoService.updatePedido(id, pedidoDTO);
        if (updatedPedido == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(updatedPedido);
    }

     @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePedido(int id) {
        boolean deleted = pedidoService.deletePedido(id);
        if (!deleted) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.noContent().build();
    }
}
