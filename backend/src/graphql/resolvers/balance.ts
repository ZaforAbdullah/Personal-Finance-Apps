import { Transaction } from '../../models';

export const balanceResolvers = {
  Query: {
    balance: async () => {
      const transactions = await Transaction.findAll();

      const income = transactions
        .filter(t => parseFloat(t.amount as unknown as string) > 0)
        .reduce((sum, t) => sum + parseFloat(t.amount as unknown as string), 0);

      const expenses = transactions
        .filter(t => parseFloat(t.amount as unknown as string) < 0)
        .reduce((sum, t) => sum + Math.abs(parseFloat(t.amount as unknown as string)), 0);

      const current = income - expenses;

      return {
        current: parseFloat(current.toFixed(2)),
        income: parseFloat(income.toFixed(2)),
        expenses: parseFloat(expenses.toFixed(2)),
      };
    },

    categories: async () => {
      const categories = await Transaction.findAll({
        attributes: ['category'],
        group: ['category'],
        raw: true,
      });
      return ['All Transactions', ...categories.map((c: any) => c.category).sort()];
    },
  },
};
