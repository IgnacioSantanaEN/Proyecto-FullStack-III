package API.producto.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import API.producto.DTO.CreatePedidoDTO;
import API.producto.DTO.PedidoDTO;
import API.producto.Service.PedidoService;

@RestController
@RequestMapping("/api/pedidos")
public class PedidoController {

    @Autowired
    private PedidoService service;

    @GetMapping
    public List<PedidoDTO> listAll(
            @RequestParam(required = false) Integer userId,
            @RequestParam(required = false) String role
    ) {
        return service.getAll(userId, role);
    }

    @GetMapping("/{id}")
    public PedidoDTO getOne(@PathVariable int id) {
        return service.getById(id);
    }

    @PostMapping
    public ResponseEntity<PedidoDTO> create(
            @RequestBody CreatePedidoDTO dto,
            @RequestParam Integer userId
    ) {
        PedidoDTO created = service.create(dto, userId);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    public PedidoDTO update(@PathVariable int id, @RequestBody PedidoDTO dto) {
        return service.update(id, dto);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable int id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
