
import { Alert, AlertIcon, AlertTitle } from "@chakra-ui/react";

export function AlertBox({ message }) {
  return (
    <Alert status="error">
      <AlertIcon />
      <AlertTitle fontSize={"1vw"} fontWeight={"normal"}>{message}</AlertTitle>
    </Alert>
  );
}
