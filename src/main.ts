import { Logger, ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'

import { AppModule } from './core/app.module.js'
import { getCorseConfig } from './core/config/cors.config.js'
import { getValidationPipeConfig } from './core/config/validation-pipe.config.js'

async function bootstrap() {
	const app = await NestFactory.create(AppModule)

	const config = app.get(ConfigService)
	const logger = new Logger()

	app.useGlobalPipes(new ValidationPipe(getValidationPipeConfig()))

	app.enableCors(getCorseConfig(config))

	const swaggerConfig = new DocumentBuilder()
		.setTitle('TesloCinema API')
		.setDescription('API Gateway for TeaCinema microservices')
		.setVersion('1.0.0')
		.addBearerAuth()
		.build()

	const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig)

	SwaggerModule.setup('/docs', app, swaggerDocument, {
		yamlDocumentUrl: '/openapi.yaml'
	})

	const port = config.getOrThrow<number>('HTTP_PORT')
	const host = config.getOrThrow<string>('HTTP_HOST')

	await app.listen(port)

	logger.log(`Gateway started: ${host}`)
	logger.log(`Swaager: ${host}/docs`)
}
await bootstrap()
