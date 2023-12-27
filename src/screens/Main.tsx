import { useRef, useEffect } from 'react';
import * as SQLite from 'expo-sqlite';

import {
  useEditorContext,
  Editor
} from '../Editor';
import Layout from '../Layout';

const MainScreen = () => {
  const editor = useRef();
  const db = useRef<SQLite.SQLiteDatabase>();
  const { setEditorRef } = useEditorContext();

  useEffect(() => {
    setEditorRef(editor);
  }, [editor.current]);

  useEffect(() => {
    db.current = SQLite.openDatabase('notes.db');
    db.current.transaction(tx => {
      tx.executeSql(`CREATE TABLE IF NOT EXISTS notes(id INTEGER PRIMARY KEY
                     AUTOINCREMENT, name VARCHAR(255), content TEXT, draft
                     TEXT, directory INTEGER`);
      tx.executeSql(`CREATE TABLE IF NOT EXISTS directories(id INTEGER PRIMARY
                     KEY AUTOINCREMENT, name VARCHAR(255), parent INTEGER
                     DEFAULT NULL`);
    });
  }, [db]);

  return (
    <Layout>
      <Editor
        ref={editor}
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
