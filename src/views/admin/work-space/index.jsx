import React, { useState } from 'react';
import { Button, Icon, useDisclosure } from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';
import Card from 'views/admin/work-space/components/Cards';
import AddWorkspace from 'views/admin/work-space/components/AddWorkspace';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  ModalBody,
} from '@chakra-ui/react';

const Index = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <div style={{ position: 'relative' }}>
      {/* Main Workspace Cards */}
      <Card />
    
      {/* Floating Add Button
      <Button
        position="fixed"
        bottom="30px"
        right="30px"
        colorScheme="blue"
        borderRadius="full"
        boxSize="60px"
        shadow="lg"
        onClick={onOpen}
        display="flex"
        alignItems="center"
        justifyContent="center"
        transition="transform 0.3s ease, background 0.3s ease"
        _hover={{
          bg: 'blue.900',
        }}
      >
        <Icon as={AddIcon} boxSize="20px" color="white" />
      </Button> */}

      {/* Modal for Add Workspace */}
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent maxW="650px" borderRadius="xl" p="10px">
          <ModalCloseButton />
          <ModalBody>
            <AddWorkspace />
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default Index;
