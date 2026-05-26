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

    public List<ProductoDTO> getAll() {
        return repository.findAll().stream()
                .map(ProductoMapper::toDTO)
                .collect(Collectors.toList());
    }

    public ProductoDTO getById(int id) {
        Producto p = repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Producto no encontrado"));
        return ProductoMapper.toDTO(p);
    }

    public ProductoDTO create(CreateProductoDTO dto) {
        Producto p = ProductoMapper.toEntity(dto);
        Producto saved = repository.save(p);
        return ProductoMapper.toDTO(saved);
    }

    public ProductoDTO update(int id, ProductoDTO dto) {
        Producto existing = repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Producto no encontrado"));
        // actualizar campos
        existing.setName(dto.getName());
        existing.setStock(dto.getStock());
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
