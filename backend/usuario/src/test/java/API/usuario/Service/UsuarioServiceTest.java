package API.usuario.Service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.util.Arrays;
import java.util.List;


import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import API.usuario.Model.Usuario;
import API.usuario.Repository.UsuarioRepository;

public class UsuarioServiceTest {

	@ExtendWith(MockitoExtension.class)
	static class Base {
		@Mock
		UsuarioRepository usuarioRepository;

		@InjectMocks
		UsuarioService usuarioService;
	}

	@Test
	void testGetAllUsuarios() {
		Usuario u1 = new Usuario(1, "Alice", "p1", "a@a.com", "USER");
		Usuario u2 = new Usuario(2, "Bob", "p2", "b@b.com", "ADMIN");
		UsuarioRepository repo = mock(UsuarioRepository.class);
		when(repo.findAll()).thenReturn(Arrays.asList(u1, u2));

		UsuarioService service = new UsuarioService(repo);
		List<Usuario> result = service.getAllUsuarios();

		assertEquals(2, result.size());
		assertTrue(result.contains(u1));
		verify(repo).findAll();
	}
}
