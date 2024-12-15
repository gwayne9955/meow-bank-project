import { Container, Flex, Heading, Image } from "@chakra-ui/react";
import React from "react";
import { AccountList } from "./AccountList";
import { ColorModeSwitcher } from "./ColorModeSwitcher";
import { CreateAccountButton } from "./CreateAccountButton";
import { TransferFundsButton } from "./TransferFundsButton";

export const Home: React.FC = () => {
  return (
    <Container maxW="container.xl" p={4} mt={20}>
      <Flex justifyContent="space-between" alignItems="center" mb={6}>
        <Image
          src="/cf.jpg"
          alt="Coin-fidence Logo"
          boxSize="150px"
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
  );
};
