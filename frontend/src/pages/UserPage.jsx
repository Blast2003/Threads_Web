import { useEffect, useState } from "react"
import UserHeader from "../components/UserHeader"
import { useParams } from "react-router-dom"
import userShowToast from "../hooks/userShowToast"
import { Flex, Spinner } from "@chakra-ui/react"
import Post from "../components/Post"
import useGetUserProfile from "../hooks/useGetUserProfile"
import { useRecoilState } from "recoil"
import postsAtom from "../atoms/postsAtom"

const UserPage = () => {
  const {user, loading} = useGetUserProfile();
  const { username } = useParams();
  const showToast = userShowToast()

  const [posts, setPosts] = useRecoilState(postsAtom)
  const [fetchingPost, setFetchingPost] = useState(true)

  useEffect(() =>{

    const getPosts = async () => {
      if(!user) return;
      setFetchingPost(true);
      try {
        const res = await fetch(`/api/post/user/${username}`);
        const data = await res.json()
        console.log(data) 
        setPosts(data)
        
      } catch (error) {
        showToast("Error", error.message, "error")
        setPosts([])
      } finally{
        setFetchingPost(false)
      }
    }

    getPosts();
  }, [username, showToast, setPosts, user]);

  console.log("post is here and it's recoil state", posts)

  if(!user && loading){
    return(
      <Flex justifyContent={"Center"}>
        <Spinner size={"xl"}/>
      </Flex>
    )
  }

  if(!user && !loading) return <h1>User not found</h1>; // redirect to the error page

  return (
    <>
        <UserHeader user={user}/>

        {!fetchingPost && posts.length === 0 && <h1>User has no posts.</h1>}

        {fetchingPost && (
          <Flex justifyContent={"center"} my={12}>
            <Spinner size={"xl"}/>
          </Flex>
        )}

        {posts.map( (post) =>(
          <Post key={post._id} post={post} postedBy={post.postedBy}/>
        ))}
        
    </>
  )
}

export default UserPage