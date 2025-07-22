import React, { useState, useEffect ,useRef} from 'react';
import { FormLabel, InputGroup, Input, Spinner, Box } from '@chakra-ui/react';


import { Debouncer } from '../../utils/debounce';

const AuthorField = ({ formData, setFormData, error, handleChange }) => {
    const debouncer = new Debouncer();
    const [authors, setAuthors] = useState([]); 
    const [loading, setLoading] = useState(false); 
    const [query, setQuery] = useState(''); 
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true); 
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null); 

    const fetchAuthors = async (searchQuery, pageNumber) => {
        setLoading(true);
        try {
            const response = await fetch(
                `https://book-managament.onrender.com/getauthors?query=${searchQuery}&page=${pageNumber}`
            ); 
            const data = await response.json();
            if (data.authors.length > 0) {
                setAuthors((prev) => [...prev, ...data.authors]); 
            } else {
                setHasMore(false); 
            }
        } catch (error) {
            console.error('Error fetching authors:', error);
        } finally {
            setLoading(false);
        }
    };


    const handleSearchChange = (e) => {
        const value = e.target.value;
        setQuery(value);
        setAuthors([]); 
        setPage(1); 
        setHasMore(true); 
        setIsDropdownOpen(true); 
        //Apply debouncer for fetchAuthors call
        if(!debouncer.debounce(fetchAuthors,value, 1)){
            return;
        }
        
    };


    const handleScroll = (e) => {
        const { scrollTop, scrollHeight, clientHeight } = e.target;
        if (scrollTop + clientHeight >= scrollHeight - 10 && hasMore && !loading) {
            setPage((prev) => prev + 1); 
        }
    };


    useEffect(() => {
        if (page >= 1) {
            fetchAuthors(query, page);
        }
    }, [page]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false); // Close the dropdown
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
    <Box position="relative">
        <FormLabel className="lables">Author</FormLabel>
        <InputGroup>
            <Input
                name="authorid"
                type="text"
                placeholder="Search Author"
                value={formData.author?.name}
                autoComplete='off'
                onChange={(e) => {
                    handleChange(e);
                    handleSearchChange(e);
                }}
                onFocus={() => setIsDropdownOpen(true)} // Open dropdown on focus
            />
            {loading && <Spinner size="sm" ml={2} />}
        </InputGroup>
        {isDropdownOpen && (
            <Box
                ref={dropdownRef}
                position="absolute"
                top="100%"
                left="0"
                width="100%"
                maxHeight="150px"
                overflowY="auto"
                border="1px solid #ccc"
                borderRadius="4px"
                backgroundColor="white"
                zIndex="10"
                className='dropdown-author'
                mt={1}
                onScroll={handleScroll}
            >
                {authors.map((author) => (
                    <Box
                        key={author.id}
                        className={author.id}
                        p={2}
                        _hover={{ backgroundColor: 'gray.100', cursor: 'pointer' }}
                        onClick={() => {
                            setFormData({ ...formData, author: author});
                            setIsDropdownOpen(false); 
                        }}
                    >
                        {author.name}
                    </Box>
                ))}
                {!loading && authors.length === 0 && (
                    <Box p={2} textAlign="center" color="gray.500">
                        No authors found
                    </Box>
                )}
            </Box>
        )}
       
    </Box>

    );
};

export default AuthorField;
