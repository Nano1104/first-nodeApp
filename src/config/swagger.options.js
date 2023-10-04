const swaggerOptions = {
    definition: {
        openapi: '3.0.1',
        info: {
            title: "Swagger Documentation",
            description: "App documentation",
            version: "1.0.1"
        }
    },
    apis: [`.src/docs/**/*.yml`]
}