import { FundTransfer } from "../types";

export interface CreateTransferForm {
  from_account: number;
  to_account: number;
  amount_cents: number;
  notes: string | null;
}

export const FundTransfersApi = {
  getAllForAccount: async (
    account_id?: number,
    queryParams?: Object
  ): Promise<FundTransfer[]> => {
    let url = "http://localhost:8000/api/transfers/accounts";

    if (account_id) {
      url += `/${account_id}`;
    }

    const params = new URLSearchParams();

    if (queryParams) {
      Object.entries(queryParams).forEach(([key, value]) => {
        value && params.append(key, value);
      });
    }

    if (!params.keys().next().done) {
      url += `?${params}`;
    }

    const response = await fetch(url);
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
    const response = await fetch("http://localhost:8000/api/transfers/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
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
