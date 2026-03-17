import { Op } from 'sequelize';
import { Budget, Transaction } from '../../models';

async function getBudgetWithSpent(budget: Budget) {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  const transactions = await Transaction.findAll({
    where: {
      category: budget.category,
      date: { [Op.between]: [startOfMonth, endOfMonth] },
      amount: { [Op.lt]: 0 },
    },
    raw: true,
  });

  const spent = transactions.reduce(
    (sum: number, t: any) => sum + Math.abs(parseFloat(t.amount)),
    0
  );

  const maximum = parseFloat(budget.maximum as unknown as string);
  const remaining = Math.max(0, maximum - spent);

  return {
    id: budget.id,
    category: budget.category,
    maximum,
    theme: budget.theme,
    spent: parseFloat(spent.toFixed(2)),
    remaining: parseFloat(remaining.toFixed(2)),
    transactions: transactions.map((t: any) => ({
      ...t,
      amount: parseFloat(t.amount),
      date: new Date(t.date).toISOString(),
    })),
  };
}

export const budgetResolvers = {
  Query: {
    budgets: async () => {
      const budgets = await Budget.findAll({ order: [['createdAt', 'ASC']] });
      return Promise.all(budgets.map(getBudgetWithSpent));
    },

    budget: async (_: unknown, { id }: { id: string }) => {
      const budget = await Budget.findByPk(id);
      if (!budget) return null;
      return getBudgetWithSpent(budget);
    },
  },

  Mutation: {
    createBudget: async (_: unknown, { input }: { input: { category: string; maximum: number; theme: string } }) => {
      const existing = await Budget.findOne({ where: { category: input.category } });
      if (existing) {
        throw new Error(`A budget for "${input.category}" already exists`);
      }
      const budget = await Budget.create(input);
      return getBudgetWithSpent(budget);
    },

    updateBudget: async (_: unknown, { id, input }: { id: string; input: { category: string; maximum: number; theme: string } }) => {
      const budget = await Budget.findByPk(id);
      if (!budget) throw new Error('Budget not found');

      if (input.category !== budget.category) {
        const existing = await Budget.findOne({ where: { category: input.category } });
        if (existing) throw new Error(`A budget for "${input.category}" already exists`);
      }

      await budget.update(input);
      return getBudgetWithSpent(budget);
    },

    deleteBudget: async (_: unknown, { id }: { id: string }) => {
      const budget = await Budget.findByPk(id);
      if (!budget) throw new Error('Budget not found');
      await budget.destroy();
      return true;
    },
  },
};
