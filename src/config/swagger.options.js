const swaggerOpts = {
    definition: {
      openapi: '3.0.1',
      info: {
        title: 'API Documentation with Swagger',
        version: '1.0.0',
      },
    },
    apis: [`./src/docs/**/*.yml`], 
  };

module.exports = swaggerOpts

