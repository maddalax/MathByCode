import { useEffect, useRef } from 'react';
import { EventBus } from './EventBus';
import type { EvalResult } from './CodeEditor';

type LogType = 'normal' | 'info' | 'error' | 'warn' | 'debug'

type Log = {
  timestamp: string,
  type: LogType,
  message: string
}

export const LogTypeToColor : Record<LogType, string> = {
  debug: '#254d85',
  info: '#45dbfd',
  error: '#f43911',
  warn: '#FFC300',
  normal: '#ffffff'
}


export function useConsoleLog({onChange} : {onChange: (logs: Log[]) => void}) {

  const logs = useRef<Log[]>([]);

  const handleChange = () => {
    onChange(logs.current);
  }

  const clear = () => {
    logs.current = [];
    onChange([]);
  }

  function redirect(args: {message: any, type: LogType}[]) {
    const time = new Date().toLocaleTimeString();

    for (let arg of args) {
      const log = {
        timestamp: time,
        type: arg.type,
        message: typeof arg.message === 'string' ? arg.message : JSON.stringify(arg.message, null, 2),
      }

      logs.current.push(log);
    }

    if(logs.current.length >= 100) {
      handleChange();
    }

    setTimeout(() => {
      handleChange();
    }, 300)
  }

  useEffect(() => {
    const id = EventBus.register('editor:eval', (result: EvalResult) => {
      if(result.type === 'console:log') {
        redirect(result.payload);
      }
    })
    return () => {
      EventBus.unregister(id);
    }
  }, [])

  return {
    logs,
    clear
  }
}