import { DataSource } from 'typeorm';
import typeOrmConfig from '@/config/typeorm.config';
import { ConfigModule } from '@nestjs/config';

ConfigModule.forRoot({
  isGlobal: true,
});
const appDataSource = new DataSource(typeOrmConfig());
appDataSource.initialize().catch((e) => {
  console.log('Error during Data Source initialization', e);
});

export default appDataSource;
