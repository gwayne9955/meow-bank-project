import { ChevronLeftIcon } from "@chakra-ui/icons";
import {
  Badge,
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
  useToast,
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { BankAccountsApi } from "../api/BankAccountsApi";
import { DeleteAccountButton } from "./DeleteAccountButton";
import { TransfersList } from "./TransfersList";
import { UiMoney } from "./UiMoney";

export const AccountDetails: React.FC = () => {
  const { accountId } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const {
    data: account,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["accounts"],
    queryFn: () => BankAccountsApi.getById(parseInt(accountId!)),
    retry: 0,
  });

  useEffect(() => {
    if (isError && error) {
      toast({
        title: "Failed to get account",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
    }
  }, [isError, error]);

  if (isLoading) return <Spinner />;
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
          <Flex justify="space-between" align="center">
            <Heading size="xl">{account.account_name}</Heading>
            {!account.deleted && (
              <DeleteAccountButton mr={10} account_id={account.id} />
            )}
          </Flex>
          {account.deleted && (
            <Badge
              colorScheme="red"
              variant="solid"
              borderRadius="full"
              fontSize="md"
              px={4}
              py={2}
              mt={5}
            >
              Deleted
            </Badge>
          )}
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
