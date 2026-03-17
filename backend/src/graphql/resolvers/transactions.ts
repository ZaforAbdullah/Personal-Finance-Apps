import { Op, Order } from 'sequelize';
import { Transaction } from '../../models';

type SortOption = 'latest' | 'oldest' | 'a-z' | 'z-a' | 'highest' | 'lowest';

function buildOrder(sortBy: SortOption = 'latest'): Order {
  switch (sortBy) {
    case 'latest': return [['date', 'DESC']];
    case 'oldest': return [['date', 'ASC']];
    case 'a-z': return [['name', 'ASC']];
    case 'z-a': return [['name', 'DESC']];
    case 'highest': return [['amount', 'DESC']];
    case 'lowest': return [['amount', 'ASC']];
    default: return [['date', 'DESC']];
  }
}

export interface TransactionInput {
  name: string;
  category: string;
  date: string;
  amount: number;
  recurring?: boolean;
}

export const transactionResolvers = {
  Mutation: {
    createTransaction: async (_: unknown, { input }: { input: TransactionInput }) => {
      const t = await Transaction.create({
        name: input.name,
        category: input.category,
        date: new Date(input.date),
        amount: input.amount,
        recurring: input.recurring ?? false,
        avatarUrl: null,
      });
      const raw = t.get({ plain: true }) as any;
      return {
        id: raw.id,
        name: raw.name,
        avatarUrl: raw.avatarUrl ?? null,
        category: raw.category,
        date: new Date(raw.date).toISOString(),
        amount: parseFloat(raw.amount),
        recurring: raw.recurring,
      };
    },

    deleteTransaction: async (_: unknown, { id }: { id: string }) => {
      const t = await Transaction.findByPk(id);
      if (!t) throw new Error('Transaction not found');
      await t.destroy();
      return true;
    },
  },

  Query: {
    transactions: async (
      _: unknown,
      { page = 1, limit = 10, search, category, sortBy }: {
        page?: number;
        limit?: number;
        search?: string;
        category?: string;
        sortBy?: string;
      }
    ) => {
      const where: Record<string, unknown> = {};

      if (search) {
        where['name'] = { [Op.iLike]: `%${search}%` };
      }

      if (category && category !== 'All Transactions') {
        where['category'] = category;
      }

      const offset = (page - 1) * limit;
      const order = buildOrder(sortBy as SortOption);

      const { count, rows } = await Transaction.findAndCountAll({
        where,
        order,
        limit,
        offset,
        raw: true,
      });

      return {
        transactions: rows.map((t: any) => ({
          ...t,
          amount: parseFloat(t.amount),
          date: new Date(t.date).toISOString(),
        })),
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit),
      };
    },
  },
};
