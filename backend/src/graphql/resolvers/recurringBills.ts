import { Op } from 'sequelize';
import { RecurringBill } from '../../models';

function getBillStatus(dueDay: number) {
  const today = new Date();
  const currentDay = today.getDate();
  const daysUntilDue = dueDay - currentDay;

  // Consider paid if due day has already passed this month
  const isPaid = currentDay > dueDay;
  // Due soon if within next 5 days
  const isDueSoon = !isPaid && daysUntilDue >= 0 && daysUntilDue <= 5;

  return { isPaid, isDueSoon };
}

type SortOption = 'latest' | 'oldest' | 'a-z' | 'z-a' | 'highest' | 'lowest';

export interface RecurringBillInput {
  name: string;
  category: string;
  amount: number;
  dueDay: number;
}

function formatBill(bill: any) {
  const { isPaid, isDueSoon } = getBillStatus(bill.dueDay);
  return {
    id: bill.id,
    name: bill.name,
    avatarUrl: bill.avatarUrl ?? null,
    category: bill.category,
    amount: parseFloat(bill.amount),
    dueDay: bill.dueDay,
    isPaid,
    isDueSoon,
  };
}

export const recurringBillResolvers = {
  Mutation: {
    createRecurringBill: async (_: unknown, { input }: { input: RecurringBillInput }) => {
      const bill = await RecurringBill.create({ ...input, avatarUrl: null });
      return formatBill(bill.get({ plain: true }));
    },

    updateRecurringBill: async (_: unknown, { id, input }: { id: string; input: RecurringBillInput }) => {
      const bill = await RecurringBill.findByPk(id);
      if (!bill) throw new Error('Recurring bill not found');
      await bill.update(input);
      return formatBill(bill.get({ plain: true }));
    },

    deleteRecurringBill: async (_: unknown, { id }: { id: string }) => {
      const bill = await RecurringBill.findByPk(id);
      if (!bill) throw new Error('Recurring bill not found');
      await bill.destroy();
      return true;
    },
  },

  Query: {
    recurringBills: async (_: unknown, { search, sortBy }: { search?: string; sortBy?: string }) => {
      const where: Record<string, unknown> = {};

      if (search) {
        where['name'] = { [Op.iLike]: `%${search}%` };
      }

      let order: [string, string][] = [['dueDay', 'ASC']];

      if (sortBy) {
        switch (sortBy as SortOption) {
          case 'a-z': order = [['name', 'ASC']]; break;
          case 'z-a': order = [['name', 'DESC']]; break;
          case 'highest': order = [['amount', 'DESC']]; break;
          case 'lowest': order = [['amount', 'ASC']]; break;
          default: order = [['dueDay', 'ASC']];
        }
      }

      const bills = await RecurringBill.findAll({ where, order, raw: true });

      return bills.map((bill: any) => {
        const { isPaid, isDueSoon } = getBillStatus(bill.dueDay);
        return {
          ...bill,
          amount: parseFloat(bill.amount),
          isPaid,
          isDueSoon,
        };
      });
    },
  },
};
