
import { Box, Stack, VStack } from "@chakra-ui/react";
import BookDashboard from "../Book/BookDashboard";
import BookForm from "../Book/BookForm";
import Navbar from "../navbar/Navbar";
import Sidebar from "../sidebar/Sidebar";
import {Routes,Route } from "react-router-dom";
import React from "react";
import { fetchAllBooks } from "../../service/api";

import { AppContext } from "../../context/Appcontext";
import hasPermission from "../../utils/permission";
import Loader from "../loader/loader";
export default function Home(){
    const { setBookData, user, setAuthors, setGenre,tableLength ,settotalbooks} = React.useContext(AppContext);
    const [isLoading, setIsLoading] = React.useState(true);
    React.useEffect(() => {
        fetchAllBooks(tableLength,[1,10]).then((data) => {
          if (data.success) {
            setIsLoading(false);
            setBookData(data.books);
            settotalbooks(data.totalbooks);
            setAuthors(data.authors);
            setGenre(data.genre);
          }
        });
      }, []);

if (isLoading)return(<Loader></Loader>)
return (
   <>
   <Stack direction="row" spacing={0} height="100%">
   <Sidebar w={'20%'}></Sidebar>
   <Box width="100%" flex="1" p={4}>
   <VStack >
    <Navbar></Navbar>
    <Routes>
      <Route exact path="*" element={<BookDashboard />} />
      <Route path='addbook' element={(hasPermission(user,'add:book')&&<BookForm isOpen={true} onClose={()=>{}}   bookData={{}} isEdit={false} isDelete={false} selectedBooks={[]} setSelectedBooks={()=>{} }  />) || <>AccessDenied</>}/>
      <Route path='editbook/*' element={(hasPermission(user,'add:book')&&<BookForm isOpen={true} onClose={()=>{}}   bookData={{}} isEdit={false} isDelete={false} selectedBooks={[]} setSelectedBooks={()=>{} }  />) || <>AccessDenied</>} />
    </Routes>
   </VStack>
   </Box>
</Stack>
  
   </>
  );
}