import { Spinner, Text, Box ,Center} from "@chakra-ui/react"

const Loader = () => {
  return (
    <Box pos="absolute" inset="0" bg="bg/80">
        <Center h="full">
          <Spinner color="teal.500" />
        </Center>
      </Box>
  )
}


export default Loader;