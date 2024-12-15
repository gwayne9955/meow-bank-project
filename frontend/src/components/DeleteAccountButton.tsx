import {
  Button,
  ButtonProps,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { BankAccountsApi } from "../api/BankAccountsApi";

export interface DeleteAccountProps extends ButtonProps {
  account_id: number;
}

export const DeleteAccountButton: React.FC<DeleteAccountProps> = ({
  account_id,
  ...rest
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Button colorScheme="red" onClick={onOpen} {...rest}>
        Delete Account
      </Button>

      <DeleteAccountModal
        account_id={account_id}
        isOpen={isOpen}
        onClose={onClose}
      />
    </>
  );
};

interface DeleteAccountModalProps {
  account_id: number;
  isOpen: boolean;
  onClose: () => void;
}

const DeleteAccountModal: React.FC<DeleteAccountModalProps> = ({
  account_id,
  isOpen,
  onClose,
}) => {
  const queryClient = useQueryClient();
  const toast = useToast();

  const { mutate, isPending } = useMutation<void, Error, void>({
    mutationFn: () => BankAccountsApi.delete(account_id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
      onClose();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
    },
  });

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay
        bg="blackAlpha.300"
        backdropFilter="blur(10px)" // This creates the blur effect
      />
      <ModalContent>
        <ModalHeader>
          Confirm Account Deletion
          <ModalCloseButton />
        </ModalHeader>

        <ModalBody>
          <Text>* Note: this will only "soft" delete the account</Text>
        </ModalBody>

        <ModalFooter>
          <Button
            mr={3}
            colorScheme="red"
            disabled={isPending}
            onClick={() => mutate()}
          >
            Confirm
          </Button>
          <Button onClick={onClose}>Cancel</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
