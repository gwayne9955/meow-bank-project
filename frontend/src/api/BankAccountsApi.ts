import _ from "lodash";
import { BankAccount } from "../types";

export interface CreateAccountForm {
  account_name: string;
  customer_id: number;
  balance: number;
  currency: string;
  notes: string | null;
}

export const BankAccountsApi = {
  getAll: async (): Promise<BankAccount[]> => {
    const response = await fetch("http://localhost:8000/api/accounts/");
    if (!response.ok) {
      const errorData = await response.json();
      console.error("API Error Response:", {
        status: response.status,
        statusText: response.statusText,
        body: errorData,
      });
      throw new Error(errorData.detail || JSON.stringify(errorData));
    }
    return response.json();
  },

  create: async (data: CreateAccountForm): Promise<BankAccount> => {
    // Convert the displayed dollar amount to cents before sending
    const submitData = {
      ...data,
      balance_cents: Math.round(Number(data.balance) * 100),
      balance: _,
    };

    const response = await fetch("http://localhost:8000/api/accounts/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(submitData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("API Error Response:", {
        status: response.status,
        statusText: response.statusText,
        body: errorData,
      });
      throw new Error(errorData.detail || JSON.stringify(errorData));
    }
    return response.json();
  },
};