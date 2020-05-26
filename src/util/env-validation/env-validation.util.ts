import * as Joi from '@hapi/joi';
import { E_APP_ENVIRONMENT } from '@app/enum';

export class EnvValidationUtil {
  private static envVarsSchema = Joi.object({
    APP: {
      ENVIRONMENT: Joi.string()
        .required()
        .valid(E_APP_ENVIRONMENT.DEVELOPMENT, E_APP_ENVIRONMENT.PRODUCTION),
      PORT: Joi.number()
        .default(3000)
        .required(),
      API_PREFIX: Joi.string().required(),
      CLIENT_UNAUTH_REDIRECT_URL: Joi.string().required(),
    },
    LOGGING: {
      LABEL: Joi.string()
        .valid('development', 'production')
        .required(),
      LEVEL: Joi.string()
        .valid(
          'error',
          'warn',
          'help',
          'data',
          'info',
          'debug',
          'prompt',
          'http',
          'verbose',
          'input',
          'silly',
        )
        .required(),
      MORGAN_FORMAT: Joi.string()
        .valid('combined', 'common', 'dev', 'short', 'tiny')
        .required(),
    },
    SESSION: Joi.object({
      ALGORITHM: Joi.string().required(),
      AUDIENCE: Joi.string().required(),
      CRYPTO_KEY: Joi.string().required(),
      ENCRYPTION_KEY: Joi.string()
        .length(32)
        .required(),
      EXPIRATION: Joi.string().required(),
      ISSUER: Joi.string().required(),
      PRIVATE_KEY: Joi.required(),
      PUBLIC_KEY: Joi.required(),
      SECRET: Joi.string().required(),
      SUBJECT: Joi.string().required(),
    }),
    DATABASE: {
      ADAPTAR_URI: Joi.string().required(),
      ADAPTAR_PASSWORD: Joi.string().required(),
    },
    SOCIAL_PLATFORM: Joi.object({
      FACEBOOK: {
        CLIENT_ID: Joi.string().required(),
        CLIENT_SECRET: Joi.string().required(),
        SCOPE: Joi.string().required(),
        REDIRECT_URL: Joi.string().required(),
      },
    }),
  });

  static async validate(validateSchema: any) {
    try {
      await EnvValidationUtil.envVarsSchema.validateAsync(validateSchema);
    } catch (err) {
      console.error(err);
      process.exit(1);
    }
  }
}
