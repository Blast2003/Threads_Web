import { useSetRecoilState } from "recoil";
import userShowToast from "./userShowToast";
import userAtom from "../atoms/userAtom";

const useLogout = () => {
    const setUser = useSetRecoilState(userAtom);
    const showToast = userShowToast()
    const logout = async() =>{
        try {
          //fetch
            const res = await fetch("/api/user/logout", {
                method: "POST",
                headers:{
                    "Content-Type": "application/json",
                },
            })
            const data = await res.json()
            console.log(data)
            if(data.error){
                showToast("Error", data.error, "error")
                return;
            }

            localStorage.removeItem("user-threads")
            setUser (null);

        } catch (error) {
            showToast("Error", error, "error")
        }
    }

    return logout
}

export default useLogout