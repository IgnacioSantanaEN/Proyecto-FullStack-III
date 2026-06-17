package API.bff.Controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import API.bff.Client.PedidoClient;
import API.bff.DTO.Integration.Pedido.BFFPedidoDTO;

@RestController
@RequestMapping("/api/bff/pedido")
public class PedidoControllerBff {
    
    private final PedidoClient pedidoClient;

    public PedidoControllerBff(PedidoClient pedidoClient) {
        this.pedidoClient = pedidoClient;
    }

    @GetMapping
    public ResponseEntity<List<BFFPedidoDTO>> listarTodosLosPedidos() {
        List<BFFPedidoDTO> pedidos = pedidoClient.obtenerTodosLosPedidos();
        return ResponseEntity.ok(pedidos);
    }

    @GetMapping("/{id}")
    public ResponseEntity<BFFPedidoDTO> buscarPedidoPorId(@PathVariable int id) {
        BFFPedidoDTO pedido = pedidoClient.obtenerPedidoPorId(id);
        if (pedido == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(pedido);
    }

    @PostMapping
    public ResponseEntity<BFFPedidoDTO> registrarNuevoPedido(@RequestBody BFFPedidoDTO bffPedidoDTO) {
        BFFPedidoDTO creado = pedidoClient.crearPedido(bffPedidoDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(creado);
    }

    @PutMapping("/{id}")
    public ResponseEntity<BFFPedidoDTO> modificarPedido(@PathVariable int id, @RequestBody BFFPedidoDTO bffPedidoDTO) {
        BFFPedidoDTO actualizado = pedidoClient.actualizarPedido(id, bffPedidoDTO);
        if (actualizado == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(actualizado);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> removerPedido(@PathVariable int id) {
        boolean eliminado = pedidoClient.eliminarPedido(id);
        if (!eliminado) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.noContent().build();
    }
}
