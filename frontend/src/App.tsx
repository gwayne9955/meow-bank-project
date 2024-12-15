import { ChakraProvider, theme } from "@chakra-ui/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AccountDetails } from "./components/AccountDetails";
import { Home } from "./components/Home";

export const App = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60, // Consider data stale after 1 minute
      },
    },
  });

  return (
    <BrowserRouter>
      <ChakraProvider theme={theme}>
        <QueryClientProvider client={queryClient}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/accounts/:accountId" element={<AccountDetails />} />
          </Routes>
        </QueryClientProvider>
      </ChakraProvider>
    </BrowserRouter>
  );
};
