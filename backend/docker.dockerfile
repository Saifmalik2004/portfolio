# Use official OpenJDK image
FROM openjdk:17-jdk-slim

# Working directory
WORKDIR /app

# Copy jar file (adjust name according to your build)
COPY target/portfolio-0.0.1-SNAPSHOT.jar app.jar

# Expose port (Spring Boot default 8080)
EXPOSE 8080

# Run the jar
ENTRYPOINT ["java", "-jar", "app.jar"]
