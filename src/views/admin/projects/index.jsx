import React from 'react';
import {
  Button,
  Icon,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  ModalBody,
} from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';
import AddProject from 'views/admin/projects/components/AddProject';
import ProjectSearch from './components/ProjectSearch';

const Index = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <div style={{ position: 'relative', paddingTop: '20px' }}>
      {/* Project Search */}
      <div style={{ marginTop: '60px' }}>
        <ProjectSearch />
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

      {/* Modal for Adding Workspace */}
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent maxW="650px" borderRadius="xl" p="10px">
          <ModalCloseButton />
          <ModalBody>
            <AddProject onClose={onClose} />
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default Index;
