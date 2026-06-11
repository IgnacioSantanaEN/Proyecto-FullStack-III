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

import API.producto.DTO.CreateProductoDTO;
import API.producto.DTO.ProductoDTO;
import API.producto.Service.ProductoService;

@RestController
@RequestMapping("/api/productos")
public class ProductoController {

    private final ProductoService service;

    public ProductoController(ProductoService service) {
        this.service = service;
    }

    @GetMapping
    public List<ProductoDTO> listAll(
            @RequestParam(required = false) Integer userId,
            @RequestParam(required = false) String role
    ) {
        return service.getAll(userId, role);
    }

    @GetMapping("/{id}")
    public ProductoDTO getOne(@PathVariable int id) {
        return service.getById(id);
    }

    @PostMapping
    public ResponseEntity<ProductoDTO> create(
            @RequestBody CreateProductoDTO dto,
            @RequestParam Integer userId
    ) {
        ProductoDTO created = service.create(dto, userId);
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
