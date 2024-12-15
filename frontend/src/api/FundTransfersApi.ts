import _ from "lodash";
import { FundTransfer } from "../types";

export interface CreateTransferForm {
  from_account: number;
  to_account: number;
  amount: number;
  notes: string | null;
}

export const FundTransfersApi = {
  getAllForAccount: async (account_id: string): Promise<FundTransfer[]> => {
    const response = await fetch(
      "http://localhost:8000/api/accounts/" + account_id
    );
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

  create: async (data: CreateTransferForm): Promise<FundTransfer> => {
    // Convert the displayed dollar amount to cents before sending
    const submitData = {
      ...data,
      amount_cents: Math.round(Number(data.amount) * 100),
      amount: _,
    };

    const response = await fetch("http://localhost:8000/api/transfers/", {
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
