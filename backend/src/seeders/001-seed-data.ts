import { sequelize, Transaction, Budget, Pot, RecurringBill } from '../models';

async function seed() {
  await sequelize.authenticate();
  console.log('Database connected for seeding...');

  // Clear existing data
  await RecurringBill.destroy({ where: {} });
  await Pot.destroy({ where: {} });
  await Budget.destroy({ where: {} });
  await Transaction.destroy({ where: {} });

  // Seed Transactions
  const transactions = await Transaction.bulkCreate([
    { name: 'Emma Richardson', avatarUrl: '/avatars/emma-richardson.jpg', category: 'General', date: new Date('2024-08-19T14:23:11Z'), amount: -75.50, recurring: false },
    { name: 'Savory Bites Restaurant', avatarUrl: '/avatars/savory-bites.jpg', category: 'Dining Out', date: new Date('2024-08-19T10:05:42Z'), amount: -55.50, recurring: false },
    { name: 'Daniel Carter', avatarUrl: '/avatars/daniel-carter.jpg', category: 'General', date: new Date('2024-08-18T20:11:09Z'), amount: -42.30, recurring: false },
    { name: 'Sun Park', avatarUrl: '/avatars/sun-park.jpg', category: 'General', date: new Date('2024-08-17T16:45:22Z'), amount: 150.00, recurring: false },
    { name: 'Urban Services Hub', avatarUrl: '/avatars/urban-services.jpg', category: 'General', date: new Date('2024-08-17T08:30:00Z'), amount: -65.00, recurring: false },
    { name: 'Tune Twisters', avatarUrl: '/avatars/tune-twisters.jpg', category: 'Entertainment', date: new Date('2024-08-15T19:00:00Z'), amount: -12.99, recurring: true },
    { name: 'Green Plate Eatery', avatarUrl: '/avatars/green-plate.jpg', category: 'Dining Out', date: new Date('2024-08-15T13:22:45Z'), amount: -45.00, recurring: false },
    { name: 'Spendy App', avatarUrl: '/avatars/spendy-app.jpg', category: 'Entertainment', date: new Date('2024-08-14T09:00:00Z'), amount: -9.99, recurring: true },
    { name: 'James Thompson', avatarUrl: '/avatars/james-thompson.jpg', category: 'General', date: new Date('2024-08-14T11:30:00Z'), amount: 2000.00, recurring: false },
    { name: 'Pixel Plate', avatarUrl: '/avatars/pixel-plate.jpg', category: 'Dining Out', date: new Date('2024-08-13T18:45:00Z'), amount: -35.00, recurring: false },
    { name: 'Rina Sato', avatarUrl: '/avatars/rina-sato.jpg', category: 'General', date: new Date('2024-08-12T14:00:00Z'), amount: -60.00, recurring: false },
    { name: 'Spark Electric Solutions', avatarUrl: '/avatars/spark-electric.jpg', category: 'Bills', date: new Date('2024-08-12T00:00:00Z'), amount: -100.00, recurring: true },
    { name: 'Aqua Flow Utilities', avatarUrl: '/avatars/aqua-flow.jpg', category: 'Bills', date: new Date('2024-08-11T00:00:00Z'), amount: -100.00, recurring: true },
    { name: 'Serenity Spa & Wellness', avatarUrl: '/avatars/serenity-spa.jpg', category: 'Personal Care', date: new Date('2024-08-10T14:00:00Z'), amount: -30.00, recurring: false },
    { name: 'Swift Ride Share', avatarUrl: '/avatars/swift-ride.jpg', category: 'Transportation', date: new Date('2024-08-10T08:30:00Z'), amount: -18.50, recurring: false },
    { name: 'ByteMe Gaming', avatarUrl: '/avatars/byteme-gaming.jpg', category: 'Entertainment', date: new Date('2024-08-09T00:00:00Z'), amount: -14.99, recurring: true },
    { name: 'Yolo Fitness Zone', avatarUrl: '/avatars/yolo-fitness.jpg', category: 'Personal Care', date: new Date('2024-08-09T07:00:00Z'), amount: -50.00, recurring: true },
    { name: 'EduLearn Online', avatarUrl: '/avatars/edulearn.jpg', category: 'Education', date: new Date('2024-08-08T00:00:00Z'), amount: -50.00, recurring: true },
    { name: 'Fresh Bites Grocery', avatarUrl: '/avatars/fresh-bites.jpg', category: 'Groceries', date: new Date('2024-08-07T11:00:00Z'), amount: -78.50, recurring: false },
    { name: 'Opia Hair Care', avatarUrl: '/avatars/opia-hair.jpg', category: 'Personal Care', date: new Date('2024-08-06T13:00:00Z'), amount: -30.00, recurring: false },
    { name: 'Loca Loca Restaurant', avatarUrl: '/avatars/loca-loca.jpg', category: 'Dining Out', date: new Date('2024-08-06T19:30:00Z'), amount: -22.50, recurring: false },
    { name: 'Mason Martinez', avatarUrl: '/avatars/mason-martinez.jpg', category: 'General', date: new Date('2024-08-05T16:00:00Z'), amount: -25.00, recurring: false },
    { name: 'Transit Express', avatarUrl: '/avatars/transit-express.jpg', category: 'Transportation', date: new Date('2024-08-05T07:30:00Z'), amount: -12.50, recurring: false },
    { name: 'Buzz Marketing', avatarUrl: '/avatars/buzz-marketing.jpg', category: 'Shopping', date: new Date('2024-08-04T14:30:00Z'), amount: -29.99, recurring: false },
    { name: 'Posh Totty Designs', avatarUrl: '/avatars/posh-totty.jpg', category: 'Shopping', date: new Date('2024-08-03T12:00:00Z'), amount: -45.00, recurring: false },
    { name: 'Ella Phillips', avatarUrl: '/avatars/ella-phillips.jpg', category: 'General', date: new Date('2024-08-03T09:00:00Z'), amount: 1750.00, recurring: false },
    { name: 'Spark Electric Solutions', avatarUrl: '/avatars/spark-electric.jpg', category: 'Bills', date: new Date('2024-08-02T00:00:00Z'), amount: -100.00, recurring: true },
    { name: 'Wholesome Bites Co.', avatarUrl: '/avatars/wholesome-bites.jpg', category: 'Groceries', date: new Date('2024-08-01T10:00:00Z'), amount: -95.50, recurring: false },
    // July transactions
    { name: 'Emma Richardson', avatarUrl: '/avatars/emma-richardson.jpg', category: 'General', date: new Date('2024-07-30T14:23:11Z'), amount: -75.50, recurring: false },
    { name: 'Savory Bites Restaurant', avatarUrl: '/avatars/savory-bites.jpg', category: 'Dining Out', date: new Date('2024-07-28T10:05:42Z'), amount: -42.00, recurring: false },
    { name: 'Tune Twisters', avatarUrl: '/avatars/tune-twisters.jpg', category: 'Entertainment', date: new Date('2024-07-15T19:00:00Z'), amount: -12.99, recurring: true },
    { name: 'ByteMe Gaming', avatarUrl: '/avatars/byteme-gaming.jpg', category: 'Entertainment', date: new Date('2024-07-09T00:00:00Z'), amount: -14.99, recurring: true },
    { name: 'Spark Electric Solutions', avatarUrl: '/avatars/spark-electric.jpg', category: 'Bills', date: new Date('2024-07-12T00:00:00Z'), amount: -100.00, recurring: true },
    { name: 'Aqua Flow Utilities', avatarUrl: '/avatars/aqua-flow.jpg', category: 'Bills', date: new Date('2024-07-11T00:00:00Z'), amount: -100.00, recurring: true },
    { name: 'Yolo Fitness Zone', avatarUrl: '/avatars/yolo-fitness.jpg', category: 'Personal Care', date: new Date('2024-07-09T07:00:00Z'), amount: -50.00, recurring: true },
    { name: 'EduLearn Online', avatarUrl: '/avatars/edulearn.jpg', category: 'Education', date: new Date('2024-07-08T00:00:00Z'), amount: -50.00, recurring: true },
    { name: 'James Thompson', avatarUrl: '/avatars/james-thompson.jpg', category: 'General', date: new Date('2024-07-14T11:30:00Z'), amount: 2000.00, recurring: false },
    { name: 'Ella Phillips', avatarUrl: '/avatars/ella-phillips.jpg', category: 'General', date: new Date('2024-07-03T09:00:00Z'), amount: 1750.00, recurring: false },
  ]);

  console.log(`Seeded ${transactions.length} transactions`);

  // Seed Budgets
  const budgets = await Budget.bulkCreate([
    { category: 'Entertainment', maximum: 50.00, theme: '#277C78' },
    { category: 'Bills', maximum: 750.00, theme: '#82C9D7' },
    { category: 'Dining Out', maximum: 75.00, theme: '#F2CDAC' },
    { category: 'Personal Care', maximum: 100.00, theme: '#626070' },
  ]);

  console.log(`Seeded ${budgets.length} budgets`);

  // Seed Pots
  const pots = await Pot.bulkCreate([
    { name: 'Savings', target: 2000.00, total: 159.00, theme: '#277C78' },
    { name: 'Concert Ticket', target: 150.00, total: 110.00, theme: '#626070' },
    { name: 'Emergency Fund', target: 500.00, total: 125.00, theme: '#C94736' },
    { name: 'Gift', target: 150.00, total: 110.00, theme: '#3F82B2' },
    { name: 'Holiday', target: 1440.00, total: 531.00, theme: '#F2CDAC' },
    { name: 'New Laptop', target: 1000.00, total: 10.00, theme: '#97A0AC' },
    { name: 'New Phone', target: 600.00, total: 50.00, theme: '#82C9D7' },
  ]);

  console.log(`Seeded ${pots.length} pots`);

  // Seed Recurring Bills
  const bills = await RecurringBill.bulkCreate([
    { name: 'Spark Electric Solutions', avatarUrl: '/avatars/spark-electric.jpg', category: 'Bills', amount: -100.00, dueDay: 12 },
    { name: 'Aqua Flow Utilities', avatarUrl: '/avatars/aqua-flow.jpg', category: 'Bills', amount: -100.00, dueDay: 11 },
    { name: 'Tune Twisters', avatarUrl: '/avatars/tune-twisters.jpg', category: 'Entertainment', amount: -12.99, dueDay: 15 },
    { name: 'ByteMe Gaming', avatarUrl: '/avatars/byteme-gaming.jpg', category: 'Entertainment', amount: -14.99, dueDay: 9 },
    { name: 'Spendy App', avatarUrl: '/avatars/spendy-app.jpg', category: 'Entertainment', amount: -9.99, dueDay: 14 },
    { name: 'Yolo Fitness Zone', avatarUrl: '/avatars/yolo-fitness.jpg', category: 'Personal Care', amount: -50.00, dueDay: 9 },
    { name: 'EduLearn Online', avatarUrl: '/avatars/edulearn.jpg', category: 'Education', amount: -50.00, dueDay: 8 },
    { name: 'Pixel Plate', avatarUrl: '/avatars/pixel-plate.jpg', category: 'Dining Out', amount: -35.00, dueDay: 13 },
    { name: 'Buzz Marketing', avatarUrl: '/avatars/buzz-marketing.jpg', category: 'Shopping', amount: -29.99, dueDay: 4 },
  ]);

  console.log(`Seeded ${bills.length} recurring bills`);

  console.log('Seeding completed successfully!');
  await sequelize.close();
}

seed().catch((err) => {
  console.error('Seeding failed:', err);
  process.exit(1);
});
