import * as Joi from 'joi';
import { EAppEnvironment } from '@enums';
import { Logger } from '@nestjs/common';

export class EnvValidationUtil {
  private static envVarsSchema = Joi.object({
    APP: {
      API_PREFIX: Joi.string().required(),
      CLIENT_UNAUTH_REDIRECT_URL: Joi.string().required(),
      ENVIRONMENT: Joi.string().
        required().
        valid(EAppEnvironment.DEVELOPMENT, EAppEnvironment.PRODUCTION),
      LOG_DIR: Joi.string().required(),
      PORT: Joi.number().
        default(3000).
        required(),
      UPLOAD_DIR: Joi.string().required()
    },
    COOKIE: {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      httpOnly: Joi.boolean().required(),
      // eslint-disable-next-line @typescript-eslint/naming-convention
      maxAge: Joi.number().required(),
      path: Joi.string().required(),
      // eslint-disable-next-line @typescript-eslint/naming-convention
      sameSite: Joi.boolean().required(),
      secure: Joi.boolean().required()
    },
    DATABASE: {
      ADAPTAR_PASSWORD: Joi.string().required(),
      ADAPTAR_URI: Joi.string().required()
    },
    LOGGING: {
      LABEL: Joi.string().
        valid(EAppEnvironment.DEVELOPMENT, EAppEnvironment.PRODUCTION).
        required(),
      LEVEL: Joi.string().
        valid('error', 'warn', 'help', 'data', 'info', 'debug', 'prompt', 'http', 'verbose', 'input', 'silly').
        required()
    },
    SESSION: Joi.object({
      ALGORITHM: Joi.string().required(),
      AUDIENCE: Joi.string().required(),
      CRYPTO_KEY: Joi.string().required(),
      ENCRYPTION_KEY: Joi.string().
        // eslint-disable-next-line no-magic-numbers
        length(32).
        required(),
      EXPIRATION: Joi.string().required(),
      ISSUER: Joi.string().required(),
      PRIVATE_KEY: Joi.required(),
      PUBLIC_KEY: Joi.required(),
      SECRET: Joi.string().required(),
      SUBJECT: Joi.string().required()
    }),
    SOCIAL_PLATFORM: Joi.object({
      FACEBOOK: {
        CLIENT_ID: Joi.string().required(),
        CLIENT_SECRET: Joi.string().required(),
        GRAPH_API: Joi.string().required(),
        GROUP_PARAMS: Joi.string().required(),
        IG_PARAMS: Joi.string().required(),
        PAGE_PARAMS: Joi.string().required(),
        SCOPE: Joi.string().required(),
        VIDEO_GRAPH_API: Joi.string().required()
      },
      IG: {
        API_ID: Joi.string().required(),
        API_SECRET: Joi.string().required()
      },
      LINKEDIN: {
        CLIENT_ID: Joi.string().required(),
        CLIENT_SECRET: Joi.string().required(),
        ORG_API: Joi.string().required(),
        SCOPE: Joi.array().items(Joi.string()),
        UGC_API: Joi.string().required()
      },
      REDIRECT_URL: Joi.string().required(),
      TWITTER: {
        ACCESS_TOKEN: Joi.string().required(),
        ACCESS_TOKEN_SECRET: Joi.string().required(),
        API_KEY: Joi.string().required(),
        API_SECRET: Joi.string().required(),
        GRAPH_API: Joi.string().required()
      }
    })
  });

  public static validate (validate_schema: Record<string, unknown>): void {
    const { error, errors }: Joi.ValidationResult = this.envVarsSchema.validate(validate_schema, {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      allowUnknown: false,
      debug: true,
      errors: {
        label: 'key',
        stack: true }
    });

    if (error || errors) {
      Logger.error(JSON.stringify(error?.details, null, parseInt('2', 10)));
      Logger.error(JSON.stringify(errors?.details, null, parseInt('2', 10)));
      // eslint-disable-next-line no-process-exit
      process.exit(1);
    }
  }
}
