import 'react-native-gesture-handler';
import { type FC, type ReactNode, useRef, useEffect } from 'react';
import {
  View,
  Pressable,
  Text,
  SafeAreaView,
  StyleSheet
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import {
  useNavigation,
  NavigationContainer
} from '@react-navigation/native';
import { Entypo } from '@expo/vector-icons';
import {
  createDrawerNavigator,
  DrawerContentComponentProps,
  DrawerContentScrollView,
  DrawerItem
} from '@react-navigation/drawer';

import {
  useEditorContext,
  EditorContextProvider,
  Editor
} from './Editor';


const HamburgerMenu = ({ size = 26, color='black' }) => {
  const navigation = useNavigation();
  const { editor } = useEditorContext();
  const openRightMenu = () => {
    (navigation as any).getParent('RightDrawer').openDrawer();
    editor.current.blur();
  };
  return (
    <Pressable onPress={openRightMenu} style={({pressed}) => {
      if (pressed) {
        return { opacity: 0.5 };
      }
      return {};
    }}>
      <Entypo name="menu" size={size} color={color} />
    </Pressable>
  );
};

function RightDrawerContent(props: DrawerContentComponentProps) {
  const { navigation } = props;
  const { headerNodes, editor } = useEditorContext();
  return (
    <DrawerContentScrollView {...props}>
      {headerNodes.map(node => {
        const onPress = () => {
          (navigation as any).getParent('RightDrawer').closeDrawer();
          editor.current.goto(node.offset);
        };
        return (
          <DrawerItem
            key={`${node.line}-${node.content}`}
            label={node.content}
            onPress={onPress} />
        );
      })}
    </DrawerContentScrollView>
  );
}

const LeftDrawer = createDrawerNavigator();

function LeftDrawerScreen() {
  return (
    <LeftDrawer.Navigator
      id="LeftDrawer"
      screenOptions={{
        drawerPosition: 'left',
        headerTitle: ({ children }) => {
          return (
            <View style={styles.drawerHeader}>
              <Text style={styles.drawerTitle}>{children}</Text>
              <HamburgerMenu/>
            </View>
          );
        }
      }}
    >
      <LeftDrawer.Screen name="Notes" component={MainScreen} />
    </LeftDrawer.Navigator>
  );
}

const RightDrawer = createDrawerNavigator();

function RightDrawerScreen() {
  return (
    <RightDrawer.Navigator
      id="RightDrawer"
      drawerContent={(props) => <RightDrawerContent {...props} />}
      screenOptions={{
        drawerPosition: 'right',
        headerShown: false
      }}>
      <RightDrawer.Screen name="HomeDrawer" component={LeftDrawerScreen} />
    </RightDrawer.Navigator>
  );
}

export default function App() {
  return (
    <EditorContextProvider>
      <NavigationContainer>
        <RightDrawerScreen />
      </NavigationContainer>
      <StatusBar style="auto" />
    </EditorContextProvider>
  );
}

const Layout: FC<{children: ReactNode}> = ({children}) => {
  return (
    <SafeAreaView style={styles.container}>
      {children}
    </SafeAreaView>
  );
};

const MainScreen = () => {
  const editor = useRef();
  const { setEditorRef } = useEditorContext();

  useEffect(() => {
    setEditorRef(editor);
  }, [editor.current]);

  return (
    <Layout>
      <Editor
        ref={editor}
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

`;


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  drawerHeader: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  drawerTitle: {
    fontSize: 18,
    fontWeight: 'bold'
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