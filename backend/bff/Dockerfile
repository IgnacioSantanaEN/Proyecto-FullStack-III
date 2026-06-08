# Build stage: compile the application with Maven using Eclipse Temurin JDK 17
FROM maven:3.9.4-eclipse-temurin-17 AS build
WORKDIR /app

# Copiar solo el pom.xml y el código fuente desde la carpeta del bff
COPY pom.xml .
COPY src ./src

# Descargar dependencias y construir el paquete (sin tests para acelerar)
RUN mvn -B -DskipTests package

# Runtime stage: ejecutar con Eclipse Temurin JDK 17
FROM eclipse-temurin:17-jdk
WORKDIR /app

# Copiar el artefacto empaquetado desde la etapa de build
COPY --from=build /app/target/*.jar app.jar

# Puerto típico para Spring Boot
EXPOSE 8086

ENTRYPOINT ["java", "-jar", "/app/app.jar"]

