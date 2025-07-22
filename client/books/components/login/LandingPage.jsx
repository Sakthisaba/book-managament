import Login from "./Login"
import { Divider, Flex, HStack ,Heading,Text, VStack} from "@chakra-ui/react"
export default function LandingPage(){

    return (
      <Flex width={'100%'} height={'100%'} display={'flex'} >
        <HStack w={'100%'} display={'flex'} justifyContent={'space-evenly'}>
          <VStack w={'40%'}>
            <Heading
              color={"orange.400"}
              fontSize={"5vw"}
              fontWeight={"bold"}
              display={"flex"}
              alignItems={"center"}
              gap={"0.3vw"}
              marginBottom={"0.5vw"}
            >
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT8vI39QCTJjPYnSv8Yd4A31zGqzCrD3Lq-AA&amp;s"
                style={{ width: "5vw", height: "5vw" }}
              />
              BookShelf
            </Heading>
            <Text textStyle="md">Seamlessly manage your entire book collection—add, edit, organize, and track books anytime, anywhere</Text>

          </VStack>
          <Divider orientation="vertical" height="50%" mx={4} borderColor="gray.300" />
          <Login w={'50%'} ></Login>
        </HStack>
      </Flex>
    );
}