package API.producto.Service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import API.producto.DTO.CategoriaDTO;
import API.producto.Model.Categoria;
import API.producto.Repository.CategoriaRepository;

@Service
public class CategoriaService {
    @Autowired
    private CategoriaRepository repository;

    public List<CategoriaDTO> getAll() {
        return repository.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public CategoriaDTO getById(int id) {
        Categoria c = repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Categoría no encontrada"));
        return toDTO(c);
    }

    public CategoriaDTO create(CategoriaDTO dto) {
        if (repository.findByNombre(dto.getNombre()) != null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "La categoría ya existe");
        }
        Categoria c = new Categoria(dto.getNombre(), dto.getDescripcion());
        Categoria saved = repository.save(c);
        return toDTO(saved);
    }

    public CategoriaDTO update(int id, CategoriaDTO dto) {
        Categoria existing = repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Categoría no encontrada"));
        existing.setNombre(dto.getNombre());
        existing.setDescripcion(dto.getDescripcion());
        Categoria saved = repository.save(existing);
        return toDTO(saved);
    }

    public void delete(int id) {
        if (!repository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Categoría no encontrada");
        }
        repository.deleteById(id);
    }

    private CategoriaDTO toDTO(Categoria c) {
        return new CategoriaDTO(c.getId(), c.getNombre(), c.getDescripcion());
    }
}
