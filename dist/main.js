"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const swagger_1 = require("@nestjs/swagger");
require("reflect-metadata");
function swagger(app) {
    const config = new swagger_1.DocumentBuilder()
        .setTitle('API Documentation')
        .setDescription('REST API Documentation')
        .setVersion('0.1.0')
        .addBearerAuth()
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('document', app, document);
}
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const config = app.get(config_1.ConfigService);
    const servicePort = config.get('PORT', '3000');
    const NODE_ENV = config.get('NODE_ENV', 'development');
    let CORS_ORIGIN = [];
    if (config.get('CORS_ORIGIN')) {
        CORS_ORIGIN.push(...config.get('CORS_ORIGIN', '*').split(','));
    }
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        transform: true,
    }));
    if (config.get('CORS_REGEX_ORIGIN')) {
        CORS_ORIGIN.push(...config
            .get('CORS_REGEX_ORIGIN', '')
            .split(',')
            .map((regex) => new RegExp(regex)));
    }
    if (CORS_ORIGIN.length === 0) {
        CORS_ORIGIN = true;
    }
    app.enableCors({
        origin: CORS_ORIGIN,
        methods: config.get('CORS_METHODS', 'GET,PUT,PATCH,POST,DELETE'),
        credentials: config.get('CORS_CREDENTIALS', true),
        preflightContinue: config.get('CORS_PREFLIGHT', false),
        optionsSuccessStatus: config.get('CORS_OPTIONS_STATUS', 204),
    });
    if (config.get('SWAGGER_ENABLED', NODE_ENV === 'development')) {
        swagger(app);
        common_1.Logger.log(`Swagger is enabled on http://localhost:${servicePort}/document`, 'Bootstrap');
    }
    await app.listen(servicePort);
    common_1.Logger.log(`Server is running on http://localhost:${servicePort} with ${NODE_ENV} mode`, 'Bootstrap');
}
void bootstrap();
//# sourceMappingURL=main.js.map