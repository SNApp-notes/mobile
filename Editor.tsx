import { useState, Fragment, useEffect, useCallback, useRef } from 'react';
import {
  StyleSheet,
  TextInput,
  Text,
  StyleProp,
  TextStyle
} from 'react-native';
import SyntaxHighlighter from 'react-native-syntax-highlighter';
import { atomOneLight } from 'react-syntax-highlighter/styles/hljs';
import { parse, type HeaderNode, type MarkdownNode } from './parser';
import { type HeaderNavigationNode, useEditorContext } from './Context';

type EditorProps = {
  initValue: string;
  style?: StyleProp<TextStyle>;
  onChange?: (value: string) => void;
};

const fontSize = 14;

const isHeaderNode = (node: MarkdownNode): node is HeaderNode => {
  return node.type === 'header';
};

type Selection = {
  start: number;
  end: number;
};

const EditorNode = ({node}) => {
  const style = styles[node.type];
  if (node.type !== 'link') {
    const { content } = node;
    if (node.type === 'code') {
      const { language } = node;
      if (!language) {
        return (
          <Text style={style}>
            ```{ content }{'\n'}```
          </Text>
        );
      } else {
        return (
          <>
            <Text>```{language}</Text>
            <SyntaxHighlighter
              language={language}
              style={atomOneLight}
              fontSize={fontSize}
              PreTag={Text}
              CodeTag={Text}
              highlighter={'hljs'}
            >
              { content }
            </SyntaxHighlighter>
            <Text>```</Text>
          </>
        );
      }
    }
    return (
      <Text style={style}>{ content }</Text>
    );
  }
}

const Editor = ({ initValue, style, onChange = () => {} }: EditorProps) => {
  const [value, setValue] = useState<string>(initValue);
  const [selection, setSelection] = useState<Selection>({start: 0, end: 0});
  const { setHeaderNodes, hub } = useEditorContext();
  const input = useRef<TextInput>();

  const changeHandler = (text: string) => {
    setValue(text);
    onChange(text);
  };
  const ast = parse(value);

  const headers: HeaderNavigationNode[] = ast.filter(isHeaderNode).map(node => {
    const { content, loc: { start: { line, offset } } } = node;
    return { content, line, offset };
  });

  useEffect(() => {
    setHeaderNodes(headers);
  }, [JSON.stringify(headers)]);

  const onSelectionChange = ({ nativeEvent: { selection } }) => {
    setSelection(selection);
  };

  const jumpHandler = useCallback((offset: number) => {
    input.current.focus();
    setSelection({ start: offset, end: offset });
  }, [setSelection]);

  const inputBlur = useCallback(() => {
    input.current.blur();
  }, []);

  useEffect(() => {
    const handler = jumpHandler;
    hub.on('jump', handler);
    hub.on('open-drawer', inputBlur);
    return () => {
      hub.off('jump', handler);
      hub.off('open-drawer', inputBlur);
    };
  }, [jumpHandler]);

  return (
    <TextInput
      ref={input}
      selection={selection}
      onSelectionChange={onSelectionChange}
      style={[styles.editor, style]}
      multiline
      autoComplete="off"
      autoCorrect={false}
      autoFocus={true}
      value={value}
      onChangeText={changeHandler}
    >
      {/*
          <Text>
            {ast.map((node, index) => {
              const { content } = node;
              const key = `${index}-${content}`;
              return <EditorNode key={key} node={node}/>;
            })}
          </Text>
      */}
    </TextInput>
  );
};

export default Editor;

const styles = StyleSheet.create({
  editor: {
    textAlignVertical: 'top',
    textAlign: 'left',
    backgroundColor: 'white',
    fontSize,
    flex: 1,
    fontFamily: 'monospace',
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  bold: {
    fontWeight: "900",
  },
  italic: {
    fontStyle: 'italic',
  },
  header: {
    fontWeight: "900",
    color: '#0045C9',
  },
});
