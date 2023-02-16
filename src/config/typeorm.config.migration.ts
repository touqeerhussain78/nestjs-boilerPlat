import { ConfigModule } from '@nestjs/config';
import { DataSource } from 'typeorm';
import typeormConfigs from './typeorm.config';

ConfigModule.forRoot({
  isGlobal: true,
});

const options = {
  ...typeormConfigs(),
  migrations: ['src/api/**/**/migrations/*.ts'],
};

export default new DataSource(options);
