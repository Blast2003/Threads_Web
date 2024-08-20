import { Avatar, Box, Button, Divider, Flex, Image, Spinner, Text } from "@chakra-ui/react"
import Actions from "../components/Actions"
import useGetUserProfile from "../hooks/useGetUserProfile"
import { useEffect } from "react"
import userShowToast from "../hooks/userShowToast"
import { useNavigate, useParams } from "react-router-dom"
import {DeleteIcon} from "@chakra-ui/icons"
import {formatDistanceToNow} from "date-fns"
import { useRecoilState, useRecoilValue } from "recoil"
import userAtom from "../atoms/userAtom"
import Comment from "../components/Comment"
import postsAtom from "../atoms/postsAtom"

const PostPage = () => {

  const {user, loading} = useGetUserProfile();
  const [posts, setPosts] = useRecoilState(postsAtom)
  const showToast = userShowToast()
  const {pid} = useParams()
  const currentUser = useRecoilValue(userAtom)
  const navigate = useNavigate()

  const currentPost = posts[0]

  useEffect( () =>{
    const getPosts = async () =>{
      setPosts([])
      try {
        const res = await fetch("/api/post/" + pid)
        const data = await res.json()
        console.log(data)
        if(data.error){
          showToast("Error", data.error, "error")
          return
        }
        setPosts([data])

      } catch (error) {
        showToast("Error", error.message, "error")
      }
    }

    getPosts()
  }, [showToast, pid, setPosts])

  const handleDeletePost = async (e) => {
    try {
        e.preventDefault();
        
        if(!window.confirm("Are you sure you want to delete this post?")) return;

        const res = await fetch ("/api/post/delete/"+ currentPost._id, {
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
        navigate(`/${user.username}`)

    } catch (error) {
        showToast("Error", error.message, "error")
    }
}

  if(!user && loading){
    return (
      <Flex justifyContent={"Center"}>
        <Spinner size={"xl"}/>
      </Flex>
    )
  }

  if(!user && !loading) return <h1>User not found</h1>; // redirect to the error page

  if(!currentPost) return null;

  return (
    <>
      {/* first row */}
      <Flex>
      {/* left */}
      <Flex w={"full"} alignItems={"center"} gap={3}>
          <Avatar src={user?.profilePic} size={"md"} name={user?.username}/>
          <Flex >
            <Text fontSize={"sm"} fontWeight={"bold"}>{user?.username}</Text>
            <Image src="/verified.png" w={4} h={4} ml={4}/>
          </Flex>
      </Flex>

      {/* right */}
      <Flex gap={4} alignItems={"center"}>
          <Text fontSize={"xs"} width={36} textAlign={"right"} color={"gray.light"}>
            {formatDistanceToNow(new Date(currentPost.createdAt))} ago
          </Text>
          
          {/* check in our post => render delete icon */}
          {currentUser?._id  === user._id && (
            <DeleteIcon size={20} cursor={"pointer"} onClick={handleDeletePost}/>
          )}
      </Flex>
    </Flex>

    {/* post's image */}
    <Text my={3}>{currentPost.text}</Text>
    {currentPost.img && (
      <Box borderRadius={6}  overflow={"hidden"}  border={"1px solid"}   borderColor={"gray.light"}>   
        <Image src={currentPost.img} w={"full"}/>
    </Box>
    )}

    {/* action */}
    <Flex gap={3} my={3}>
      <Actions post={currentPost}/>
    </Flex>


    {/* the bar help to divide between the row*/}
    <Divider my={4}/>
    {/* Text field to enter reply and button to get */}
    <Flex justifyContent={"space-between"}>
      <Flex gap={2} alignItems={"center"}>
        <Text fontSize={"2xl"}>👋</Text>
        <Text color={"gray.light"}>Get the app to like, reply and post.</Text>
      </Flex>
      <Button>Get</Button>
    </Flex>


    {/* the bar help to divide between the row*/}
    <Divider my={4}/>
    {currentPost.replies.map (reply => (
      <Comment
        key={reply._id}
        reply = {reply}
        lastReply={reply._id === currentPost.replies[currentPost.replies.length - 1]._id}
      />
    ))}

    </>
  ) 
}

export default PostPage