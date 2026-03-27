import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import type { AnyObjectSchema } from 'yup';
import { ValidationError } from 'yup';

@Injectable()
export class YupValidationPipe implements PipeTransform {
  constructor(private readonly schema: AnyObjectSchema) {}

  async transform(value: unknown): Promise<unknown> {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const validatedValue = await this.schema.validate(value, {
        abortEarly: false,
        stripUnknown: true,
      });
      return validatedValue;
    } catch (err: unknown) {
      if (err instanceof ValidationError) {
        throw new BadRequestException({
          message: 'Validation failed',
          errors: err.inner.map((e: ValidationError) => ({
            field: e.path ?? 'unknown',
            message: e.message,
          })),
        });
      }
      throw new BadRequestException('Validation failed');
    }
  }
}
