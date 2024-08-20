import { Avatar, Box, Flex, Image, Skeleton, Text } from "@chakra-ui/react"
import { useRecoilValue } from "recoil"
import { selectedConversationAtom } from "../atoms/messageAtom"
import userAtom from "../atoms/userAtom"
import {BsCheck2All} from "react-icons/bs"
import { useState } from "react"

const Message = ( {ownMessage, messages} ) => {

    const selectedConversation = useRecoilValue(selectedConversationAtom)
    const user = useRecoilValue(userAtom)
	const [imgLoaded, setImgLoaded] = useState(false)

  return (
    <>
        {ownMessage ? (
            <Flex gap={2} alignSelf={"flex-end"}>

                {messages.text && (
                    <Flex bg={"green.800"} maxW={"350px"} p={1} borderRadius={"md"}>
						<Text color={"white"}>{messages.text}</Text>
						<Box
							alignSelf={"flex-end"}
							ml={1}
							color={messages.seen ? "blue.400" : ""}
							fontWeight={"bold"}
						>
							<BsCheck2All size={16} />
						</Box>
					</Flex>
                )}

                {messages.img && !imgLoaded &&(
                    <Flex mt={5} w={"200px"}>
						<Image src={messages.img} hidden onLoad={() => setImgLoaded(true)} alt='Message image' borderRadius={4} />
						<Skeleton w={"200px"} h={"200px"}/>
					</Flex>
                )}   

				{messages.img && imgLoaded &&(
                    <Flex mt={5} w={"200px"}>
						<Image src={messages.img} alt='Message image' borderRadius={4} />
						<Box
							alignSelf={"flex-end"}
							ml={1}
							color={messages.seen ? "blue.400" : ""}
							fontWeight={"bold"}
						>
							<BsCheck2All size={16} />
						</Box>
					</Flex>
                )}  
                <Avatar src={user.profilePic} w={7} h={7}/>
            </Flex>
            
        ) : (
            <Flex gap={2} >
                <Avatar src={selectedConversation.userProfilePic} w={7} h={7}/>
                
                {messages.text && (
                    <Text maxW={"350px"} bg={"gray.400"} p={1} borderRadius={"md"} color={"black"}>
                        {messages.text}
                    </Text>
                )}

                {messages.img && !imgLoaded &&(
                    <Flex mt={5} w={"200px"}>
						<Image src={messages.img} hidden onLoad={() => setImgLoaded(true)} alt='Message image' borderRadius={4} />
						<Skeleton w={"200px"} h={"200px"}/>
					</Flex>
                )}   

				{messages.img && imgLoaded &&(
                    <Flex mt={5} w={"200px"}>
						<Image src={messages.img} alt='Message image' borderRadius={4} />
					</Flex>
                )}
                
            </Flex>
        )}
        
    </>
  )
}

export default Message