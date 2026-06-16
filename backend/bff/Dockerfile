# Etapa 1: Construcción optimizada usando JDK liviano de Alpine
FROM eclipse-temurin:17-jdk-alpine AS build
WORKDIR /app

# Copiar el Wrapper y el pom primero para congelar las dependencias en el caché
COPY .mvn/ .mvn
COPY mvnw pom.xml ./
RUN chmod +x mvnw

# Descarga las dependencias en segundo plano (0 segundos si no cambia el pom.xml)
RUN ./mvnw dependency:go-offline -B

# Recién aquí copiamos tu código fuente
COPY src ./src
RUN ./mvnw clean package -DskipTests

# Etapa 2: Imagen final ultra-liviana de ejecución (JRE Alpine ocupa ~100MB)
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar

EXPOSE 8086
ENTRYPOINT ["java", "-jar", "app.jar"]