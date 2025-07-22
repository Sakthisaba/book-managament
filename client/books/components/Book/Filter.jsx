import React from 'react';
import {
    Button,
    Popover,
    PopoverTrigger,
    PopoverContent,
    PopoverHeader,
    PopoverBody,
    PopoverFooter,
    PopoverArrow,
    PopoverCloseButton,
    Checkbox,
    Stack,
    VStack,
    useDisclosure,
    Heading,
} from '@chakra-ui/react';

import { MdFilterAlt } from "react-icons/md";
const Filter = ({ options, onApplyFilter, handleCancel, selectedFilters, setSelectedFilters }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const handleCheckboxChange = (option) => {
        setSelectedFilters((prev) =>
            prev.includes(option)
                ? prev.filter((item) => item !== option)
                : [...prev, option]
        );
    };

    const handleApply = () => {
        onApplyFilter(selectedFilters);
        onClose();
    };

    const handleCancelClick = () => {
        onClose();
    };

    return (
        <Popover isOpen={isOpen} onClose={onClose}>
            <PopoverTrigger>
             <MdFilterAlt onClick={onOpen} color='grey.300' cursor={'pointer'} />
            </PopoverTrigger>
            <PopoverContent>
                <PopoverArrow />
                <PopoverCloseButton />
                <PopoverHeader>Filter Options</PopoverHeader>
                <PopoverBody>
                    <VStack align="start" spacing={4}>
                        <Heading size="sm">Select Filters:</Heading>
                        <Stack spacing={3}>
                            {options.map((option) => (
                                <Checkbox
                                    key={option}
                                    isChecked={selectedFilters.includes(option)}
                                    onChange={() => handleCheckboxChange(option)}
                                >
                                    {option}
                                </Checkbox>
                            ))}
                        </Stack>
                    </VStack>
                </PopoverBody>
                <PopoverFooter display="flex" justifyContent="flex-end" gap="10px">
                    <Button colorScheme="blue" onClick={handleApply}>
                        Apply
                    </Button>
                    <Button variant="outline" colorScheme="red" onClick={() => { handleCancelClick()}}>
                        Cancel
                    </Button>
                </PopoverFooter>
            </PopoverContent>
        </Popover>
    );
};

export default Filter;