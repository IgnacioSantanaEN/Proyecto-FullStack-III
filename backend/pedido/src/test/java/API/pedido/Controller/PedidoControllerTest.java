package API.pedido.Controller;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

import java.util.Arrays;
import java.util.Collections;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import API.pedido.DTO.PedidoDTO;
import API.pedido.Service.PedidoService;

@WebMvcTest(PedidoController.class)
public class PedidoControllerTest {
    
    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private PedidoService pedidoService;

    @Test
    public void testGetAllPedidos_DeberiaDevolverLista() throws Exception {
        PedidoDTO p = new PedidoDTO();
        p.setOrderNumber(5001);
        p.setClient("Cliente Web");

        when(pedidoService.getAllPedidos()).thenReturn(Arrays.asList(p));

        mockMvc.perform(get("/api/pedido"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$[0].client").value("Cliente Web"))
                .andExpect(jsonPath("$[0].orderNumber").value(5001));
    }

    @Test
    public void testGetAllPedidos_CuandoNoHayPedidos_DeberiaDevolverListaVacia() throws Exception {
        when(pedidoService.getAllPedidos()).thenReturn(Collections.emptyList());

        mockMvc.perform(get("/api/pedido"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$.length()").value(0));
    }

    @Test
    public void testGetPedidoById_CuandoExiste_DeberiaDevolverPedido() throws Exception {
        PedidoDTO dto = new PedidoDTO();
        dto.setOrderNumber(1002);
        dto.setClient("Andres Gomez");

        when(pedidoService.getPedidoById(1)).thenReturn(dto);

        mockMvc.perform(get("/api/pedido/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.client").value("Andres Gomez"))
                .andExpect(jsonPath("$.orderNumber").value(1002));
    }

    @Test
    public void testGetPedidoById_CuandoNoExiste_DeberiaDevolver404() throws Exception {
        when(pedidoService.getPedidoById(99)).thenReturn(null);

        mockMvc.perform(get("/api/pedido/99"))
                .andExpect(status().isNotFound());
    }

    @Test
    public void testCreatePedido_DeberiaDevolverPedidoCreado() throws Exception {
        PedidoDTO resultadoDTO = new PedidoDTO();
        resultadoDTO.setOrderNumber(7001);
        resultadoDTO.setClient("Nuevo Cliente");

        when(pedidoService.createPedido(any(PedidoDTO.class))).thenReturn(resultadoDTO);

        // Enviamos los datos simulando parámetros de formulario (.param) ya que no usas @RequestBody
        mockMvc.perform(post("/api/pedido")
                .param("orderNumber", "7001")
                .param("client", "Nuevo Cliente"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.orderNumber").value(7001))
                .andExpect(jsonPath("$.client").value("Nuevo Cliente"));
    }


}
