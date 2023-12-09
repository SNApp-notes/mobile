import { useState } from 'react';
import {
  StyleSheet,
  TextInput,
  Text,
  StyleProp,
  TextStyle
} from 'react-native';
import SyntaxHighlighter from 'react-native-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/styles/prism';
import { parse, type HeaderNode, type MarkdownNode } from './parser';

type EditorProps = {
  initValue: string;
  style?: StyleProp<TextStyle>;
  onChange?: (value: string) => void;
};

const isHeaderNode = (node: MarkdownNode): node is HeaderNode => {
  return node.type === 'header';
};

const Editor = ({ initValue, style, onChange = () => {} }: EditorProps) => {
  const [value, setValue] = useState<string>(initValue);

  const changeHandler = (text: string) => {
    setValue(text);
    onChange(text);
  };
  const ast = parse(value);

  
  const headers: HeaderNode[] = ast.filter(isHeaderNode);
  
  console.log(JSON.stringify(headers, null, 4));

  return (
    <TextInput
      style={[styles.editor, style]}
      multiline
      autoComplete="off"
      autoCorrect={false}
      autoFocus={true}
      onChangeText={changeHandler}>
      <Text>
        {ast.map((node, index, lines) => {
          const style = styles[node.type];
          if (node.type !== 'link') {
            const { content } = node;
            const key = `${index}-${content}`;
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
