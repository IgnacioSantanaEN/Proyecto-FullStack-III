package API.producto.Controller;

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

import API.producto.DTO.ProductoDTO;
import API.producto.Service.ProductoService;

@RestController
@RequestMapping("/api/producto")
public class ProductoController {

    private final ProductoService service;

    public ProductoController(ProductoService service) {
        this.service = service;
    }

    @GetMapping("/health")
    public ResponseEntity<String> health() {
        boolean ok = service.isHealthy();
        if (ok) {
            return ResponseEntity.ok("La conexión es estable, Producto API!");
        } else {
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body("Conexión a la base de datos no disponible");
        }
    }

    @GetMapping
    public List<ProductoDTO> getAll() {
        return service.getAll();
    }

    @GetMapping("/{id}")
    public ProductoDTO getOne(@PathVariable int id) {
        return service.getById(id);
    }

    @PostMapping
    public ResponseEntity<ProductoDTO> create(@RequestBody ProductoDTO dto) {
        ProductoDTO created = service.create(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    public ProductoDTO update(@PathVariable int id, @RequestBody ProductoDTO dto) {
        return service.update(id, dto);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable int id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }

}
