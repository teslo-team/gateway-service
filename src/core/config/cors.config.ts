import type { CorsOptions } from '@nestjs/common/internal'
import { ConfigService } from '@nestjs/config'

export function getCorseConfig(configService: ConfigService): CorsOptions {
	return {
		origin: configService.getOrThrow<string>('HTTP_CORS').split(','),
		credentials: true
	}
}
