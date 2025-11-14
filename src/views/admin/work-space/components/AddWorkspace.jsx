import React, { useState } from 'react';
import {
  Box,
  Flex,
  Text,
  Input,
  Button,
  useColorModeValue,
  Image,
  FormControl,
  FormLabel,
  Textarea,
  useToast,
} from '@chakra-ui/react';
import Card from 'components/card/Card';
import { gql, useMutation } from '@apollo/client';

// Updated mutation according to your backend response
const ADD_WORKSPACE = gql`
  mutation AddWorkspace($input: AddWorkspaceInput!) {
    addWorkspace(input: $input) {
      id
      name
      description
      icon
      createdAt
      updatedAt
    }
  }
`;

const AddWorkspace = ({ onClose }) => {
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const labelColor = useColorModeValue('secondaryGray.900', 'gray.400');
  const inputBg = useColorModeValue('secondaryGray.100', 'navy.900');
  const cardShadow = useColorModeValue(
    '0px 18px 40px rgba(0, 0, 0, 0.12)',
    'unset',
  );

  const toast = useToast();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    icon: '', // optional
  });
  const [fileName, setFileName] = useState('');

  const [addWorkspace, { loading }] = useMutation(ADD_WORKSPACE, {
    onCompleted: () => {
      toast({
        title: 'Workspace Added',
        description: `${formData.name} has been added successfully.`,
        status: 'success',
        duration: 3000,
        isClosable: true,
        position: 'top-right',
      });
      setFormData({ name: '', description: '', icon: '' });
      setFileName('');
      if (onClose) onClose();
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'top-right',
      });
    },
    refetchQueries: ['GetWorkspaces'],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, icon: reader.result });
      };
      reader.readAsDataURL(file);
      setFileName(file.name);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { name, description, icon } = formData;

    if (!name || !description) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields.',
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'top-right',
      });
      return;
    }

    // Only include icon if user selected a file
    const inputData = { name, description };
    if (icon) inputData.icon = icon;

    addWorkspace({ variables: { input: inputData } });
  };

  return (
    <Box pt={{ base: '10px', md: '20px' }}>
      <Card
        boxShadow={cardShadow}
        p={{ base: '20px', md: '30px' }}
        borderRadius="xl"
        maxW="650px"
        mx="auto"
      >
        <Text
          color={textColor}
          fontSize="2xl"
          fontWeight="700"
          mb="25px"
          textAlign="center"
        >
          Add New Workspace
        </Text>

        <form onSubmit={handleSubmit}>
          <Flex direction="column" gap="20px">
            <FormControl>
              <FormLabel color={labelColor} fontWeight="500" fontSize="sm">
                Workspace Name
              </FormLabel>
              <Input
                bg={inputBg}
                border="none"
                placeholder="Enter workspace name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                _placeholder={{ color: 'gray.400' }}
                _focus={{ borderColor: 'blue.400', bg: inputBg }}
              />
            </FormControl>

            <FormControl>
              <FormLabel color={labelColor} fontWeight="500" fontSize="sm">
                Description
              </FormLabel>
              <Textarea
                bg={inputBg}
                border="none"
                placeholder="Write a short description..."
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                resize="none"
                _placeholder={{ color: 'gray.400' }}
                _focus={{ borderColor: 'blue.400', bg: inputBg }}
              />
            </FormControl>

            <FormControl>
              <FormLabel color={labelColor} fontWeight="500" fontSize="sm">
                Upload Icon (Optional)
              </FormLabel>
              <Flex align="center" gap="10px">
                <Button
                  as="label"
                  htmlFor="file-upload"
                  bg="blue.500"
                  color="white"
                  fontSize="sm"
                  fontWeight="600"
                  px="20px"
                  _hover={{ bg: 'blue.600' }}
                  cursor="pointer"
                >
                  Choose File
                </Button>
                <Text fontSize="sm" color={labelColor}>
                  {fileName || 'No file chosen'}
                </Text>
              </Flex>
              <Input
                id="file-upload"
                type="file"
                accept="image/*"
                display="none"
                onChange={handleImageChange}
              />
              {formData.icon && (
                <Image
                  src={formData.icon}
                  alt="Preview"
                  mt="10px"
                  boxSize="80px"
                  borderRadius="md"
                  objectFit="cover"
                />
              )}
            </FormControl>

            <Button
              type="submit"
              bg="blue.500"
              color="white"
              _hover={{ bg: 'blue.600' }}
              fontWeight="600"
              alignSelf="flex-end"
              px="24px"
              isLoading={loading}
            >
              Add Workspace
            </Button>
          </Flex>
        </form>
      </Card>
    </Box>
  );
};

export default AddWorkspace;
