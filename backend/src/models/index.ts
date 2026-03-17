import { Sequelize } from 'sequelize-typescript';
import { config } from '../config';
import { Transaction } from './Transaction';
import { Budget } from './Budget';
import { Pot } from './Pot';
import { RecurringBill } from './RecurringBill';

export const sequelize = new Sequelize({
  dialect: 'postgres',
  host: config.database.host,
  port: config.database.port,
  database: config.database.name,
  username: config.database.user,
  password: config.database.password,
  models: [Transaction, Budget, Pot, RecurringBill],
  logging: config.nodeEnv === 'development' ? console.log : false,
  pool: { max: 10, min: 0, acquire: 30000, idle: 10000 },
  dialectOptions: config.database.host === 'localhost' || config.database.host === 'postgres'
    ? {}
    : { ssl: { require: true, rejectUnauthorized: false } },
});

export { Transaction, Budget, Pot, RecurringBill };
