import { createContext, useContext } from 'react';

export interface HeaderNavigationNode {
  content: string;
  line: number;
}

export interface Context {
  headerNodes: HeaderNavigationNode[];
  setHeaderNodes: (nodes: HeaderNavigationNode[]) => void;
}

export const NavigationContext = createContext<Context>(null)

export const useHeaderNavigation = () => useContext(NavigationContext);
