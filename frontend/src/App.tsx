import {
  ChakraProvider,
  Container,
  Flex,
  Heading,
  Image,
  theme,
} from "@chakra-ui/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AccountList } from "./components/AccountList";
import { ColorModeSwitcher } from "./components/ColorModeSwitcher";
import { CreateAccountButton } from "./components/CreateAccountButton";
import { TransferFundsButton } from "./components/TransferFundsButton";

export const App = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60, // Consider data stale after 1 minute
      },
    },
  });

  return (
    <ChakraProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
        <Container maxW="container.xl" p={4} mt={20}>
          <Flex justifyContent="space-between" alignItems="center" mb={6}>
            <Image
              src="/cf.jpg"
              alt="Coin-fidence Logo"
              boxSize="150px" // or whatever size you need
              objectFit="contain"
            />
            <Heading size="2xl">Coin-fidence Financial</Heading>
            <ColorModeSwitcher justifySelf="flex-end" />
            <Flex gap={4}>
              <CreateAccountButton />
              <TransferFundsButton />
            </Flex>
          </Flex>
          <AccountList />
        </Container>
      </QueryClientProvider>
    </ChakraProvider>
  );
};
