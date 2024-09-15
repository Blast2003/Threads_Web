'use client'

import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Stack,
  Button,
  Heading,
  Text,
  useColorModeValue,
  Link,
} from '@chakra-ui/react'
import { useState } from 'react'
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons'
import { useSetRecoilState } from 'recoil'
import authScreenAtom from '../atoms/authAtom'
import userShowToast from '../hooks/userShowToast'
import userAtom from '../atoms/userAtom'

export default function Login() {
  const [showPassword, setShowPassword] = useState(false)
  const setAuthScreenState = useSetRecoilState(authScreenAtom)
  const [inputs, setInputs] = useState({
    username: "",
    password: ""
  })
  const showToast = userShowToast();
  const setUser = useSetRecoilState(userAtom)
  const [loading, setLoading] = useState(false)

  const handleLogin =async () =>{
    setLoading(true)
    try {
        //fetch
        const res = await fetch("/api/user/login", {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(inputs)
        })
        const data = await res.json()
        console.log(data)
        if(data.error){
            showToast("Error", data.error, "error")
            return
        }

        localStorage.setItem("user-threads", JSON.stringify(data)); // local storage inside frontend server
        setUser(data)
    } catch (error) {
        showToast("Error", error, "error")
    } finally{
      setLoading(false)
    }
  }
  



  return (
    <Flex
      align={'center'}
      justify={'center'}
    >
      <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
        
        <Stack align={'center'}>
          <Heading fontSize={'4xl'} textAlign={'center'}>
            Login
          </Heading>
        </Stack>
        
        <Box
          rounded={'lg'}
          bg={useColorModeValue('#B9A5A5', 'gray.700')}
          boxShadow={'lg'}
          p={8}
          w={{
            base: "full",
            sm: "400px",

          }}
        >
          
          <Stack spacing={4}>

            <FormControl isRequired>
              <FormLabel>Username</FormLabel>
              <Input type="text" onChange={(e) => setInputs({...inputs, username: e.target.value})} value={inputs.username}/>
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Password</FormLabel>
              <InputGroup>
                <Input type={showPassword ? 'text' : 'password'} onChange={(e) => setInputs({ ...inputs, password: e.target.value})} value={inputs.password}/>
                <InputRightElement h={'full'}>
                  <Button
                    variant={'ghost'}
                    onClick={() => setShowPassword((showPassword) => !showPassword)}>
                    {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                  </Button>
                </InputRightElement>
              </InputGroup>
            </FormControl>

            <Stack spacing={10} pt={2}>
              <Button
                loadingText="Logging in"
                size="lg"
                bg={useColorModeValue("gray.600", "gray.700")}
                color={'white'}
                _hover={{
                  bg: useColorModeValue("gray.700", "gray.800"),
                }}
                onClick={handleLogin}
                isLoading={loading}
              >
                Login
              </Button>
            </Stack>

            <Stack pt={6}>
              <Text align={'center'}>
                Don&apos;t have an account? <Link color={'blue.400'} onClick={() => setAuthScreenState("signup")}>Signup</Link>
              </Text>
            </Stack>
          </Stack>

        </Box>

      </Stack>
    </Flex>
  )
}