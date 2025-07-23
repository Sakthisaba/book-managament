import React, { useState,useEffect } from 'react';
import { Stack,VStack,FormControl, FormLabel, Input, InputGroup, Button, Heading, Flex, HStack, IconButton, } from "@chakra-ui/react";
import { MdAddCircle } from "react-icons/md";
import { AppContext } from '../../context/Appcontext';
import { MdKeyboardBackspace } from "react-icons/md";
import { MdOutlineFilterAlt } from "react-icons/md";
import { addBook,deleteBook,fetchAllBooks,updateBook } from '../../service/api';
import validation from '../../service/validation';
import './addBook.css';
import { useNavigate } from 'react-router-dom';
import {useSearchParams} from 'react-router-dom';
import AuthorField from './AuthorField.jsx'
 
export default function BookForm({}) {
    var editBookData = undefined;
    var bookid = undefined;
    const isEdit = window.location.pathname.includes('editbook');
    const [query ] = useSearchParams();
    bookid = query.get('id');
    
   
    const [error, setError] = useState({});
    const [onSubmittion, setonSubmittion] = useState(false);
    const [isSubmitted, setisSubmitted] = useState(false);
    const [onSubmitError, setonSubmitError] = useState(false);
    const [noBookIDError, setNoBookIDError] = useState(false);
    const [formData, setFormData] = useState({
        bookname:  '',
        isbn: '',
        authorid:  '',
        genre: '',
        noofcopies:  '',
    });

    const { authors, genre, user ,setBookData,bookdata,tableLength,settotalbooks} = React.useContext(AppContext);


    if(isEdit){
        editBookData = bookdata.find((book) => book.id == bookid);
        if (!editBookData) {
            console.error("Book ID is required for editing.");
            // setNoBookIDError(true);
        }
       
    }
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        setonSubmitError(false);
        setFormData({ ...formData, [name]: value });
    };

  

    const onSubmitHandler = (e) => {
      setonSubmittion(true);
      e.preventDefault();

      //validation
      const errors = validation.bookSubmissionValidation(formData);
      if (Object.keys(errors).length > 0) {
        setError(errors);
        setonSubmittion(false);
      } else {

        //if no errors do this.
        setError({});
        // If editing, we can pass the bookData to the addBook function
        if (isEdit) {
          updateBook(bookid, formData, user.userid).then((response) => {
            setonSubmittion(false);
            if (response.success) {
              setisSubmitted(true);
              fetchAllBooksAfterUpdate();
            } else {
              setonSubmitError(true);
            }
          });
        } else {

          //add book through this api service
          addBook(formData, user.userid).then((response) => {
            setonSubmittion(false);
            if (response.success) {
              setisSubmitted(true);
              fetchAllBooksAfterUpdate();
            } else {
              setonSubmitError(true);
            }
          });
        }
      }
    };

    const fetchAllBooksAfterUpdate = () => {
        fetchAllBooks(tableLength,[1,tableLength]).then((data) => {
            if (data.success) {
              setBookData(data.books);
              settotalbooks(data.totalbooks);
            }
          });
    }

    const navigate = useNavigate();
    const goBack=()=>{
             navigate('/');
    
    }
    useEffect(() => {
        if (editBookData) {
          setFormData({
            bookname: editBookData.title || '',
            isbn: editBookData.isbn || '',
            authorid: editBookData.authorid || '',
            genre: editBookData.genre || '',
            noofcopies: editBookData.noofcopies || '',
          });
        }
      }, [bookdata]);


    // if(!editBookData&&isEdit){return (<>NO BOOK FOUND</>)}
    return (
      <VStack w={"80%"}>
      <Flex w={"80%"} display={"flex"} justifyContent={"start"}>
        <IconButton
        onClick={goBack}
        aria-label="Back"
        icon={<MdKeyboardBackspace />}
        />
      </Flex>
      <form onSubmit={onSubmitHandler}>
        <Heading>{isEdit ? "Update Book" : "Add Book"}</Heading>
        {!isSubmitted && (
        <HStack display="flex" justifyContent="center">
          <Stack
          spacing={4}
          className="formcon"
          p="1rem"
          backgroundColor="whiteAlpha.900"
          boxShadow="none"
          w="20em"
          >
          <FormControl
          
            boxShadow="none"
            isInvalid={error.length > 0}
          >
            <FormLabel className="lables">Book Name</FormLabel>
            <InputGroup>
            <Input
              name="bookname"
              type="text"
              placeholder="Book Name"
              value={formData.bookname}
            
              onChange={handleChange}
            />
            </InputGroup>
            {error.bookname && (
            <div className="errormessage" marginy="1em">
              {error.bookname}
            </div>
            )}

            <AuthorField
            formData={formData}
            setFormData={setFormData}
            error={error}
            handleChange={handleChange}
            />
            {error.authorid && (
            <div className="errormessage" marginy="1em">
              {error.authorid}
            </div>
            )}

            <FormLabel className="lables">Genre</FormLabel>
            <InputGroup>
                    <select
                      name="genre"
                      className="selectBox"
                      id="meun-items"
                      
                      onChange={handleChange}
                      value={formData.genre}
                    >
                      <option disabled value="">
                        Select Genre
                      </option>
                      {genre.map((data) => (
                        <option key={data.id} value={data.genre}>
                          {data.genre}
                        </option>
                      ))}
                    </select>
            </InputGroup>
            {error.genre && (
            <div className="errormessage" marginy="1em">
              {error.genre}
            </div>
            )}

            <FormLabel className="lables">ISBN Number</FormLabel>
            <InputGroup>
            <Input
              name="isbn"
              type="number"
              placeholder="ISBN Number"
              value={formData.isbn}
              onChange={handleChange}
              
            />
            </InputGroup>
            {error.isbn && (
            <div className="errormessage" marginy="1em">
              {error.isbn}
            </div>
            )}

            <FormLabel className="lables">No of Copies</FormLabel>
            <InputGroup>
            <Input
              name="noofcopies"
              type="number"
              min={1}
              max={10000}
              placeholder="No of Copies Available"
              value={formData.noofcopies}
              onChange={handleChange}
            
            />
            </InputGroup>
            {error.noofcopies && (
            <div className="errormessage" marginy="1em">
              {error.noofcopies}
            </div>
            )}
          </FormControl>
          </Stack>
        </HStack>
        )}
        {isSubmitted && (
        <Flex>
          <Heading fontSize="xl" margin={"5vw"} color="green.400">
          {isEdit
            ? "Edited Book Successfully!"
            : "Added Book Successfully!"}
          </Heading>
        </Flex>
        )}

        <Flex justifyContent={"center"} width={"100%"} padding={"1rem"}>
        {!onSubmittion && !isSubmitted && (
          <Button 
          w={"100%"} className='actionbutton'
          padding={"1.5vw"}
          leftIcon={!isEdit && <MdAddCircle />}
          colorScheme={"orange"}
          type="submit"
          >
          {isEdit ? "Update" : "Add"}
          </Button>
        )}
        {onSubmittion && (
          <Button
          w={"100%"}
          isLoading
          loadingText={isEdit ? "Updating" : "Adding"}
          colorScheme={"orange"}
          type="submit"
          >
          {isEdit ? "Updating" : "Adding"}
          </Button>
        )}
        </Flex>
      </form>
      {onSubmitError && (
        <Flex>
        <Heading fontSize="s" margin={"0.5vw"} color="yellow.400">
          Something Went wrong, try again later!
        </Heading>
        </Flex>
      )}
      </VStack>
    );
}






