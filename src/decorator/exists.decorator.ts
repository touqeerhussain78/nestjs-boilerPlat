import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import appDataSource from '@/config/app.datasource';
import { In } from 'typeorm';

export function Exists(
  property: object,
  validationOptions?: ValidationOptions,
) {
  return (object: any, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [property],
      validator: ExistsConstraint,
    });
  };
}

@ValidatorConstraint({ name: 'Exists', async: true })
export class ExistsConstraint implements ValidatorConstraintInterface {
  async validate(value: any, args: ValidationArguments) {
    const [property] = args.constraints;
    value = Array.isArray(value) ? value : [value];
    if (value.length) {
      if (!property.where) {
        property.where = {};
      }
      const count = await appDataSource.getRepository(property.entity).count({
        where: {
          [property.column]: In(value),
          ...property.where,
        },
      });

      return count === value.length;
    }

    return true;
  }
  defaultMessage(args: ValidationArguments) {
    return `${args.property} does not exist`;
  }
}
