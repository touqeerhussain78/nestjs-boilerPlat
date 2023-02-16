import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import appDataSource from '@/config/app.datasource';
import { titleCase } from '../utility/common';

export function Unique(
  property: object,
  validationOptions?: ValidationOptions,
) {
  return (object: any, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [property],
      validator: UniqueConstraint,
    });
  };
}

@ValidatorConstraint({ name: 'Unique', async: true })
export class UniqueConstraint implements ValidatorConstraintInterface {
  async validate(value: any, args: ValidationArguments) {
    const params = args.object as any;
    const [property] = args.constraints;
    if (value) {
      const data = await appDataSource
        .getRepository(property.entity)
        .createQueryBuilder('entity')
        .where(`entity.${property.column} = :value`, { value: value })
        .getOne();
      if (data) {
        return params.hasOwnProperty('editId') && params.editId == data.id
          ? true
          : false;
      }
    }

    return true;
  }
  defaultMessage(args: ValidationArguments) {
    return `${titleCase(args.property)} has already been taken`;
  }
}
