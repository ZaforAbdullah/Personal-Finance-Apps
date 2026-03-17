import 'reflect-metadata';
import { QueryInterface } from 'sequelize';
import { sequelize } from './models';
import { up as createTransactions, down as dropTransactions } from './migrations/001-create-transactions';
import { up as createBudgets, down as dropBudgets } from './migrations/002-create-budgets';
import { up as createPots, down as dropPots } from './migrations/003-create-pots';
import { up as createRecurringBills, down as dropRecurringBills } from './migrations/004-create-recurring-bills';

async function migrate() {
  const reset = process.argv.includes('--reset');

  await sequelize.authenticate();
  console.log('Database connected for migration...');

  const qi = sequelize.getQueryInterface() as QueryInterface;

  if (reset) {
    console.log('Dropping all tables...');
    await dropRecurringBills(qi).catch(() => {});
    await dropPots(qi).catch(() => {});
    await dropBudgets(qi).catch(() => {});
    await dropTransactions(qi).catch(() => {});
    console.log('All tables dropped');
  }

  console.log('Running migrations...');
  await createTransactions(qi);
  await createBudgets(qi);
  await createPots(qi);
  await createRecurringBills(qi);

  console.log('Migrations completed successfully!');
  await sequelize.close();
}

migrate().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});
