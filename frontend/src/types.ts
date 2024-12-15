export interface BankAccount {
  id: number;
  account_name: string;
  balance_cents: number;
  created_at: string;
  notes: string;
  deleted: boolean;
  currency: string;
}

export interface FundTransfer {
  id: number;
  from_account: number;
  to_account: number;
  amount_cents: number;
  created_at: string;
  notes: string;
}
