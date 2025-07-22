import React from 'react'
import { useContext } from 'react';
import { deleteBook } from '../../service/api';
import { AppContext } from '../../context/Appcontext';
import { MdDelete } from "react-icons/md";
import { Modal,ModalOverlay,ModalCloseButton,ModalBody,ModalHeader,ModalFooter,Button, ModalContent, Heading } from '@chakra-ui/react'
export default function DeleteForm({selectedBooks,deleteBookData,fetchAllBooksAfterUpdate,setSelectedBooks,onClose}) {

  const [isSuccess, setSuccess] = React.useState(false);
  const [onSubmitError, setonSubmitError] = React.useState(false);
  const { user } = React.useContext(AppContext);
  const deleteBooks = () => {
    let booklist = selectedBooks.length>0? selectedBooks : [deleteBookData];
    booklist = booklist.map((book)=>book.id);

    //use deleteBook from api service
     deleteBook(booklist, user.userid).then((response) => {
        if (response.success) {
            setSelectedBooks([]);
            setSuccess(true);
            fetchAllBooksAfterUpdate();
        } else {
            setonSubmitError(true);
        }});
    
     
}
    return (
        <>       
        <Modal
           isCentered
           onClose={onClose}
           isOpen={true}
           motionPreset='slideInBottom'
         >
           <ModalOverlay />
           <ModalContent>
             <ModalHeader>Delete Book</ModalHeader>
             <ModalCloseButton />
             <ModalBody>
               {!isSuccess&&!onSubmitError&&<Heading fontSize={'l'}>Are you sure you want to delete?</Heading>}
               {isSuccess&&<Heading fontSize={'xl'} color={'green.400'}> Successfully Deleted</Heading>}            
               {onSubmitError&&<Heading fontSize={'xl'} color={'yellow.400'}> Something went wrong!Couldnt perform action.</Heading>}   
               </ModalBody>
             <ModalFooter>
               <Button colorScheme='gray' mr={3} onClick={onClose} className='cancel-delete'>
                 Cancle
               </Button>
               {!isSuccess&&<Button variant='solid' leftIcon={<MdDelete/>} className='confirm-delete' colorScheme='red' onClick={deleteBooks}>Delete</Button>}
             </ModalFooter>
           </ModalContent>
         </Modal>
       </>
    )
  }