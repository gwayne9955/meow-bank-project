import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { CreateTransferForm, FundTransfersApi } from "../api/FundTransfersApi";

export const TransferFundsButton: React.FC = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Button colorScheme="green" onClick={onOpen}>
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
    formState: { errors, isSubmitting },
  } = useForm<CreateTransferForm>();

  // Function to handle modal closing
  const handleClose = () => {
    reset({
      from_account: undefined,
      to_account: undefined,
      amount: undefined,
      notes: null,
    });
    onClose();
  };

  const onSubmit = async (values: CreateTransferForm) => {
    try {
      await FundTransfersApi.create(values);
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
      queryClient.invalidateQueries({ queryKey: ["transfers"] });
      handleClose();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <ModalContent>
        <ModalHeader>Transfer Funds Between Bank Accounts</ModalHeader>
        <ModalBody>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FormControl isInvalid={!!errors.from_account} mb={4}>
              <FormLabel>From Account</FormLabel>
              <Input
                {...register("from_account", {
                  required: "From account is required",
                  valueAsNumber: true,
                })}
              />
              <FormErrorMessage>
                {errors.from_account?.message}
              </FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!errors.to_account} mb={4}>
              <FormLabel>To Account</FormLabel>
              <Input
                {...register("to_account", {
                  required: "To account is required",
                  valueAsNumber: true,
                })}
              />
              <FormErrorMessage>{errors.to_account?.message}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!errors.amount} mb={4}>
              <FormLabel>Amount</FormLabel>
              <Input
                type="number"
                step="0.01"
                {...register("amount", {
                  required: "Amount is required",
                  valueAsNumber: true,
                  min: {
                    value: 0.01,
                    message: "Amount must be greater than 0",
                  },
                  validate: {
                    decimals: (v) =>
                      !v ||
                      v * 100 === Math.round(v * 100) ||
                      "Amount cannot have more than 2 decimal places",
                  },
                })}
                placeholder="1.00"
              />
              <FormErrorMessage>{errors.amount?.message}</FormErrorMessage>
            </FormControl>

            <ModalFooter>
              <Button
                mr={3}
                colorScheme="blue"
                isLoading={isSubmitting}
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
