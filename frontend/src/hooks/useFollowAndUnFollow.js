import { useState } from "react";
import userShowToast from "./userShowToast";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";

const useFollowAndUnFollow = (user) => {
    const currentUser = useRecoilValue(userAtom);
    const [following, setFollowing] = useState(user.followers.includes(currentUser?._id));
    const [updating, setUpdating] = useState(false);
    const showToast = userShowToast();
    
    const handleFollow = async () => {
        if(!currentUser) {
            showToast("Error", `Please Login To Follow`, "error");
            return;
        }
        setUpdating(true);
        try {
        const res = await fetch(`/api/user/follow/${user._id}`,{ // params parameter
            method: 'POST', 
            headers:{
                "Content-Type": "application/json",
            }
        }) // get request
        const data = await res.json()
        if(data.error){
          showToast("Error", data.error, "error");
          return;
        }

        if(following){
            showToast("Success", `Unfollowed ${user.name}`, "success");
            user.followers.pop();
        }else{
            showToast("Success", `Followed ${user.name}`, "success");
            user.followers.push(currentUser?._id); // adding to followers of the username on params side of url
        }

        console.log(data) // follow or un-follow
        setFollowing(!following)
        } catch (error) {
            showToast("Error", error, "error")
        } finally{
            setUpdating(false)
        }
    }

    return {handleFollow, updating, following}
}

export default useFollowAndUnFollow