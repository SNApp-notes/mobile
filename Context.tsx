import {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
  type RefObject,
  type FC,
  type ReactNode
} from 'react';

export interface HeaderNavigationNode {
  content: string;
  line: number;
  offset: number;
}

export interface Editor {
  goto: (offset: number) => void;
  blur: () => void;
  focus: () => void;
}

type EditorRef = RefObject<Editor>;

export interface Context {
  headerNodes: HeaderNavigationNode[];
  editor: EditorRef;
  setEditorRef: (ref: EditorRef) => void;
  setHeaderNodes: (nodes: HeaderNavigationNode[]) => void;
}

const NavigationContext = createContext<Context>(null)

export const useEditorContext = () => useContext(NavigationContext);

export const EditorContextProvider: FC<{children: ReactNode}> = ({children}) => {
  const [headerNodes, setHeaderNodes] = useState<HeaderNavigationNode[]>([]);
  const editor = useRef<Editor>(null);

  const setEditorRef = useCallback((ref: EditorRef) => {
    editor.current = ref.current;
  }, [editor]);

  const context = {
    headerNodes,
    setHeaderNodes,
    setEditorRef,
    editor
  };
  return (
    <NavigationContext.Provider value={context}>
      {children}
    </NavigationContext.Provider>
  );
};
