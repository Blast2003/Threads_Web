
import { useRecoilValue } from "recoil"
import Login from "../components/Login"
import SignupCard from "../components/SignupCard"
import authScreenAtom from "../atoms/authAtom"


const AuthPage = () => {
  const authScreenState = useRecoilValue(authScreenAtom)
  // const [value, setValue] = useState("login")
  // useSetRecoilState(authScreenAtom)
  console.log(authScreenState)
  return (
    <>
        {authScreenState === "login" ? <Login/> : <SignupCard/>}
    </>
  )
}

export default AuthPage