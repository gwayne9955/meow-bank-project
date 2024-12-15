import { Box, Table, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { BankAccountsApi } from "../api/BankAccountsApi";
import { truncate } from "../utils/utils";
import { UiDateTime } from "./UiDateTime";
import { UiMoney } from "./UiMoney";

export const AccountList: React.FC = () => {
  const {
    data: accounts,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["accounts"],
    queryFn: BankAccountsApi.getAll,
  });

  return (
    <Box borderWidth="1px" borderRadius="lg" overflow="hidden">
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Account Name</Th>
            <Th>Account Id</Th>
            <Th isNumeric>Balance</Th>
            <Th>Created At</Th>
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
