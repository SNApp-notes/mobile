import { useRef, useEffect } from 'react';
import * as SQLite from 'expo-sqlite';
import { docco, dracula } from 'react-syntax-highlighter/dist/esm/styles/hljs';

import {
  useEditorContext,
  Editor,
  type Theme
} from '../Editor';
import Layout from '../Layout';
import { useTheme } from '../Theme';
import colors from '../const/colors';

const MainScreen = () => {
  const editor = useRef();
  const { setEditorRef } = useEditorContext();
  const { darkMode } = useTheme();

  useEffect(() => {
    setEditorRef(editor);
  }, [editor.current]);

  const style = {
    backgroundColor: darkMode ? colors.dark.main : colors.light.main
  };

  const theme: Theme = {
    ...colors[darkMode ? 'dark' : 'light'].content,
    code: {
      type: 'hljs',
      style: darkMode ? dracula : docco
    }
  };

  return (
    <Layout>
      <Editor
        ref={editor}
        style={style}
        theme={theme}
        initValue={NOTE} />
    </Layout>
  );
};

export default MainScreen;

const NOTE = `# HEADER 1

\`\`\`javascript
function hello(name) {
   return \`hello $\{name}\`;
}
\`\`\`

## Header 2

This is some text

`;
