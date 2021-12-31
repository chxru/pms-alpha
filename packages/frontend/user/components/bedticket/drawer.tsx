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
import { API } from "@pms-alpha/types";

import { ConvertTimestamp } from "@pms-alpha/common/util/time";

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  data: API.Bedtickets.Entries;
}

const AttachmentDrawer: React.FC<DrawerProps> = ({ isOpen, onClose, data }) => {
  return (
    <Drawer isOpen={isOpen} onClose={onClose} placement="right" size="lg">
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />

        <DrawerBody>
          <Heading>
            {data.topic} <Badge>{data.category}</Badge>
          </Heading>
          <Text size="md">
            {ConvertTimestamp(data.created_at).toLocaleDateString([], {
              dateStyle: "full",
            }) +
              " " +
              ConvertTimestamp(data.created_at).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
              })}
          </Text>

          <Divider marginY={4} />

          <Text size="lg">{data.note ?? "no-notes"}</Text>

          <Divider marginY={4} />

          <Flex direction="column">
            {data.attachments &&
              data.attachments.map((photo: API.Bedtickets.Attachment) => (
                <Image
                  key={photo.current_name}
                  src={`http://localhost:3448/files/${photo.current_name}`}
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
