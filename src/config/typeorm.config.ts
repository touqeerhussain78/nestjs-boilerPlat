import { entities } from '@/entities';

export const typeormConfigs = () => {
  const seeds = ['src/api/**/**/seeders/*.seeder.ts'];
  const factories = ['src/api/**/**/factories/*.factory.ts'];
  let options;
  if (process.env.DB_TYPE == 'mysql') {
    options = {
      type: 'mysql',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '3306'),
      username: process.env.DB_USER || 'root',
      password: process.env.DB_PASS || '',
      database: process.env.DB_NAME || 'raadr',
      seeds,
      factories,
    };
  } else {
    options = {
      type: 'sqlite',
      database: 'database.sql',
      seeds,
      factories,
    };
  }
  options = { ...options, entities, synchronize: false, logging: false };
  return options;
};

export default typeormConfigs;
