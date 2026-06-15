package API.pedido.Service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.Arrays;
import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import API.pedido.DTO.PedidoDTO;
import API.pedido.Model.Pedido;
import API.pedido.Repository.PedidoRepository;
import jakarta.inject.Inject;

@ExtendWith(MockitoExtension.class)
public class PedidoServiceTest {
    @Mock
    private PedidoRepository pedidoRepository;

    @Inject
    private PedidoService pedidoService;

    @BeforeEach
    public void setUp() {
        pedidoService = new PedidoService(pedidoRepository);
    }

    @Test
    void testGetAllPedidos_DeberiaDevolverListaDTO() {
        Pedido p1 = new Pedido();
        p1.setId(1);
        p1.setOrderNumber(1001);
        p1.setClient("Juan Perez");
        p1.setStatus("PENDIENTE");

        when(pedidoRepository.findAll()).thenReturn(Arrays.asList(p1));

        List<PedidoDTO> resultado = pedidoService.getAllPedidos();

        assertNotNull(resultado);
        assertEquals(1, resultado.size());
        assertEquals(1001, resultado.get(0).getOrderNumber());
        assertEquals("Juan Perez", resultado.get(0).getClient());
        verify(pedidoRepository, times(1)).findAll();
    }

    @Test
    void testGetPedidoById_CuandoExiste_DeberiaDevolverDTO() {
        Pedido pedidoFalso = new Pedido();
        pedidoFalso.setId(1);
        pedidoFalso.setOrderNumber(1001);
        pedidoFalso.setClient("Juan Perez");
        pedidoFalso.setStatus("PENDIENTE");

        when(pedidoRepository.findById(1)).thenReturn(java.util.Optional.of(pedidoFalso));

        PedidoDTO resultado = pedidoService.getPedidoById(1);

        assertNotNull(resultado);
        assertEquals(1001, resultado.getOrderNumber());
        assertEquals("Juan Perez", resultado.getClient());
        assertEquals("PENDIENTE", resultado.getStatus());
    }

    @Test
    void testGetPedidoById_CuandoNoExiste_DeberiaDevolverNull() {
        when(pedidoRepository.findById(999)).thenReturn(java.util.Optional.empty());

        PedidoDTO resultado = pedidoService.getPedidoById(999);

        assertEquals(null, resultado);
    }

    @Test
    void testCreatePedido_DeberiaGuardarYDevolverDTO() {
        PedidoDTO nuevoPedidoDTO = new PedidoDTO();
        nuevoPedidoDTO.setOrderNumber(1002);
        nuevoPedidoDTO.setClient("Maria Lopez");
        nuevoPedidoDTO.setStatus("PENDIENTE");

        Pedido pedidoGuardado = new Pedido();
        pedidoGuardado.setId(2);
        pedidoGuardado.setOrderNumber(1002);
        pedidoGuardado.setClient("Maria Lopez");
        pedidoGuardado.setStatus("PENDIENTE");

        when(pedidoRepository.save(org.mockito.ArgumentMatchers.any(Pedido.class))).thenReturn(pedidoGuardado);

        PedidoDTO resultado = pedidoService.createPedido(nuevoPedidoDTO);

        assertNotNull(resultado);
        assertEquals(1002, resultado.getOrderNumber());
        assertEquals("Maria Lopez", resultado.getClient());
        assertEquals("PENDIENTE", resultado.getStatus());
    }
}