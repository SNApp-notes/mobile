import {
  createContext,
  useContext,
  useState,
  useMemo,
  type RefObject,
  type FC,
  type ReactNode
} from 'react';
import { type TextInput } from 'react-native';
import { useEventEmitter } from './EventEmitter';

export interface HeaderNavigationNode {
  content: string;
  line: number;
  offset: number;
}

export type JumpHandler = (line: number) => void;

export interface Context {
  headerNodes: HeaderNavigationNode[];
  jumpHandler: JumpHandler;
  hub: ReturnType<typeof useEventEmitter>;
  setHeaderNodes: (nodes: HeaderNavigationNode[]) => void;
  setJumpHandler: (handler: JumpHandler) => void;
}

const NavigationContext = createContext<Context>(null)

export const useEditorContext = () => useContext(NavigationContext);

export const EditorContextProvider: FC<{children: ReactNode}> = ({children}) => {
  const [headerNodes, setHeaderNodes] = useState<HeaderNavigationNode[]>([]);
  const [jumpHandler, setJumpHandler] = useState<JumpHandler>(() => {});
  const hub = useEventEmitter();
  const context = {
    headerNodes,
    setHeaderNodes,
    jumpHandler,
    hub,
    setJumpHandler
  };
  return (
    <NavigationContext.Provider value={context}>
      {children}
    </NavigationContext.Provider>
  );
};
