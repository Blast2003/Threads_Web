import { Button, Flex, Image, Link, useColorMode } from "@chakra-ui/react"
import {useRecoilValue, useSetRecoilState } from "recoil"
import {AiFillHome} from "react-icons/ai"
import {RxAvatar} from "react-icons/rx"
import userAtom from "../atoms/userAtom"
import {Link as RouterLink} from "react-router-dom"
import { FiLogOut } from "react-icons/fi"
import useLogout from "../hooks/useLogout"
import authScreenAtom from "../atoms/authAtom"
import {BsFillChatQuoteFill} from "react-icons/bs"
import {MdOutlineSettings} from "react-icons/md"

const Header = () => {
  const {colorMode, toggleColorMode} = useColorMode()
  const currentUser = useRecoilValue(userAtom)
  const logout = useLogout()
  const setAuthScreen = useSetRecoilState(authScreenAtom)

  return (
    <Flex justifyContent={"space-between"} mt={6} mb="12">
      
      {currentUser && (
        <Link as={RouterLink} to={"/"}>
          <AiFillHome size={24}/>
        </Link>
      )}

      {!currentUser && (
				<Link as={RouterLink} to={"/auth"} onClick={() => setAuthScreen("login")}>
					Login
				</Link>
			)}

      <Image 
        cursor={"pointer"} 
        alt="logo" 
        w={6}
        src={colorMode === "dark" ? "/light-logo.svg" : "/dark-logo.svg"}
        onClick={toggleColorMode}
      />

      {currentUser && (
        <Flex alignItems={"center"} gap={6}>
          
          <Link as={RouterLink} to={`/${currentUser.username}`}>
            <RxAvatar size={24}/>
          </Link>

          <Link as={RouterLink} to={`/chat`}>
            <BsFillChatQuoteFill size={20}/>
          </Link>

          <Link as={RouterLink} to={`/settings`}>
            <MdOutlineSettings size={20}/>
          </Link>

          <Button
            size={"xs"}
            onClick={logout}
          >
            <FiLogOut size={20}/>
          </Button>
        </Flex>
      )}

      {!currentUser && (
        <Link as={RouterLink} to={"/auth"} onClick={ () => setAuthScreen("signup") }>
          Sign up
        </Link>
      )}

    </Flex>
  )
}

export default Header