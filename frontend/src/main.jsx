import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { ChakraProvider, ColorModeScript, extendTheme } from '@chakra-ui/react'
import {mode} from "@chakra-ui/theme-tools"
import { BrowserRouter } from 'react-router-dom'
import { RecoilRoot } from 'recoil'
import { SocketContextProvider } from './context/SocketContext.jsx'


const styles = {
  global: (props) =>({
    body:{
      color:mode('gay.800', "whiteAlpha.900") (props),
      bg: mode("gray.100", "#101010")(props)
    }
  })
}

const config= {
  initialColorMode: "dark",
  useSystemColorMode: true,
}


const colors = {
  gray:{
    light: '#DDDDDD',
    dark: '#0C0B0B'
  }
}

const theme = extendTheme({ styles, config, colors})

createRoot(document.getElementById('root')).render(
  // Strict mode: double handle when call,  Ex: check security 2 times
  <StrictMode> 
    <RecoilRoot>
      <BrowserRouter>
        <ChakraProvider theme={theme}>
    
          <ColorModeScript initialColorMode={theme.config.initialColorMode}/>
            
            <SocketContextProvider>
              <App />
            </SocketContextProvider>
            
        </ChakraProvider>
      </BrowserRouter>
    </RecoilRoot>
  </StrictMode>,
)
