import {
  FormControl,
  FormErrorMessage,
  Input,
  InputGroup,
  InputLeftElement,
} from "@chakra-ui/react";
import { useState } from "react";
import { Control, Controller, FieldValues, Path } from "react-hook-form";

interface MoneyInputProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  placeholder?: string;
  isRequired?: boolean;
  isDisabled?: boolean;
  currency?: string;
  validationMessage?: string;
}

/**
 * Will store the form value as cents, not a decimal
 */
export const MoneyInput = <T extends FieldValues>({
  name,
  control,
  placeholder = "0.00",
  isRequired = false,
  isDisabled = false,
  currency = "$",
  validationMessage = "This field is required",
}: MoneyInputProps<T>) => {
  const [displayValue, setDisplayValue] = useState<string>("");

  const centsToDisplay = (cents: number | null): string => {
    if (cents === null) return "";
    return (cents / 100).toFixed(2);
  };

  const displayToCents = (value: string): number | null => {
    if (!value) return null;
    const numberValue = parseFloat(value.replace(/[^\d.-]/g, ""));
    return Math.round(numberValue * 100);
  };

  return (
    <Controller
      name={name}
      control={control}
      rules={{
        required: isRequired ? validationMessage : false,
      }}
      render={({
        field: { onChange, value, onBlur },
        formState: { errors },
      }) => (
        <FormControl isInvalid={!!errors[name]}>
          <InputGroup>
            <InputLeftElement pointerEvents="none">{currency}</InputLeftElement>

            <Input
              type="number"
              value={
                displayValue || (value === null ? "" : centsToDisplay(value))
              }
              onChange={(e) => {
                const input = e.target.value;
                const regex = /^\d*.?\d{0,2}$/;
                if (regex.test(input) || input === "") {
                  setDisplayValue(input);
                  onChange(displayToCents(input));
                }
              }}
              onBlur={(e) => {
                onBlur();
                if (value !== null) {
                  setDisplayValue(centsToDisplay(value));
                }
              }}
              placeholder={placeholder}
              isDisabled={isDisabled}
              step="0.01"
              min="0"
            />
          </InputGroup>

          {errors[name] && (
            <FormErrorMessage>
              {errors[name]?.message as string}
            </FormErrorMessage>
          )}
        </FormControl>
      )}
    />
  );
};
