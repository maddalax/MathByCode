import { LogTypeToColor, useConsoleLog } from './useConsoleLog';
import React, { useRef, useState } from 'react';
import { Button, chakra, Stack } from '@chakra-ui/react';
import { AutoSizer, CellMeasurerCache, List, CellMeasurer } from 'react-virtualized';

export function Terminal() {

  const [length, setLength] = useState(0)

  const {logs, clear} = useConsoleLog({
    onChange: (logs) => {
      setLength(logs.length)
      setTimeout(() => {
        ref.current?.scrollToRow(logs.length);
      }, 300)
    }
  });

  const ref = useRef<List | null>(null)

  const cache = useRef(new CellMeasurerCache({
    defaultHeight: 24,
    fixedWidth: true,
  }));

  function rowRenderer({
    key, // Unique key within array of rows
    index, // Index of row within collection
    isScrolling, // The List is currently being scrolled
    isVisible, // This row is visible within the List (eg it is not an overscanned row)
    style,
    parent// Style object to be applied to row (to position it)
  }: any) {
    const log = logs.current[index];
    return (<CellMeasurer
        cache={cache.current}
        columnIndex={0}
        key={key}
        parent={parent}
        rowIndex={index}
      >
        <chakra.div style={style} key={key}>
          <p style={{color: LogTypeToColor[log.type]}}>
            {log.message}
          </p>
        </chakra.div>
      </CellMeasurer>
    );
  }

  return <Stack spacing={2}>
    <chakra.div height={'88vh'} width={'100%'}>
      <AutoSizer>
        {({height, width}) => (
          <List
            ref={ref}
            width={width}
            height={height}
            rowCount={length}
            rowHeight={cache.current.rowHeight}
            rowRenderer={rowRenderer}
            deferredMeasurementCache={cache.current}
          />
        )}
      </AutoSizer>
    </chakra.div>
    <Button onClick={clear}>
      Clear
    </Button>
  </Stack>;
}