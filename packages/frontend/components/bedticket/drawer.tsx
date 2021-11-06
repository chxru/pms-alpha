import React from "react";
import Image from "next/image";
import {
  Badge,
  Divider,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerOverlay,
  Flex,
  Heading,
  Text,
} from "@chakra-ui/react";
import { PGDB } from "@pms-alpha/types";

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  data: PGDB.Patient.BedTicketEntry;
}

const AttachmentDrawer: React.FC<DrawerProps> = ({ isOpen, onClose, data }) => {
  return (
    <Drawer isOpen={isOpen} onClose={onClose} placement="right" size="lg">
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />

        <DrawerBody>
          <Heading>
            {data.type} <Badge>{data.category}</Badge>
          </Heading>
          <Text size="md">
            {data.created_at.toLocaleDateString([], {
              dateStyle: "full",
            }) +
              " " +
              data.created_at.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
              })}
          </Text>

          <Divider marginY={4} />

          <Text size="lg">{data.note ?? "no-notes"}</Text>

          <Divider marginY={4} />

          <Flex direction="column">
            {data.attachments.map((photo) => (
              <Image
                key={photo.fileName}
                src={`http://localhost:3448/files/${photo.fileName}`}
                width="100%"
                height={250}
                alt="Attachment"
              />
            ))}
          </Flex>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};

export default AttachmentDrawer;
