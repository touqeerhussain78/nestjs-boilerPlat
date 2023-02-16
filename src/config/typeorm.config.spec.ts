import { DataSource } from 'typeorm';
import typeormConfigs from './typeorm.config';
import seedConfig from './typeorm.config.seed';
import migrationConfig from './typeorm.config.migration';

describe('TyperormConfig', () => {
  it('sqlite', () => {
    const db = 'sqlite';
    process.env.DB_TYPE = db;
    expect(typeormConfigs().type).toStrictEqual(db);
  });

  it('mysql', () => {
    const db = 'mysql';
    process.env.DB_TYPE = db;
    expect(typeormConfigs().type).toStrictEqual(db);
  });

  it('seed', () => {
    expect(seedConfig).toHaveProperty('type');
  });

  it('migration', () => {
    expect(migrationConfig).toBeInstanceOf(DataSource);
  });
});
