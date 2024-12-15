import { ChevronLeftIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Container,
  Flex,
  Heading,
  Spinner,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { BankAccountsApi } from "../api/BankAccountsApi";
import { TransfersList } from "./TransfersList";
import { UiMoney } from "./UiMoney";

export const AccountDetails: React.FC = () => {
  const { accountId } = useParams();
  const navigate = useNavigate();

  const {
    data: account,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["account", accountId],
    queryFn: () => BankAccountsApi.getById(parseInt(accountId!)),
    retry: 0,
  });

  if (isLoading) return <Spinner />;
  if (error) return <Text color="red.500">{error.message}</Text>;
  if (!account) return <Text>Account not found!</Text>;

  return (
    <Container maxW="container.xl" p={4} mt={20}>
      <Button
        leftIcon={<ChevronLeftIcon />}
        onClick={() => navigate("/")}
        mb={4}
        variant="ghost"
      >
        Back to Accounts
      </Button>

      <Card mb={10} variant="filled">
        <CardHeader>
          <Heading size="xl">{account.account_name}</Heading>
        </CardHeader>
        <CardBody>
          <Stack spacing={4}>
            <Flex gap={20}>
              <Box>
                <Text fontWeight="bold">Account ID</Text>
                <Text>{account.id}</Text>
              </Box>
              <Box>
                <Text fontWeight="bold">Balance</Text>
                <UiMoney
                  cents={account.balance_cents}
                  currency={account.currency}
                />
              </Box>
              <Box>
                <Text fontWeight="bold">Currency</Text>
                <Text>{account.currency}</Text>
              </Box>
            </Flex>
            {account.notes && (
              <Box>
                <Text fontWeight="bold">Notes</Text>
                <Text>{account.notes}</Text>
              </Box>
            )}
          </Stack>
        </CardBody>
      </Card>

      <Card mb={10} variant="simple">
        <CardHeader>
          <Heading size="lg">Transfers</Heading>
        </CardHeader>
        <TransfersList accountId={account.id} currency={account.currency} />
      </Card>
    </Container>
  );
};
