import { Pot } from '../../models';

function formatPot(pot: Pot) {
  const target = parseFloat(pot.target as unknown as string);
  const total = parseFloat(pot.total as unknown as string);
  const percentage = target > 0 ? Math.min(100, (total / target) * 100) : 0;

  return {
    id: pot.id,
    name: pot.name,
    target,
    total,
    theme: pot.theme,
    percentage: parseFloat(percentage.toFixed(1)),
  };
}

export const potResolvers = {
  Query: {
    pots: async () => {
      const pots = await Pot.findAll({ order: [['createdAt', 'ASC']] });
      return pots.map(formatPot);
    },

    pot: async (_: unknown, { id }: { id: string }) => {
      const pot = await Pot.findByPk(id);
      if (!pot) return null;
      return formatPot(pot);
    },
  },

  Mutation: {
    createPot: async (_: unknown, { input }: { input: { name: string; target: number; theme: string } }) => {
      const existing = await Pot.findOne({ where: { name: input.name } });
      if (existing) throw new Error(`A pot named "${input.name}" already exists`);
      const pot = await Pot.create({ ...input, total: 0 });
      return formatPot(pot);
    },

    updatePot: async (_: unknown, { id, input }: { id: string; input: { name: string; target: number; theme: string } }) => {
      const pot = await Pot.findByPk(id);
      if (!pot) throw new Error('Pot not found');

      if (input.name !== pot.name) {
        const existing = await Pot.findOne({ where: { name: input.name } });
        if (existing) throw new Error(`A pot named "${input.name}" already exists`);
      }

      await pot.update(input);
      return formatPot(pot);
    },

    deletePot: async (_: unknown, { id }: { id: string }) => {
      const pot = await Pot.findByPk(id);
      if (!pot) throw new Error('Pot not found');
      await pot.destroy();
      return true;
    },

    addMoneyToPot: async (_: unknown, { id, amount }: { id: string; amount: number }) => {
      const pot = await Pot.findByPk(id);
      if (!pot) throw new Error('Pot not found');
      if (amount <= 0) throw new Error('Amount must be positive');

      const currentTotal = parseFloat(pot.total as unknown as string);
      const target = parseFloat(pot.target as unknown as string);

      if (currentTotal + amount > target) {
        throw new Error(`Cannot add more than the target allows. Max addable: ${(target - currentTotal).toFixed(2)}`);
      }

      await pot.update({ total: currentTotal + amount });
      return formatPot(pot);
    },

    withdrawFromPot: async (_: unknown, { id, amount }: { id: string; amount: number }) => {
      const pot = await Pot.findByPk(id);
      if (!pot) throw new Error('Pot not found');
      if (amount <= 0) throw new Error('Amount must be positive');

      const currentTotal = parseFloat(pot.total as unknown as string);

      if (amount > currentTotal) {
        throw new Error(`Cannot withdraw more than available balance: ${currentTotal.toFixed(2)}`);
      }

      await pot.update({ total: currentTotal - amount });
      return formatPot(pot);
    },
  },
};
