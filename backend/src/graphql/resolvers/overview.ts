import { Op } from 'sequelize';
import { Transaction, Budget, Pot, RecurringBill } from '../../models';

export const overviewResolvers = {
  Query: {
    overview: async () => {
      // Balance calculation
      const allTransactions = await Transaction.findAll({ raw: true });

      const income = (allTransactions as any[])
        .filter((t: any) => parseFloat(t.amount) > 0)
        .reduce((sum: number, t: any) => sum + parseFloat(t.amount), 0);

      const expenses = (allTransactions as any[])
        .filter((t: any) => parseFloat(t.amount) < 0)
        .reduce((sum: number, t: any) => sum + Math.abs(parseFloat(t.amount)), 0);

      // Latest 5 transactions for overview
      const latestTransactions = await Transaction.findAll({
        order: [['date', 'DESC']],
        limit: 5,
        raw: true,
      });

      // Pots
      const pots = await Pot.findAll({ order: [['createdAt', 'ASC']], raw: true });
      const formattedPots = (pots as any[]).map((pot: any) => {
        const target = parseFloat(pot.target);
        const total = parseFloat(pot.total);
        return {
          ...pot,
          target,
          total,
          percentage: target > 0 ? parseFloat(Math.min(100, (total / target) * 100).toFixed(1)) : 0,
        };
      });

      // Budgets with spent amount for current month
      const budgets = await Budget.findAll({ order: [['createdAt', 'ASC']], raw: true });
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

      const formattedBudgets = await Promise.all((budgets as any[]).map(async (budget: any) => {
        const transactions = await Transaction.findAll({
          where: {
            category: budget.category,
            date: { [Op.between]: [startOfMonth, endOfMonth] },
            amount: { [Op.lt]: 0 },
          },
          limit: 3,
          order: [['date', 'DESC']],
          raw: true,
        });

        const spent = (transactions as any[]).reduce(
          (sum: number, t: any) => sum + Math.abs(parseFloat(t.amount)),
          0
        );

        const maximum = parseFloat(budget.maximum);
        return {
          ...budget,
          maximum,
          spent: parseFloat(spent.toFixed(2)),
          remaining: parseFloat(Math.max(0, maximum - spent).toFixed(2)),
          transactions: (transactions as any[]).map((t: any) => ({
            ...t,
            amount: parseFloat(t.amount),
            date: new Date(t.date).toISOString(),
          })),
        };
      }));

      // Bills summary
      const bills = await RecurringBill.findAll({ raw: true });
      const today = new Date();
      const currentDay = today.getDate();

      let totalPaid = 0;
      let totalUpcoming = 0;
      let dueSoon = 0;

      (bills as any[]).forEach((bill: any) => {
        const amount = Math.abs(parseFloat(bill.amount));
        const daysUntilDue = bill.dueDay - currentDay;

        if (currentDay > bill.dueDay) {
          totalPaid += amount;
        } else {
          totalUpcoming += amount;
          if (daysUntilDue >= 0 && daysUntilDue <= 5) {
            dueSoon += amount;
          }
        }
      });

      return {
        balance: {
          current: parseFloat((income - expenses).toFixed(2)),
          income: parseFloat(income.toFixed(2)),
          expenses: parseFloat(expenses.toFixed(2)),
        },
        pots: formattedPots,
        transactions: (latestTransactions as any[]).map((t: any) => ({
          ...t,
          amount: parseFloat(t.amount),
          date: new Date(t.date).toISOString(),
        })),
        budgets: formattedBudgets,
        billsSummary: {
          totalUpcoming: parseFloat(totalUpcoming.toFixed(2)),
          totalPaid: parseFloat(totalPaid.toFixed(2)),
          dueSoon: parseFloat(dueSoon.toFixed(2)),
        },
      };
    },
  },
};
