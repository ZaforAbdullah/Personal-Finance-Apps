export const typeDefs = `#graphql
  type Balance {
    current: Float!
    income: Float!
    expenses: Float!
  }

  type Transaction {
    id: ID!
    name: String!
    avatarUrl: String
    category: String!
    date: String!
    amount: Float!
    recurring: Boolean!
  }

  type TransactionPage {
    transactions: [Transaction!]!
    total: Int!
    page: Int!
    limit: Int!
    totalPages: Int!
  }

  type Budget {
    id: ID!
    category: String!
    maximum: Float!
    theme: String!
    spent: Float!
    remaining: Float!
    transactions: [Transaction!]!
  }

  type Pot {
    id: ID!
    name: String!
    target: Float!
    total: Float!
    theme: String!
    percentage: Float!
  }

  type RecurringBill {
    id: ID!
    name: String!
    avatarUrl: String
    category: String!
    amount: Float!
    dueDay: Int!
    isPaid: Boolean!
    isDueSoon: Boolean!
  }

  type BillsSummary {
    totalUpcoming: Float!
    totalPaid: Float!
    dueSoon: Float!
  }

  type Overview {
    balance: Balance!
    pots: [Pot!]!
    transactions: [Transaction!]!
    budgets: [Budget!]!
    billsSummary: BillsSummary!
  }

  input BudgetInput {
    category: String!
    maximum: Float!
    theme: String!
  }

  input PotInput {
    name: String!
    target: Float!
    theme: String!
  }

  input TransactionInput {
    name: String!
    category: String!
    date: String!
    amount: Float!
    recurring: Boolean
  }

  input RecurringBillInput {
    name: String!
    category: String!
    amount: Float!
    dueDay: Int!
  }

  type Query {
    balance: Balance!
    transactions(
      page: Int
      limit: Int
      search: String
      category: String
      sortBy: String
    ): TransactionPage!
    budgets: [Budget!]!
    budget(id: ID!): Budget
    pots: [Pot!]!
    pot(id: ID!): Pot
    recurringBills(search: String, sortBy: String): [RecurringBill!]!
    overview: Overview!
    categories: [String!]!
  }

  type Mutation {
    createBudget(input: BudgetInput!): Budget!
    updateBudget(id: ID!, input: BudgetInput!): Budget!
    deleteBudget(id: ID!): Boolean!

    createPot(input: PotInput!): Pot!
    updatePot(id: ID!, input: PotInput!): Pot!
    deletePot(id: ID!): Boolean!
    addMoneyToPot(id: ID!, amount: Float!): Pot!
    withdrawFromPot(id: ID!, amount: Float!): Pot!

    createTransaction(input: TransactionInput!): Transaction!
    deleteTransaction(id: ID!): Boolean!

    createRecurringBill(input: RecurringBillInput!): RecurringBill!
    updateRecurringBill(id: ID!, input: RecurringBillInput!): RecurringBill!
    deleteRecurringBill(id: ID!): Boolean!
  }
`;
