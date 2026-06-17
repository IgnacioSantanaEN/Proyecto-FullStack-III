package API.bff.Config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestClient;

@Configuration
public class RestClientConfig {
    
    private final String USUARIO_SERVICE_URL = "http://localhost:8082/api";
    private final String PEDIDO_SERVICE_URL = "http://localhost:8084/api";
    private final String PRODUCTO_SERVICE_URL = "http://localhost:8083/api";

    @Bean
    public RestClient usuarioRestClient() {
        return RestClient.builder()
                .baseUrl(USUARIO_SERVICE_URL)
                .defaultHeader("Accept", "application/json")
                .defaultHeader("Content-Type", "application/json")
                .build();
    }

    @Bean
    public RestClient pedidoRestClient() {
        return RestClient.builder()
                .baseUrl(PEDIDO_SERVICE_URL)
                .defaultHeader("Accept", "application/json")
                .build();
    }

    @Bean
    public RestClient productoRestClient() {
        return RestClient.builder()
                .baseUrl(PRODUCTO_SERVICE_URL)
                .defaultHeader("Accept", "application/json")
                .defaultHeader("Content-Type", "application/json")
                .build();
    }
}
