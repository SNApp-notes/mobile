import { useState, Fragment, useEffect } from 'react';
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
import { type HeaderNavigationNode, useHeaderNavigation } from './Context';

type EditorProps = {
  initValue: string;
  style?: StyleProp<TextStyle>;
  onChange?: (value: string) => void;
};

const fontSize = 14;

const isHeaderNode = (node: MarkdownNode): node is HeaderNode => {
  return node.type === 'header';
};

const Editor = ({ initValue, style, onChange = () => {} }: EditorProps) => {
  const [value, setValue] = useState<string>(initValue);
  const { setHeaderNodes } = useHeaderNavigation();

  const changeHandler = (text: string) => {
    setValue(text);
    onChange(text);
  };
  const ast = parse(value);

  const headers: HeaderNavigationNode[] = ast.filter(isHeaderNode).map(node => {
    const { content, loc: { start: { line } } } = node;
    return { content, line };
  });

  useEffect(() => {
    setHeaderNodes(headers);
  }, [JSON.stringify(headers)]);

  return (
    <TextInput
      style={[styles.editor, style]}
      multiline
      autoComplete="off"
      autoCorrect={false}
      autoFocus={true}
      onChangeText={changeHandler}>
      <Text>
        {ast.map((node, index) => {
          const style = styles[node.type];
          if (node.type !== 'link') {
            const { content } = node;
            const key = `${index}-${content}`;
            if (node.type === 'code') {
               const { language } = node;
               if (!language) {
                 return (
                   <Text key={key} style={style}>
                     ```{ content }{'\n'}```
                   </Text>
                 );
               } else {
                 return (
                   <Fragment key={key}>
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
                   </Fragment>
                 );
               }
            }
            return (
              <Text key={key} style={style}>{ content }</Text>
            );
          }
        })}
      </Text>
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
