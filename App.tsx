import { type FC, type ReactNode, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import {
  StyleSheet,
  SafeAreaView
} from 'react-native';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItem,
  type DrawerContentComponentProps
} from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';

import { NavigationContext, type HeaderNavigationNode } from './Context';
import Editor from './Editor';

const Drawer = createDrawerNavigator();

const CustomDrawer = (props: DrawerContentComponentProps) => {
  return (
    <DrawerContentScrollView {...props}>
      <DrawerItem
        label="React Native"
        onPress={() => console.log('React Native')}
      />
    </DrawerContentScrollView>
  );
}

export default function App() {
  const [headerNodes, setHeaderNodes] = useState<HeaderNavigationNode[]>([]);
  return (
    <NavigationContext.Provider value={{ headerNodes, setHeaderNodes }}>
      <NavigationContainer>
        <Drawer.Navigator initialRouteName="Main" drawerContent={CustomDrawer}>
          <Drawer.Screen name="Main" component={Main} />
        </Drawer.Navigator>
      </NavigationContainer>
      <StatusBar style="auto" />
    </NavigationContext.Provider>
  );
}

const Layout: FC<{children: ReactNode}> = ({children}) => {
  return (
    <SafeAreaView style={styles.container}>
      {children}
    </SafeAreaView>
  );
};

const Main = () => {
  return (
    <Layout>
      <Editor
        initValue={NOTE} />
    </Layout>
  );
};

const NOTE = `# HEADER 1

\`\`\`javascript
function hello(name) {
   return \`hello $\{name}\`;
}
\`\`\`

## Header 2

This is some text

`

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  textarea: {
    textAlignVertical: 'top',
    textAlign: 'left',
    backgroundColor: 'white',
    flex: 1,
    fontFamily: 'monospace',
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  header: {
    fontWeight: "900",
    color: '#0045C9',
  },
});
