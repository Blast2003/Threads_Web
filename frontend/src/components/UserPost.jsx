import { Avatar, Box, Flex, Image, Text } from "@chakra-ui/react"
import { BsThreeDots } from "react-icons/bs"
import { Link } from "react-router-dom"
import Actions from "./Actions"
import { useState } from "react"

const UserPost = ({likes, replies, postImg, postTitle}) => {
    const [liked, setLiked] = useState(false)
  return (
    <Link  to={"/markzurkerberg/post/1"}>
        <Flex gap={3} mb={4} py={5}>

            {/* left hand-side handle with column */}
            <Flex flexDirection={"column"} alignItems={"center"}>
                <Avatar size={"md"} name="Mark Zuckerberg" src="/zuck-avatar.png"/>
                <Box w="1px" h={"full"} bg={"gray.light"} my={2}></Box>
                <Box position={"relative"} w={"full"}>
                    <Avatar 
                        size={"xs"}
                        name="John doe"
                        src="https://bit.ly/kent-c-dodds"
                        position={"absolute"}
                        top={"0px"}
                        left={"15px"}
                        padding={"2px"}
                    />

                    <Avatar 
                        size={"xs"}
                        name="Christian Nwamba"
                        src="https://bit.ly/code-beast"
                        position={"absolute"}
                        bottom={"0px"}
                        right={"-5px"}
                        padding={"2px"}
                    />

                    <Avatar 
                        size={"xs"}
                        name="Ryan Florence"
                        src="https://bit.ly/ryan-florence"
                        position={"absolute"}
                        bottom={"0px"}
                        left={"4px"}
                        padding={"2px"}
                    />
                </Box>
            </Flex>
            
            {/* right hand-side */}
            {/* above */}
            <Flex flex={1} flexDirection={"column"} gap={2}>
                <Flex justifyContent={"space-between"} w={"full"}>
                    {/* left */}
                    <Flex w={"full"} alignItems={"center"}>
                        <Text fontSize={"sm"} fontWeight={"bold"}>markzuckerberg</Text>
                        <Image src="/verified.png" w={4} h={4} ml={1}/>
                    </Flex> 

                    {/* right */}
                    <Flex gap={4} alignItems={"center"}>
                        <Text fontSize={"sm"} color={"gray.light"}>1d</Text>
                        <BsThreeDots />
                    </Flex>
                </Flex>
                
                {/* Below has 1 text for post title, 1 image and 4 icon to react with post*/}
                <Text fontSize={"sm"}>{postTitle}</Text>
                {postImg &&(
                    <Box borderRadius={6}  overflow={"hidden"}  border={"1px solid"}   borderColor={"gray.light"}>   
                        <Image src={postImg} w={"full"}/>
                    </Box>
                )}
                <Flex gap={3} my={1}>
                    <Actions liked={liked} setLiked={setLiked}/>
                </Flex>

                {/* number of replies and likes */}
                <Flex gap={2} alignItems={"center"}>
                    <Text color={"gray.light"} fontSize={"sm"}>{replies} replies</Text>
                    <Box w={0.5} h={0.5} borderRadius={"full"} bg={"gray.light"}></Box> 
                    <Text color={"gray.light"} fontSize={"sm"}>{likes} likes</Text>
                </Flex>

            </Flex>

        </Flex>
    </Link>
  )
}

export default UserPost