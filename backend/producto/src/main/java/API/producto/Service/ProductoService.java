package API.producto.Service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import API.producto.DTO.CreateProductoDTO;
import API.producto.DTO.ProductoDTO;
import API.producto.Model.Categoria;
import API.producto.Model.Producto;
import API.producto.Repository.CategoriaRepository;
import API.producto.Repository.ProductoRepository;

@Service
public class ProductoService {
    @Autowired
    private ProductoRepository repository;

    @Autowired
    private CategoriaRepository categoriaRepository;

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
        Categoria categoria = categoriaRepository.findById(dto.getCategoriaId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Categoría no encontrada"));
        Producto p = ProductoMapper.toEntity(dto);
        p.setCategoriaEntity(categoria);
        p.setOwnerId(userId);
        Producto saved = repository.save(p);
        return ProductoMapper.toDTO(saved);
    }

    public ProductoDTO update(int id, ProductoDTO dto) {
        Producto existing = repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Producto no encontrado"));
        existing.setName(dto.getName());
        existing.setSku(dto.getSku());
        if (dto.getCategoriaId() > 0) {
            Categoria categoria = categoriaRepository.findById(dto.getCategoriaId())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Categoría no encontrada"));
            existing.setCategoriaEntity(categoria);
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
