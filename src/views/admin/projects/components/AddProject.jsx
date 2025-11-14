import React, { useState, useMemo } from 'react';
import {
  Box,
  Flex,
  Text,
  Input,
  Button,
  Select,
  Textarea,
  FormControl,
  FormLabel,
  useToast,
  useColorModeValue,
} from '@chakra-ui/react';
import Card from 'components/card/Card';

// Sample Workspaces
const workspaces = [
  { id: 1, name: 'Workspace A' },
  { id: 2, name: 'Workspace B' },
];

const AddProject = ({ onClose }) => {
  const toast = useToast();
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const labelColor = useColorModeValue('secondaryGray.600', 'gray.400');
  const inputBg = useColorModeValue('secondaryGray.100', 'navy.900');
  const cardShadow = useColorModeValue(
    '0px 18px 40px rgba(112, 144, 176, 0.12)',
    'unset',
  );

  const initialState = useMemo(
    () => ({
      workspaceId: '',
      name: '',
      note: '',
    }),
    [],
  );

  const [formData, setFormData] = useState(initialState);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.workspaceId || !formData.name) {
      toast({
        title: 'Error',
        description: 'Workspace and Project Name are required.',
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'top-right',
      });
      return;
    }

    console.log('New Project:', formData);

    toast({
      title: 'Project Added',
      description: `${formData.name} has been added successfully.`,
      status: 'success',
      duration: 3000,
      isClosable: true,
      position: 'top-right',
    });

    setFormData(initialState);
    if (onClose) onClose();
  };

  const inputProps = {
    bg: inputBg,
    border: 'none',
    borderRadius: 'md',
    _hover: { borderColor: 'blue.400' },
    _focus: { borderColor: 'blue.400', boxShadow: '0 0 0 1px blue.400' },
  };

  return (
    <Box pt={{ base: '10px', md: '20px' }}>
      <Card
        boxShadow={cardShadow}
        p={{ base: '20px', md: '30px' }}
        borderRadius="xl"
        maxW="600px"
        mx="auto"
      >
        <Text
          fontSize="2xl"
          fontWeight="700"
          mb="25px"
          textAlign="center"
          color={textColor}
        >
          Add New Project
        </Text>

        <form onSubmit={handleSubmit}>
          <Flex direction="column" gap="20px">
            {/* Workspace Dropdown */}
            <FormControl isRequired>
              <FormLabel color={labelColor} fontSize="sm">
                Select Workspace
              </FormLabel>
              <Select
                placeholder="Select workspace"
                name="workspaceId"
                value={formData.workspaceId}
                onChange={handleChange}
                {...inputProps}
              >
                {workspaces.map((ws) => (
                  <option key={ws.id} value={ws.id}>
                    {ws.name}
                  </option>
                ))}
              </Select>
            </FormControl>

            {/* Project Name */}
            <FormControl isRequired>
              <FormLabel color={labelColor} fontSize="sm">
                Project Name
              </FormLabel>
              <Input
                placeholder="Enter project name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                {...inputProps}
              />
            </FormControl>

            {/* Note */}
            <FormControl>
              <FormLabel color={labelColor} fontSize="sm">
                Note
              </FormLabel>
              <Textarea
                placeholder="Add any notes..."
                name="note"
                value={formData.note}
                onChange={handleChange}
                rows={3}
                resize="none"
                {...inputProps}
              />
            </FormControl>

            <Button
              type="submit"
              bg="blue.500"
              color="white"
              _hover={{ bg: 'blue.600' }}
              fontWeight="600"
              alignSelf="flex-end"
              px="24px"
            >
              Add Project
            </Button>
          </Flex>
        </form>
      </Card>
    </Box>
  );
};

export default AddProject;
