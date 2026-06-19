package API.bff.Controller;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import API.bff.DTO.Integration.Producto.BFFProductoDTO;
import API.bff.Service.ProductoService;

@RestController
@RequestMapping("/api/bff/producto")
@CrossOrigin(origins = "http://localhost:5173")
public class ProductoControllerBff {
    
    private final ProductoService productoService;
    
    public ProductoControllerBff(ProductoService productoService) {
        this.productoService = productoService;
    }

    @GetMapping
    public List<BFFProductoDTO> getAllProductos() {
        return productoService.getAllProductos();
    }

    @GetMapping("/{id}")
    public BFFProductoDTO getProductoById(@PathVariable int id) {
        return productoService.getProductoById(id);
    }

    @PostMapping
    public BFFProductoDTO createProducto(@RequestBody BFFProductoDTO dto) {
        return productoService.createProducto(dto);
    }

    @PutMapping("/{id}")
    public BFFProductoDTO updateProducto(@PathVariable int id, @RequestBody BFFProductoDTO dto) {
        return productoService.updateProducto(id, dto);
    }

    @DeleteMapping("/{id}")
    public void deleteProducto(@PathVariable int id) {
        productoService.deleteProducto(id);
    }
}
