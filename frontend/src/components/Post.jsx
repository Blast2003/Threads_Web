import { Avatar, Box, Flex, Image, Text } from "@chakra-ui/react"
import { Link, useNavigate } from "react-router-dom"
import Actions from "./Actions"
import { useEffect, useState } from "react"
import userShowToast from "../hooks/userShowToast"
import {formatDistanceToNow} from "date-fns"
import {DeleteIcon} from "@chakra-ui/icons"
import { useRecoilState, useRecoilValue } from "recoil"
import userAtom from "../atoms/userAtom"
import postsAtom from "../atoms/postsAtom"

const Post = ({post, postedBy}) => {
    const [user, setUser] = useState(null)
    
    const currentUser = useRecoilValue(userAtom)
    const showToast = userShowToast();
    const navigate = useNavigate()
    const [posts, setPosts] = useRecoilState(postsAtom)


    useEffect( () => {
        const getUser = async () =>{
            try {
                const res = await fetch ("/api/user/profile/"+ postedBy);
                const data = await res.json();
                console.log (data)

                if(data.error){
                showToast("Error", data.error, "error")
                return
                }
                setUser(data)

            } catch (error) {
            showToast("Error", error.message, "error")
            setUser(null)
            }
        }

        getUser()
    }, [showToast, postedBy])

    const handleDeletePost = async (e) => {
        try {
            e.preventDefault();
            
            if(!window.confirm("Are you sure you want to delete this post?")) return;

            const res = await fetch ("/api/post/delete/"+ post._id, {
                method: "DELETE",
                headers:{
                    "Content-Type": "application/json"
                }
            })
            const data = await res.json();
            console.log (data)
            if(data.error){
                showToast("Error", data.error, "error")
                return
            }
                
            showToast("Success", "Post deleted", "success")
            setPosts(posts.filter( (p)=> p._id !== post._id ))

        } catch (error) {
            showToast("Error", error.message, "error")
        }
    }

    if(!user) return null;

  return (
    <Link  to={`/${user?.username}/post/${post._id}`}>
        <Flex gap={3} mb={4} py={5}>

            {/* left hand-side handle with column */}
            <Flex flexDirection={"column"} alignItems={"center"}>
                <Avatar size={"md"} name={user?.username} src={user?.profilePic} 
                    onClick={(e) =>{
                        e.preventDefault();
                        navigate(`/${user?.username}`)
                    }}
                
                />
                <Box w="1px" h={"full"} bg={"gray.light"} my={2}></Box>
                <Box position={"relative"} w={"full"}>
                    
                    {post.replies.length === 0 && (
                        <Text textAlign={"center"}>🥱</Text>
                    )}

                    {post.replies[0] &&(
                        <Avatar 
                            size={"xs"}
                            name={post.replies[0]?.username}
                            src={post.replies[0]?.userProfilePic}
                            position={"absolute"}
                            top={"0px"}
                            left={"15px"}
                            padding={"2px"}
                        />
                    )}
                    
                    {post.replies[1] &&(
                        <Avatar 
                            size={"xs"}
                            name={post.replies[1]?.username}
                            src={post.replies[1]?.userProfilePic}
                            position={"absolute"}
                            bottom={"0px"}
                            right={"-5px"}
                            padding={"2px"}
                        />
                    )}

                    {post.replies[2] &&(
                        <Avatar 
                            size={"xs"}
                            name={post.replies[2]?.username}
                            src={post.replies[2]?.userProfilePic}
                            position={"absolute"}
                            bottom={"0px"}
                            left={"4px"}
                            padding={"2px"}
                        />
                    )}
            
                </Box>
            </Flex>
            
            {/* right hand-side */}
            {/* above */}
            <Flex flex={1} flexDirection={"column"} gap={2}>
                <Flex justifyContent={"space-between"} w={"full"}>
                    {/* left */}
                    <Flex w={"full"} alignItems={"center"}>
                        <Text fontSize={"sm"} fontWeight={"bold"} 
                            onClick={(e) =>{
                                e.preventDefault();
                                navigate(`/${user?.username}`)
                            }}
                        > {user?.username}</Text>
                        <Image src="/verified.png" w={4} h={4} ml={1}/>
                    </Flex> 

                    {/* right */}
                    <Flex gap={4} alignItems={"center"}>
                        <Text fontSize={"xs"} width={36} textAlign={"right"} color={"gray.light"}>
                            {formatDistanceToNow(new Date(post.createdAt))} ago
                        </Text>

                        {currentUser?._id  === user._id && (
                            <DeleteIcon size={20} onClick={handleDeletePost}/>
                        )}
                    </Flex>
                </Flex>
                
                {/* Below has 1 text for post title, 1 image and 4 icon to react with post*/}
                <Text fontSize={"sm"}>{post?.text}</Text>
                {post?.img &&(
                    <Box borderRadius={6}  overflow={"hidden"}  border={"1px solid"}   borderColor={"gray.light"}>   
                        <Image src={post?.img} w={"full"}/>
                    </Box>
                )}
                <Flex gap={3} my={1}>
                    <Actions post = {post} />
                </Flex>
                
            </Flex>

        </Flex>
    </Link>
  )
}

export default Post