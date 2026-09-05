# Events and Camel Routes

```java
@Slf4j
@ApplicationScoped
@RequiredArgsConstructor
public class EventService {
    private final EventRepository eventRepository;
    private final ObjectMapper objectMapper;

    public void createSuccessEvent(Object payload, String eventType) {
        Objects.requireNonNull(payload, "Payload cannot be null");
        Event event = new Event();
        event.setType(eventType);
        event.setStatus(EventStatus.SUCCESS);
        event.setPayload(serializePayload(payload));
        event.setTimestamp(Instant.now());

        eventRepository.persist(event);
        log.info("Success event created: {}", eventType);
    }

    public void createErrorEvent(Object payload, String eventType, String errorMessage) {
        Objects.requireNonNull(payload, "Payload cannot be null");
        if (errorMessage == null || errorMessage.isBlank()) {
            throw new IllegalArgumentException("Error message cannot be blank");
        }
        Event event = new Event();
        event.setType(eventType);
        event.setStatus(EventStatus.ERROR);
        event.setErrorMessage(errorMessage);
        event.setPayload(serializePayload(payload));
        event.setTimestamp(Instant.now());

        eventRepository.persist(event);
        log.error("Error event created: {} - {}", eventType, errorMessage);
    }

    private String serializePayload(Object payload) {
        try {
            return objectMapper.writeValueAsString(payload);
        } catch (JsonProcessingException e) {
            throw new IllegalStateException("Failed to serialize event payload", e);
        }
    }
}
```

## Camel Message Publishing (RabbitMQ)

```java
@Slf4j
@ApplicationScoped
@RequiredArgsConstructor
public class BusinessRulesPublisher {
    private final ProducerTemplate producerTemplate;

    public void publishSync(BusinessRulesPayload payload) {
        producerTemplate.sendBody(
            "direct:business-rules-publisher",
            payload
        );
    }
}
```

**Camel Route Configuration:**

```java
@ApplicationScoped
public class BusinessRulesRoute extends RouteBuilder {

    @ConfigProperty(name = "camel.rabbitmq.queue.business-rules")
    String businessRulesQueue;

    @ConfigProperty(name = "rabbitmq.host")
    String rabbitHost;

    @ConfigProperty(name = "rabbitmq.port")
    Integer rabbitPort;

    @Override
    public void configure() {
        from("direct:business-rules-publisher")
            .routeId("business-rules-publisher")
            .log("Publishing message to RabbitMQ: ${body}")
            .marshal().json(JsonLibrary.Jackson)
            .toF("spring-rabbitmq:%s?hostname=%s&portNumber=%d",
                businessRulesQueue, rabbitHost, rabbitPort);
    }
}
```

## Camel Direct Routes (In-Memory)

```java
@ApplicationScoped
public class DocumentProcessingRoute extends RouteBuilder {

    @Override
    public void configure() {
        // Error handling
        onException(ValidationException.class)
            .handled(true)
            .to("direct:validation-error-handler")
            .log("Validation error: ${exception.message}");

        // Main processing route
        from("direct:process-document")
            .routeId("document-processing")
            .log("Processing document: ${header.documentId}")
            .bean(DocumentValidator.class, "validate")
            .bean(DocumentTransformer.class, "transform")
            .choice()
                .when(header("documentType").isEqualTo("INVOICE"))
                    .to("direct:process-invoice")
                .when(header("documentType").isEqualTo("CREDIT_NOTE"))
                    .to("direct:process-credit-note")
                .otherwise()
                    .to("direct:process-generic")
            .end();

        from("direct:validation-error-handler")
            .bean(EventService.class, "createErrorEvent")
            .log("Validation error handled");
    }
}
```

## Camel File Processing

```java
@ApplicationScoped
public class FileMonitoringRoute extends RouteBuilder {

    @ConfigProperty(name = "file.input.directory")
    String inputDirectory;

    @ConfigProperty(name = "file.processed.directory")
    String processedDirectory;

    @ConfigProperty(name = "file.error.directory")
    String errorDirectory;

    @Override
    public void configure() {
        from("file:" + inputDirectory + "?move=" + processedDirectory +
             "&moveFailed=" + errorDirectory + "&delay=5000")
            .routeId("file-monitor")
            .log("Processing file: ${header.CamelFileName}")
            .to("direct:process-file");

        from("direct:process-file")
            .bean(OrderProcessingService.class, "processFile")
            .log("File processing completed");
    }
}
```

## Camel Bean Invocation

```java
@ApplicationScoped
public class InvoiceRoute extends RouteBuilder {

    @Override
    public void configure() {
        from("direct:invoice-validation")
            .bean(InvoiceFlowValidator.class, "validateFlowWithConfig")
            .log("Validation result: ${body}");

        from("direct:persist-and-publish")
            .bean(DocumentJobService.class, "createDocumentAndJobEntities")
            .bean(BusinessRulesPublisher.class, "publishAsync")
            .bean(EventService.class, "createSuccessEvent(${body}, 'PUBLISHED')");
    }
}
```
