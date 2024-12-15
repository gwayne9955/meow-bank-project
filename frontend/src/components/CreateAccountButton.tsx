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
import { BankAccountsApi, CreateAccountForm } from "../api/BankAccountsApi";

export const CreateAccountButton: React.FC = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Button colorScheme="blue" onClick={onOpen}>
        Create Account
      </Button>

      <CreateAccountModal isOpen={isOpen} onClose={onClose} />
    </>
  );
};

interface CreateAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateAccountModal: React.FC<CreateAccountModalProps> = ({
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
  } = useForm<CreateAccountForm>({
    defaultValues: {
      currency: "USD", // Prefill currency field
    },
  });

  // Function to handle modal closing
  const handleClose = () => {
    reset({
      account_name: "",
      customer_id: undefined,
      balance: undefined,
      currency: "USD", // Keep the default value
      notes: null,
    });
    onClose();
  };

  const onSubmit = async (values: CreateAccountForm) => {
    try {
      await BankAccountsApi.create(values);
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
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
        <ModalHeader>Create Account</ModalHeader>
        <ModalBody>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FormControl isInvalid={!!errors.account_name} mb={4}>
              <FormLabel>Account Name</FormLabel>
              <Input
                {...register("account_name", {
                  required: "Account name is required",
                  minLength: {
                    value: 2,
                    message: "Minimum length should be 2",
                  },
                })}
              />
              <FormErrorMessage>
                {errors.account_name?.message}
              </FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!errors.customer_id} mb={4}>
              <FormLabel>Customer ID</FormLabel>
              <Input
                type="number"
                {...register("customer_id", {
                  required: "Customer ID is required",
                  valueAsNumber: true,
                  min: { value: 1, message: "Customer ID must be positive" },
                })}
              />
              <FormErrorMessage>{errors.customer_id?.message}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!errors.balance} mb={4}>
              <FormLabel>Initial Balance</FormLabel>
              <Input
                type="number"
                step="0.01"
                {...register("balance", {
                  required: "Initial balance is required",
                  valueAsNumber: true,
                  min: { value: 0, message: "Balance must be non-negative" },
                  validate: {
                    decimals: (v) =>
                      !v ||
                      v * 100 === Math.round(v * 100) ||
                      "Amount cannot have more than 2 decimal places",
                  },
                })}
                placeholder="0.00"
              />
              <FormErrorMessage>{errors.balance?.message}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!errors.currency} mb={4}>
              <FormLabel>Currency</FormLabel>
              <Input {...register("currency")} defaultValue="USD" />
            </FormControl>

            <FormControl isInvalid={!!errors.notes} mb={4}>
              <FormLabel>Notes</FormLabel>
              <Input
                {...register("notes")}
                placeholder="Optional notes about the account"
              />
              <FormErrorMessage>{errors.notes?.message}</FormErrorMessage>
            </FormControl>

            <ModalFooter>
              <Button
                mr={3}
                colorScheme="blue"
                isLoading={isSubmitting}
                type="submit"
              >
                Create Account
              </Button>
              <Button onClick={handleClose}>Cancel</Button>
            </ModalFooter>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
