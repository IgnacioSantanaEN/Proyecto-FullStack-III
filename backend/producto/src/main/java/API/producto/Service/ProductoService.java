package API.producto.Service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import API.producto.DTO.ProductoDTO;
import API.producto.Model.Producto;
import API.producto.Repository.ProductoRepository;

// Ya no se inyecta por campo con @Autowired,
//  sino por constructor
@Service
public class ProductoService {
    
    private final ProductoRepository repository;

    public ProductoService(ProductoRepository repository) {
        this.repository = repository;
    }

    // Método para obtener todos los productos, con filtrado por usuario y rol
    public List<ProductoDTO> getAll() {
        List<Producto> productos = repository.findAll();
   
        return productos.stream()
                .map(ProductoMapper::toDTO)
                .collect(Collectors.toList());
    }

    // MÉTODO POST: Crear un producto siguiendo tu lógica de DTOs sin ID
    public ProductoDTO create(ProductoDTO dto) {
        // 1. El mapper convierte los campos del DTO a la entidad Producto
        Producto productoEntity = ProductoMapper.toEntity(dto);
        
        // 2. Se envía a la base de datos
        Producto saved = repository.save(productoEntity);
        
        // 3. Convertimos la entidad guardada de vuelta a DTO
        return ProductoMapper.toDTO(saved);
    }

    // Método para obtener un producto por su ID
    public ProductoDTO getById(int id) {
        Producto p = repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Producto no encontrado"));
        return ProductoMapper.toDTO(p);
    }

    // Método para actualizar un producto existente por su ID
    public ProductoDTO update(int id, ProductoDTO dto) {
        Producto existing = repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Producto no encontrado"));
        existing.setName(dto.getName());
        existing.setSku(dto.getSku());
        if (dto.getCategoria() != null && !dto.getCategoria().isBlank()) {
            existing.setCategoria(dto.getCategoria());
        }
        existing.setStock(dto.getStock());
        existing.setEstado(dto.getEstado());
        existing.setMarca(dto.getMarca());
        existing.setPrecio(dto.getPrecio());
        Producto saved = repository.save(existing);
        return ProductoMapper.toDTO(saved);
    }

    // Método para eliminar un producto por su ID
    public void delete(int id) {
        if (!repository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Producto no encontrado");
        }
        repository.deleteById(id);
    }

    public boolean isHealthy() {
        try {
            repository.count();
            return true;
        } catch (Exception e) {
            return false;
        }
    }

}
