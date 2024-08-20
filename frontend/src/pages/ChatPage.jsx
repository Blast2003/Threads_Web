import { SearchIcon } from "@chakra-ui/icons"
import { Box, Button, Flex, Input, Skeleton, SkeletonCircle, Text, useColorModeValue } from "@chakra-ui/react"
import Conversations from "../components/Conversations"
import {GiConversation} from "react-icons/gi"
import MessageContainer from "../components/MessageContainer"
import { useEffect, useState } from "react"
import userShowToast from "../hooks/userShowToast"
import { useRecoilState, useRecoilValue } from "recoil"
import { conversationAtom, selectedConversationAtom } from "../atoms/messageAtom"
import userAtom from "../atoms/userAtom"
import { useSocket } from "../context/SocketContext"

const chatPage = () => {
    const showToast = userShowToast();
    const [loading, setLoading] = useState(true)
    const [conversations, setConversations] = useRecoilState(conversationAtom)
    const [selectedConversation, setSelectedConversation] = useRecoilState(selectedConversationAtom)
    const [searchText, setSearchText] = useState("")
    const [searchingUser, setSearchingUser] = useState(false)
    const currentUser = useRecoilValue(userAtom)
    const {socket, onlineUsers} = useSocket()


    useEffect(() =>{
        socket?.on("messagesSeen", ({conversationId}) =>{
            setConversations( prev => {
                const updatedConversations = prev.map(conversation =>{
                    if(conversation._id == conversationId){
                        return {
                            ... conversation,
                            lastMessage:{
                                ...conversation.lastMessage,
                                seen: true,
                            }
                        }
                    }
                    return conversation
                })
                return updatedConversations
            })
        })
    }, [socket, setConversations])

    useEffect( () =>{
        const getConversations = async () => {
            try {
                const res = await fetch("/api/message/")
                const data = await res.json()
                console.log(data)
                if(data.error){
                    showToast("Error", data.error, "error")
                    return
                }
                setConversations(data)

            } catch (error) {
                showToast("Error", error.message, "error")
            }finally{
                setLoading(false)
            }
        }
        getConversations()
    }, [showToast, setConversations])

    const handleConversationSearch = async(e) =>{
        e.preventDefault();
        setSearchingUser(true);
        try {
            const res = await fetch(`/api/user/profile/${searchText}`);
            const searchedUser = await res.json();
            console.log(searchedUser)
            if(searchedUser.error){
                showToast("Error", searchedUser.error, "error")
                return;
            }

            // if user try to find themselves
            const messagingYourself = searchedUser._id === currentUser._id
            if(messagingYourself){
                showToast("Error", "You can not message yourself", "error");
                return;
            }

            // if user is already in a conversation
            const conversationAlreadyExists = conversations.find(conversation => conversation.participants[0]._id === searchedUser._id)
            if(conversationAlreadyExists){
                setSelectedConversation({
                    _id: conversationAlreadyExists._id,
                    userId: searchedUser._id,
                    username: searchedUser.username,
                    userProfilePic: searchedUser.profilePic,
                })
                return;
            }

            // if don't have the conversation => create empty conversation
            const mockConversation = {
                mock: true,
                lastMessage:{
                    text:"",
                    sender:"",
                },
                _id: Date.now(),
                participants:[
                    {
                        _id: searchedUser._id,
                        username: searchedUser.username,
                        profilePic: searchedUser.profilePic,
                    }
                ]
            }
            setConversations( (prevConvs) => [...prevConvs, mockConversation] );

        } catch (error) {
            showToast("Error", error.message, "error")
        } finally{
            setSearchingUser(false)
        }
    }

  return (
    <Box position={"absolute"} left={"50%"} 
    w={{
        base: "100%",
        md: "80%",
        lg: "750px",
        
    }} 
    p={4}
    transform={"translateX(-50%)"} >
        
        <Flex gap={4} 
            flexDirection={{
                base: "column",
                md: "row"
            }}
            maxW={{
                sm: "400px",
                md:"full"
            }}
            mx={"auto"}
        >
            {/* column */}
            {/* left */}
            <Flex flex={30} gap={2} flexDirection={"column"} 
                maxW={{
                    sm: "250px",
                    md: "full"
                }}
            >
                <Text fontWeight={700} color={useColorModeValue("gray.600", "gray.400")}> 
                    Your Conservations
                </Text>

                <form onSubmit={handleConversationSearch}>
                    <Flex alignItems={"center"} gap={2}>
                        <Input placeholder="Search for a user" onChange={(e) => setSearchText(e.target.value)} 
                            value={searchText}
                        />
                        <Button size={"sm"} onClick={handleConversationSearch} isLoading={searchingUser}>
                            <SearchIcon/>
                        </Button>
                    </Flex>
                </form>
                
                
                {loading && (
                    [0, 1 , 2, 3, 4 ].map((_, i) => (
                        <Flex key={i} gap={4} alignItems={"center"} p={1} borderRadius={"md"}>
                            
                            <Box>
                                <SkeletonCircle size={"10"}/>
                            </Box>

                            <Flex w={"full"} flexDirection={"column"} gap={3}>
                                <Skeleton h={"10px"} w={"80px"}/>
                                <Skeleton h={"8px"} w={"90%"}/>
                            </Flex>

                        </Flex>
                    ))
                )}

                {!loading && (
                    conversations.map( (conversation) => (
                        <Conversations key={conversation._id} 
                        isOnline={onlineUsers.includes(conversation.participants[0]._id) } 
                        conversation={conversation}/>
                    ))
                )}

            </Flex>

            {/* middle => ask to select the conversation */}
            {!selectedConversation._id &&(
                <Flex flex={70} borderRadius={"md"} p={2} flexDir={"column"} alignItems={"center"} 
                justifyContent={"center"} height={"400px"}
                >
                    <GiConversation size={100}/>
                    <Text fontSize={20}>Select a conversation to start chatting</Text>
                </Flex>
            )}
            
            
            {/* right is message box */}
            {selectedConversation._id && <MessageContainer/>}
            



        </Flex>

    </Box>
  )
}

export default chatPage