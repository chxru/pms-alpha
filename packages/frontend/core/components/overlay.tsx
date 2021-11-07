import React from "react";
import { Box, Flex, Icon, Text, useToast } from "@chakra-ui/react";
import { IconType } from "react-icons";
import {
  IoIosCloseCircle,
  IoMdAlert,
  IoMdCheckmarkCircle,
} from "react-icons/io";

import NotifyContext from "@pms-alpha/common/contexts/notify-context";

interface AlertCardProps {
  msg: string;
  status: "success" | "error" | "warning" | "info";
  description?: string;
}

const AlertCard: React.FC<AlertCardProps> = ({ msg, status, description }) => {
  let icon: IconType, color: string;
  switch (status) {
    case "success":
      icon = IoMdCheckmarkCircle;
      color = "green.500";
      break;

    case "info":
      icon = IoMdAlert;
      color = "blue.500";
      break;

    case "warning":
      icon = IoMdAlert;
      color = "yellow.400";
      break;

    default:
      icon = IoIosCloseCircle;
      color = "red.500";
      break;
  }

  return (
    <Flex
      maxW="sm"
      w="full"
      mx="auto"
      bg="white"
      shadow="md"
      rounded="lg"
      overflow="hidden"
    >
      <Flex justifyContent="center" alignItems="center" w={12} bg={color}>
        <Icon as={icon} color="white" boxSize={6} />
      </Flex>

      <Box mx={-3} py={2} px={4}>
        <Box mx={3}>
          <Box color={color} fontWeight="bold">
            {msg}
          </Box>
          <Text color="gray.600" fontSize="sm">
            {description}
          </Text>
        </Box>
      </Box>
    </Flex>
  );
};

const Overlay: React.FC = ({ children }) => {
  const toast = useToast();
  const newAlert = ({
    msg,
    status = "success",
    description,
  }: {
    msg: string;
    status: "success" | "error" | "warning" | "info";
    description?: string;
  }) => {
    toast({
      position: "bottom-right",
      // eslint-disable-next-line react/display-name
      render: () => (
        <AlertCard msg={msg} status={status} description={description} />
      ),
    });
  };

  return (
    <NotifyContext.Provider value={{ NewAlert: newAlert }}>
      <div style={{ width: "100vw", height: "100vh" }}>{children}</div>
    </NotifyContext.Provider>
  );
};

export default Overlay;
