import { balanceResolvers } from './balance';
import { transactionResolvers } from './transactions';
import { budgetResolvers } from './budgets';
import { potResolvers } from './pots';
import { recurringBillResolvers } from './recurringBills';
import { overviewResolvers } from './overview';

export const resolvers = {
  Query: {
    ...balanceResolvers.Query,
    ...transactionResolvers.Query,
    ...budgetResolvers.Query,
    ...potResolvers.Query,
    ...recurringBillResolvers.Query,
    ...overviewResolvers.Query,
  },
  Mutation: {
    ...budgetResolvers.Mutation,
    ...potResolvers.Mutation,
    ...transactionResolvers.Mutation,
    ...recurringBillResolvers.Mutation,
  },
};
