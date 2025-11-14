import React, { useState } from 'react';
import {
  Button,
  Icon,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  ModalBody,
  useColorModeValue,
} from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';
import AddUser from './components/AddUser';
import UserSearch from './components/UserSearch';

const Index = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [refreshKey, setRefreshKey] = useState(0); // Used to trigger re-render of UserSearch

  const handleAddUser = () => {
    // Refresh the user list by updating the key
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div style={{ position: 'relative', paddingTop: '20px' }}>
      {/* User Search */}
      <div style={{ marginTop: '60px' }}>
        <UserSearch key={refreshKey} />
      </div>

      {/* Floating Add Button */}
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
          transform: 'rotate(90deg)',
        }}
      >
        <Icon as={AddIcon} boxSize="20px" color="white" />
      </Button>

      {/* Modal for Adding User */}
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent maxW="650px" borderRadius="xl" p="10px">
          <ModalCloseButton />
          <ModalBody>
            <AddUser onClose={onClose} onAdd={handleAddUser} />
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default Index;
