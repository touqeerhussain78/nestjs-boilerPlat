import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import appDataSource from '@/config/app.datasource';
import { PasswordReset } from '@/api/auth/entities/password-reset.entity';
import { User } from '@/api/user/entities/user.entity';

export function ForgotToken(
  property: string,
  validationOptions?: ValidationOptions,
) {
  return (object: any, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [property],
      validator: ForgotTokenConstraint,
    });
  };
}

@ValidatorConstraint({ name: 'ForgotToken', async: true })
export class ForgotTokenConstraint implements ValidatorConstraintInterface {
  async validate(value: any, args: ValidationArguments) {
    const [property] = args.constraints;
    const params: any = args.object;
    const user = await appDataSource
      .getRepository(User)
      .createQueryBuilder('entity')
      .where(`entity.email = :value`, { value: params.email })
      .getCount();
    if (user) {
      const token = await appDataSource
        .getRepository(PasswordReset)
        .createQueryBuilder('entity')
        .where(`entity.token = :value`, { value: value })
        .getOne();

      if (property == 'invalid') {
        return token !== null;
      }
      if (property == 'expire') {
        return token && token.expireAt < new Date() ? false : true;
      }
    }

    return true;
  }
  defaultMessage() {
    return `This password reset token is invalid.`;
  }
}
