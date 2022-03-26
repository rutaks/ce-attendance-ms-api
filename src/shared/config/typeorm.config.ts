import 'dotenv/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { isRunningInProduction } from '../util/env.util';

const typeOrmConfig: TypeOrmModuleOptions = {
  host: 'localhost',
  port: 5430,
  username: 'cerw',
  password: '123',
  database: 'ce_attendance_ms_db',
  type: 'postgres',
  keepConnectionAlive: true,
  entities: ['dist/**/*.entity.js'],
  synchronize: !isRunningInProduction(),
  dropSchema: !isRunningInProduction(),
  logging: !isRunningInProduction(),
  autoLoadEntities: !isRunningInProduction(),
  migrationsTableName: 'migrations',
  migrations: ['dist/src/migrations/*{.ts,.js}'],
  cli: {
    migrationsDir: 'src/migrations',
  },
};

export default typeOrmConfig;
