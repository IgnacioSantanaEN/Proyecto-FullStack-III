package API.bff.Config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestClient;

@Configuration
public class RestClientConfig {
    
    @Value("${SERVICES_USUARIO_URL:http://localhost:8082/api}")
    private String usuarioServiceUrl;

    @Bean
    public RestClient usuarioRestClient() {
        return RestClient.builder()
                .baseUrl(usuarioServiceUrl)
                .defaultHeader("Accept", "application/json")
                .defaultHeader("Content-Type", "application/json")
                .build();
    }
}
