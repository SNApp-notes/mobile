import {
  forwardRef,
  useImperativeHandle,
  useState,
  useEffect,
  useRef,
  type FC,
  type ReactNode
} from 'react';
import {
  StyleSheet,
  TextInput,
  Text,
  StyleProp,
  TextStyle,
  type ColorValue
} from 'react-native';
import SyntaxHighlighter from 'rn-syntax-highlighter';

export interface CodeTheme {
  type: 'prism' | 'hljs';
  style: any;
}

export interface Theme {
  normal: ColorValue;
  header: ColorValue;
  code: CodeTheme;
}

import { atomOneLight } from 'react-syntax-highlighter/dist/esm/styles/hljs';

import { parse, type HeaderNode, type MarkdownNode } from './parser';
import { type HeaderNavigationNode, type Editor as EditorRef,  useEditorContext } from './Context';

interface EditorProps {
  initValue: string;
  style?: StyleProp<TextStyle>;
  theme?: Theme;
  onChange?: (value: string) => void;
}

const fontSize = 14;

const isHeaderNode = (node: MarkdownNode): node is HeaderNode => {
  return node.type === 'header';
};

interface EditorNodeProps {
  node: MarkdownNode;
  theme: Theme;
}

const DummyText: FC<{children: ReactNode}> = ({ children }) => {
  return <Text>{children}</Text>;
};

const EditorNode: FC<EditorNodeProps> = ({node, theme}) => {
  const defaultStyle = styles[node.type];
  const isCode = node.type === 'code';
  const style = {
    color: isCode ? theme.normal : theme[node.type] ?? theme.normal
  };
  if (node.type !== 'link') {
    const { content } = node;
    if (node.type === 'code') {
      const { language } = node;
      if (!language) {
        return (
          <Text style={[defaultStyle, style]}>
            ```{ content }{'\n'}```
          </Text>
        );
      } else {
        return (
          <>
            <Text style={[defaultStyle, style]}>```{language}</Text>
            <SyntaxHighlighter
              language={language}
              style={theme.code.style }
              fontSize={fontSize}
              PreTag={DummyText}
              CodeTag={DummyText}
              highlighter={theme.code.type}
            >
              { content }
            </SyntaxHighlighter>
            <Text style={[defaultStyle, style]}>{'\n'}```</Text>
          </>
        );
      }
    }
    return (
      <Text style={[defaultStyle, style]}>{ content }</Text>
    );
  }
};

const Editor = forwardRef<EditorRef, EditorProps>(({
  initValue,
  style,
  theme = {
    header: '#0045C9',
    normal: '#000',
    code: {
      type: 'hljs',
      style: atomOneLight
    }
  },
  onChange = () => {}
}, ref) => {
  useImperativeHandle(ref, () => {
    return {
      focus() {
        input.current.focus();
      },
      blur() {
        input.current.blur();
      },
      goto(offset: number) {
        input.current.focus();
        (input.current as any).setSelection(offset, offset);
      }
    };
  });

  const [value, setValue] = useState<string>(initValue);
  const { setHeaderNodes } = useEditorContext();
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

  return (
    <TextInput
      ref={input}
      style={[styles.editor, style]}
      multiline
      autoComplete="off"
      autoCorrect={false}
      autoFocus={true}
      onChangeText={changeHandler}
    >
      <Text>
        {ast.map((node, index) => {
          const { content } = node;
          const key = `${index}-${content}`;
          return <EditorNode key={key} theme={theme} node={node}/>;
        })}
      </Text>
    </TextInput>
  );
});

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
    fontWeight: "900"
  },
});
