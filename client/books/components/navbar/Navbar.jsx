
import {HStack,VStack,Box,Text,Avatar,Flex} from '@chakra-ui/react';
import React, { useState } from 'react';
import { AppContext } from '../../context/Appcontext';

export default function Navbar(){

  const { user } = React.useContext(AppContext);    

    const profileSrc = {
        'admin':'https://images.unsplash.com/photo-1619946794135-5bc917a27793?ixlib=rb-0.3.5&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&s=b616b2c5b373a80ffc9636ba24f7a4a9',
        'librarian':'https://thumbs.dreamstime.com/b/woman-reading-holding-book-hands-circle-avatar-female-teacher-glasses-smart-look-educator-librarian-round-user-profile-icon-366980832.jpg',
        'guest':'https://media.istockphoto.com/id/1495088043/vector/user-profile-icon-avatar-or-person-icon-profile-picture-portrait-symbol-default-portrait.jpg?s=612x612&w=0&k=20&c=dhV2p1JwmloBTOaGAtaA3AW1KSnjsdMt7-U_3EZElZ0='
    }
    return (
       <>
       <Flex  w={"100%"} h={"10"} alignItems={'center'} justifyContent={'space-between'}>
         
          <div className="navbar__logo">
            
            </div>
         <div className="navbar__profile"> 
         <HStack>
                <Avatar size={'md'} src={profileSrc[user.role.toLowerCase()]}/>
                <VStack
                  display={{ base: 'none', md: 'flex' }}
                  alignItems="flex-start"
                  spacing="1px"
                  ml="2">
                  <Text fontSize="sm">{user.username}</Text>
                  <Text fontSize="xs" color="gray.600">
                    {user.role}
                  </Text>
                </VStack>
              </HStack>
        </div>
        </Flex>
       </>
      );
    }