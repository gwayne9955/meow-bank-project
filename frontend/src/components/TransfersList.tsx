import { ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons";
import { Box, Table, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { FundTransfersApi } from "../api/FundTransfersApi";
import { SortConfig } from "../types";
import { truncate } from "../utils/utils";
import { UiDateTime } from "./UiDateTime";
import { UiMoney } from "./UiMoney";

export interface TransfersListProps {
  accountId?: number;
  currency: string; // They are all in the same currency, thankfully
}

export const TransfersList: React.FC<TransfersListProps> = ({
  accountId,
  currency,
}) => {
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    sort_by: "id", // default sort field
    sort_direction: "asc", // default direction
  });

  const handleSort = (columnId: string) => {
    setSortConfig((prevConfig) => ({
      sort_by: columnId,
      sort_direction:
        prevConfig?.sort_by === columnId && prevConfig.sort_direction === "asc"
          ? "desc"
          : "asc",
    }));
  };

  const getSortIcon = (columnId: string) => {
    if (sortConfig?.sort_by === columnId) {
      return (
        <Box as="span" ml={1}>
          {sortConfig.sort_direction === "asc" ? (
            <ChevronUpIcon />
          ) : (
            <ChevronDownIcon />
          )}
        </Box>
      );
    }
  };

  const {
    data: transfers,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["transfers", sortConfig],
    queryFn: () =>
      FundTransfersApi.getAllForAccount(accountId, { ...sortConfig }),
  });

  return (
    <Box borderWidth="1px" borderRadius="lg" overflow="hidden">
      <Table variant="striped">
        <Thead>
          <Tr>
            <Th
              cursor="pointer"
              onClick={() => handleSort("id")}
              _hover={{ bg: "gray.50" }}
            >
              Transfer Id {getSortIcon("id")}
            </Th>
            <Th>Type</Th>
            <Th
              cursor="pointer"
              onClick={() => handleSort("from_account")}
              _hover={{ bg: "gray.50" }}
            >
              From Account Id {getSortIcon("from_account")}
            </Th>
            <Th
              cursor="pointer"
              onClick={() => handleSort("to_account")}
              _hover={{ bg: "gray.50" }}
            >
              To Account Id {getSortIcon("to_account")}
            </Th>
            <Th
              isNumeric
              cursor="pointer"
              onClick={() => handleSort("amount_cents")}
              _hover={{ bg: "gray.50" }}
            >
              Amount {getSortIcon("amount_cents")}
            </Th>
            <Th
              cursor="pointer"
              onClick={() => handleSort("created_at")}
              _hover={{ bg: "gray.50" }}
            >
              Created At {getSortIcon("created_at")}
            </Th>
            <Th>Notes</Th>
          </Tr>
        </Thead>
        <Tbody>
          {transfers?.map((transfer) => (
            <Tr>
              <Td>{transfer.id}</Td>
              <Td>
                {transfer.from_account === accountId ? "Outbound" : "Inbound"}
              </Td>
              <Td>{transfer.from_account}</Td>
              <Td>{transfer.to_account}</Td>
              <Td isNumeric>
                <UiMoney cents={transfer.amount_cents} currency={currency} />
              </Td>
              <Td>
                <UiDateTime date={new Date(transfer.created_at)} />
              </Td>
              <Td>{truncate(transfer.notes)}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};
