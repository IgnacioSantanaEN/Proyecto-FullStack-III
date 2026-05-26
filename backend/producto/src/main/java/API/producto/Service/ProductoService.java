package API.producto.Service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import API.producto.DTO.CreateProductoDTO;
import API.producto.DTO.ProductoDTO;
import API.producto.Model.Producto;
import API.producto.Repository.ProductoRepository;

@Service
public class ProductoService {
    @Autowired
    private ProductoRepository repository;

    

    public List<ProductoDTO> getAll(Integer userId, String role) {
        List<Producto> productos;
        if (role != null && role.equalsIgnoreCase("admin")) {
            productos = repository.findAll();
        } else if (userId != null) {
            productos = repository.findByOwnerId(userId);
        } else {
            productos = repository.findAll();
        }
        return productos.stream()
                .map(ProductoMapper::toDTO)
                .collect(Collectors.toList());
    }

    public ProductoDTO getById(int id) {
        Producto p = repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Producto no encontrado"));
        return ProductoMapper.toDTO(p);
    }

    public ProductoDTO create(CreateProductoDTO dto, Integer userId) {
        Producto p = ProductoMapper.toEntity(dto);
        p.setOwnerId(userId);
        Producto saved = repository.save(p);
        return ProductoMapper.toDTO(saved);
    }

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

    public void delete(int id) {
        if (!repository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Producto no encontrado");
        }
        repository.deleteById(id);
    }

}
