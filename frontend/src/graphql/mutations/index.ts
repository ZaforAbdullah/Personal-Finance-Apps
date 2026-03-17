import { gql } from '@apollo/client';
import {
  TRANSACTION_FIELDS,
  POT_FIELDS,
  BUDGET_FIELDS,
  RECURRING_BILL_FIELDS
} from '../fragments';

export const CREATE_BUDGET = gql`
  ${BUDGET_FIELDS}
  ${TRANSACTION_FIELDS}
  mutation CreateBudget($input: BudgetInput!) {
    createBudget(input: $input) { ...BudgetFields }
  }
`;

export const UPDATE_BUDGET = gql`
  ${BUDGET_FIELDS}
  ${TRANSACTION_FIELDS}
  mutation UpdateBudget($id: ID!, $input: BudgetInput!) {
    updateBudget(id: $id, input: $input) { ...BudgetFields }
  }
`;

export const DELETE_BUDGET = gql`
  mutation DeleteBudget($id: ID!) {
    deleteBudget(id: $id)
  }
`;

export const CREATE_POT = gql`
  ${POT_FIELDS}
  mutation CreatePot($input: PotInput!) {
    createPot(input: $input) { ...PotFields }
  }
`;

export const UPDATE_POT = gql`
  ${POT_FIELDS}
  mutation UpdatePot($id: ID!, $input: PotInput!) {
    updatePot(id: $id, input: $input) { ...PotFields }
  }
`;

export const DELETE_POT = gql`
  mutation DeletePot($id: ID!) {
    deletePot(id: $id)
  }
`;

export const ADD_MONEY_TO_POT = gql`
  ${POT_FIELDS}
  mutation AddMoneyToPot($id: ID!, $amount: Float!) {
    addMoneyToPot(id: $id, amount: $amount) { ...PotFields }
  }
`;

export const WITHDRAW_FROM_POT = gql`
  ${POT_FIELDS}
  mutation WithdrawFromPot($id: ID!, $amount: Float!) {
    withdrawFromPot(id: $id, amount: $amount) { ...PotFields }
  }
`;

export const CREATE_TRANSACTION = gql`
  ${TRANSACTION_FIELDS}
  mutation CreateTransaction($input: TransactionInput!) {
    createTransaction(input: $input) { ...TransactionFields }
  }
`;

export const DELETE_TRANSACTION = gql`
  mutation DeleteTransaction($id: ID!) {
    deleteTransaction(id: $id)
  }
`;

export const CREATE_RECURRING_BILL = gql`
  ${RECURRING_BILL_FIELDS}
  mutation CreateRecurringBill($input: RecurringBillInput!) {
    createRecurringBill(input: $input) { ...RecurringBillFields }
  }
`;

export const UPDATE_RECURRING_BILL = gql`
  ${RECURRING_BILL_FIELDS}
  mutation UpdateRecurringBill($id: ID!, $input: RecurringBillInput!) {
    updateRecurringBill(id: $id, input: $input) { ...RecurringBillFields }
  }
`;

export const DELETE_RECURRING_BILL = gql`
  mutation DeleteRecurringBill($id: ID!) {
    deleteRecurringBill(id: $id)
  }
`;