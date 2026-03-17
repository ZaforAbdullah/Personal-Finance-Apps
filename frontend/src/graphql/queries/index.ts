import { gql } from '@apollo/client';
import {
  TRANSACTION_FIELDS,
  POT_FIELDS,
  BUDGET_FIELDS,
  RECURRING_BILL_FIELDS
} from '../fragments';

export const GET_OVERVIEW = gql`
  ${POT_FIELDS}
  ${BUDGET_FIELDS}
  ${TRANSACTION_FIELDS}
  query GetOverview {
    overview {
      balance { current income expenses }
      pots { ...PotFields }
      transactions { ...TransactionFields }
      budgets { ...BudgetFields }
      billsSummary { totalUpcoming totalPaid dueSoon }
    }
  }
`;

export const GET_TRANSACTIONS = gql`
  ${TRANSACTION_FIELDS}
  query GetTransactions($page: Int, $limit: Int, $search: String, $category: String, $sortBy: String) {
    transactions(page: $page, limit: $limit, search: $search, category: $category, sortBy: $sortBy) {
      transactions { ...TransactionFields }
      total page limit totalPages
    }
  }
`;

export const GET_BUDGETS = gql`
  ${BUDGET_FIELDS}
  ${TRANSACTION_FIELDS}
  query GetBudgets {
    budgets {
      ...BudgetFields
    }
  }
`;

export const GET_POTS = gql`
  ${POT_FIELDS}
  query GetPots {
    pots { ...PotFields }
  }
`;

export const GET_RECURRING_BILLS = gql`
  ${RECURRING_BILL_FIELDS}
  query GetRecurringBills($search: String, $sortBy: String) {
    recurringBills(search: $search, sortBy: $sortBy) {
      ...RecurringBillFields
    }
  }
`;

export const GET_CATEGORIES = gql`
  query GetCategories {
    categories
  }
`;