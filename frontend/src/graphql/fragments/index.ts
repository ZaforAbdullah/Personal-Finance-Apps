import { gql } from '@apollo/client';

export const TRANSACTION_FIELDS = gql`
  fragment TransactionFields on Transaction {
    id
    name
    avatarUrl
    category
    date
    amount
    recurring
  }
`;

export const POT_FIELDS = gql`
  fragment PotFields on Pot {
    id
    name
    target
    total
    theme
    percentage
  }
`;

export const BUDGET_FIELDS = gql`
  fragment BudgetFields on Budget {
    id
    category
    maximum
    theme
    spent
    remaining
    transactions {
      ...TransactionFields
    }
  }
`;

export const RECURRING_BILL_FIELDS = gql`
  fragment RecurringBillFields on RecurringBill {
    id
    name
    avatarUrl
    category
    amount
    dueDay
    isPaid
    isDueSoon
  }
`;