import React, { useEffect } from 'react';
import './App.css';
import { Box, Flex, useToast } from '@chakra-ui/react';
import { Sidebar } from './Sidebar';
import { MobileTopBar } from './MobileTopBar';
import CodeEditor, { EvalResult } from './CodeEditor';
import { Terminal } from './Terminal';
import { EventBus } from './EventBus';

interface AppProps {
}
function App({}: AppProps) {

  const toast = useToast()

  useEffect(() => {
    EventBus.register('editor:eval', (result: EvalResult) => {
      if(toast.isActive(result.type)) {
        toast.close(result.type);
      }
      setTimeout(() => {
        if(result.type === 'editor:eval:failure') {
          toast({
            id: result.type,
            title: "Your code was unable to run.",
            description: "There was an error when attempting to run your code, please check the console on the right sidebar.",
            status: "error",
            duration: 4000,
            isClosable: true,
          })
        }
      }, 300)
    })
  }, [])

  return (
    <Flex h="100vh" flexDirection="column">
      <MobileTopBar />
      <Flex flex="1" overflow="hidden">
        <Sidebar display={{ base: 'none', md: 'flex' }} />
        <Flex flex="1" p="1">
          <Box rounded="base" h="full" w="full">
            <CodeEditor/>
          </Box>
        </Flex>
        <Flex
          display={{ base: 'none', lg: 'block' }}
          width="500px"
          direction="column"
          overflowY="auto"
          borderRightWidth="1px"
          p="6"
        >
          <Terminal/>
        </Flex>
      </Flex>
    </Flex>
  );
}

export default App;
