import 'dotenv/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { isRunningInProduction } from '../util/env.util';

const typeOrmConfig: TypeOrmModuleOptions = {
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  type: 'postgres',
  keepConnectionAlive: true,
  entities: ['dist/**/*.entity.js'],
  synchronize: !isRunningInProduction(),
  dropSchema: isRunningInProduction(),
  logging: isRunningInProduction(),
  autoLoadEntities: !isRunningInProduction(),
  migrationsTableName: 'migrations',
  migrations: ['dist/src/migrations/*{.ts,.js}'],
  cli: {
    migrationsDir: 'src/migrations',
  },
};

export default typeOrmConfig;
