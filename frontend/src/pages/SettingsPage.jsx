import { Button, Text } from "@chakra-ui/react"
import userShowToast from "../hooks/userShowToast"
import useLogout from "../hooks/useLogout";


const SettingsPage = () => {
    const showToast = userShowToast();
    const logout = useLogout();

    const freezeAccount = async() =>{
        if(!window.confirm("Are you sure you want to freeze your account?")) return;
        
        try {
            const res = await fetch("/api/user/freeze", {
                method: "PUT",
                headers:{
                    "Content-Type": "application/json"
                },
            })
            const data = await res.json();
            if(data.error) {
                showToast("Error", data.error, "error" )
                return;
            }
            if(data.success) {
                await logout();
                showToast("Success", "Your account has been frozen", "success")
            }

        } catch (error) {
            showToast("Error", error.message, "error");
        }
    }

  return (
    <>
        <Text my={1} fontWeight={"bold"}>Freeze Your Account</Text>
        <Text my={1}>You can unfreeze you account anytime by logging in.</Text>
        <Button
         my={1}
         size={"sm"}
         colorScheme="red"
         onClick={freezeAccount}
        >Freeze</Button>
    </>
  )
}

export default SettingsPage