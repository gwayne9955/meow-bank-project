import {
  Button,
  ButtonProps,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { CreateTransferForm, FundTransfersApi } from "../api/FundTransfersApi";
import { FundTransfer } from "../types";
import { MoneyInput } from "./MoneyInput";

export const TransferFundsButton: React.FC<ButtonProps> = ({ ...rest }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Button colorScheme="green" onClick={onOpen} {...rest}>
        Transfer Funds
      </Button>

      <TransferFundsModal isOpen={isOpen} onClose={onClose} />
    </>
  );
};

interface TransferFundsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TransferFundsModal: React.FC<TransferFundsModalProps> = ({
  isOpen,
  onClose,
}) => {
  const queryClient = useQueryClient();
  const toast = useToast();

  const {
    handleSubmit,
    register,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm<CreateTransferForm>();

  // Function to handle modal closing
  const handleClose = () => {
    reset({
      from_account: undefined,
      to_account: undefined,
      amount_cents: undefined,
      notes: null,
    });
    onClose();
  };

  const { mutate, isPending } = useMutation<
    FundTransfer,
    Error,
    CreateTransferForm
  >({
    mutationFn: (data: CreateTransferForm) => FundTransfersApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
      queryClient.invalidateQueries({ queryKey: ["transfers"] });
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
    <Modal isOpen={isOpen} onClose={handleClose}>
      <ModalOverlay
        bg="blackAlpha.300"
        backdropFilter="blur(10px)" // This creates the blur effect
      />
      <ModalContent>
        <ModalHeader>
          Transfer Funds Between Bank Accounts
          <ModalCloseButton />
        </ModalHeader>
        <ModalBody>
          <form onSubmit={handleSubmit((data) => mutate(data))}>
            <FormControl isInvalid={!!errors.from_account} mb={4}>
              <FormLabel>From Account ID</FormLabel>
              <Input
                {...register("from_account", {
                  required: "From account is required",
                  pattern: {
                    value: /^\d+$/,
                    message: "IDs must be whole numbers",
                  },
                })}
                type="number"
                placeholder="1245"
              />
              <FormErrorMessage>
                {errors.from_account?.message}
              </FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!errors.to_account} mb={4}>
              <FormLabel>To Account ID</FormLabel>
              <Input
                {...register("to_account", {
                  required: "To account is required",
                  pattern: {
                    value: /^\d+$/,
                    message: "IDs must be whole numbers",
                  },
                })}
                type="number"
                placeholder="1245"
              />
              <FormErrorMessage>{errors.to_account?.message}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!errors.amount_cents} mb={4}>
              <FormLabel>Amount</FormLabel>
              <MoneyInput name="amount_cents" control={control} isRequired />
            </FormControl>

            <ModalFooter>
              <Button
                mr={3}
                colorScheme="blue"
                isLoading={isSubmitting}
                isDisabled={isPending}
                type="submit"
              >
                Create Transfer
              </Button>
              <Button onClick={handleClose}>Cancel</Button>
            </ModalFooter>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
