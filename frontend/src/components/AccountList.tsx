import { ChevronDownIcon, ChevronUpIcon, SearchIcon } from "@chakra-ui/icons";
import {
  Box,
  Input,
  InputGroup,
  InputLeftElement,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useDebounce } from "use-debounce";
import { BankAccountsApi } from "../api/BankAccountsApi";
import { SortConfig } from "../types";
import { truncate } from "../utils/utils";
import { UiDateTime } from "./UiDateTime";
import { UiMoney } from "./UiMoney";

export const AccountList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>();
  const [debouncedSearch] = useDebounce(searchTerm, 300); // 300ms delay
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
    data: accounts,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["accounts", sortConfig, debouncedSearch],
    queryFn: () =>
      BankAccountsApi.getAll({ ...sortConfig, query: debouncedSearch }),
  });

  return (
    <Box borderWidth="1px" borderRadius="lg" overflow="hidden">
      <InputGroup mb={4}>
        <InputLeftElement pointerEvents="none">
          <SearchIcon color="gray.400" />
        </InputLeftElement>
        <Input
          placeholder="Search accounts by name or id..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </InputGroup>

      <Table variant="simple">
        <Thead>
          <Tr>
            <Th
              cursor="pointer"
              onClick={() => handleSort("account_name")}
              _hover={{ bg: "gray.50" }}
            >
              Account Name {getSortIcon("account_name")}
            </Th>
            <Th
              cursor="pointer"
              onClick={() => handleSort("id")}
              _hover={{ bg: "gray.50" }}
            >
              Account Id {getSortIcon("id")}
            </Th>
            <Th
              isNumeric
              cursor="pointer"
              onClick={() => handleSort("balance_cents")}
              _hover={{ bg: "gray.50" }}
            >
              Balance {getSortIcon("balance_cents")}
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
          {accounts?.map((account) => (
            <Tr key={account.id}>
              <Td>{truncate(account.account_name)}</Td>
              <Td>{account.id}</Td>
              <Td isNumeric>
                <UiMoney
                  cents={account.balance_cents}
                  currency={account.currency}
                />
              </Td>
              <Td>
                <UiDateTime date={new Date(account.created_at)} />
              </Td>
              <Td>{truncate(account.notes)}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};
