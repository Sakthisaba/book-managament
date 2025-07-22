import { Divider, Flex, Heading, VStack,Button ,Text as TextElement} from "@chakra-ui/react";
import './sidebar.css';
import { AppContext } from "../../context/Appcontext";
import { useNavigate } from "react-router-dom";
import React, { useContext } from "react";

export default function Sidebar() {
    const { setUser, setIsLoggedIn } = React.useContext(AppContext);
    const navigate = useNavigate();
    const handleLogout=()=>{

        localStorage.removeItem("isloggedIn");
        localStorage.removeItem("userdata");
        setUser(null);
        setIsLoggedIn(false);
        navigate('/login');
    }
    return (
      <>
        <div className="sidebar">
          <Flex
            direction="column"
            alignItems="center"
            justifyContent="space-between"
            height="100%"
            p={"1vw"}
          >
            <div className="container1" style={{flexGrow:'3'}}>
              <Heading
                color={"orange.400"}
                fontSize={"1.5vw"}
                fontWeight={"bold"}
                display={"flex"}
                alignItems={"self-end"}
                gap={"0.3vw"}
                marginBottom={"0.5vw"}
              >
                <img
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT8vI39QCTJjPYnSv8Yd4A31zGqzCrD3Lq-AA&amp;s"
                  style={{ width: "2vw", height: "2vw" }}
                />
                BookShelf
              </Heading>
              <TextElement color={"GrayText"} fontSize={"0.7vw"}>
                Organize & manage books
              </TextElement>
              <Divider></Divider>
            </div>

            <div className="container2"  style={{flexGrow:'8'}}>
              <VStack spacing={4} align="stretch" width={"100%"} style={{display:'flex',gap:'2vw'}} padding={'0 1vw'}> 

                <Button colorScheme='orange' variant='solid' style={{ fontWeight: "bold" }} >Dashboard</Button>
                <Button as={'a'} fontSize={"1vw"} fontWeight={400} variant={'link'} href={'#'} color="orange.400">Add Book </Button>
                <Button as={'a'} fontSize={"1vw"} fontWeight={400} variant={'link'} href={'#'} color="orange.400">Manage Book </Button>
              </VStack>
            </div>

            <div className="container3" style={{flexGrow:'1',display:'flex',alignItems:'end'}} >
              <Button
              className="Logout"
                variant="ghost"
                fontSize={"0.9vw"}
                fontWeight={"normal"}
                onClick={handleLogout}
              >
                Logout
              </Button>
            </div>
          </Flex>
        </div>
      </>
    );
 }