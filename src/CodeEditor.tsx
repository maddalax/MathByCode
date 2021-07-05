import React, { useEffect, useRef, useState } from 'react';
import './App.css';
import Editor, { Monaco } from '@monaco-editor/react';
import type monaco from 'monaco-editor';
import { Button, Flex, Spacer } from '@chakra-ui/react';
import { BsFillPlayFill } from 'react-icons/bs';
import { EventBus } from './EventBus';

export type EvalResult = {type: string, payload: any}

function CodeEditor() {
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const monacoRef = useRef<Monaco | null>(null);
  const [theme, setTheme] = useState('vs-dark')

  const worker = useRef(new Worker('worker.js'));

  useEffect(() => {
    worker.current.onmessage = (message) => {
      EventBus.dispatch('editor:eval', JSON.parse(message.data))
    }
  }, [])

  const createTheme = () => {
    if(!monacoRef.current) {
      return;
    }
    monacoRef.current.editor.defineTheme('math-dark', {
      base: 'vs-dark', // can also be vs-dark or hc-black
      inherit: true,
      colors: {
        'editor.foreground': '#1a202c',
        'editor.background': '#1a202c',
        'minimap.background': '#1a202c',
        'scrollbarSlider.background': '#1a202c',
        "sideBar.background": "#1a202c"
      }, // can also be false to completely replace the builtin rules
      rules: [

      ]
    });
    setTheme('math-dark');
  };

  const execute = () => {
    worker.current.postMessage(editorRef.current?.getValue() ?? '')
  };

  useEffect(() => {
    window.addEventListener('keyup', (e) => {
      if (e.ctrlKey && e.key === 'Enter') {
        execute();
      }
    });
  }, []);



  return (
    <div>
      <Flex>
        <Spacer />
        <Spacer />
        <Button onClick={execute} rightIcon={<BsFillPlayFill/>} marginBottom={3} colorScheme={'teal'}>Run</Button>
      </Flex>
      <Editor
        options={{
          fontSize: 16,
        }}
        theme={theme}
        height='90vh'
        defaultLanguage='javascript'
        defaultValue={`for(let i = 0; i < 100; i++) {console.log(i)}`}
        beforeMount={(monaco) => {
          monacoRef.current = monaco;
          createTheme()
        }}
        onMount={(editor, monaco) => {
          editorRef.current = editor;
        }}
      />
    </div>
  );
}

export default CodeEditor;
