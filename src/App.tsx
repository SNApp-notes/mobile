import 'react-native-gesture-handler';
import {
  View,
  Pressable,
  Text,
  StyleSheet
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import {
  useNavigation,
  NavigationContainer
} from '@react-navigation/native';
import { Entypo, AntDesign } from '@expo/vector-icons';
import {
  createDrawerNavigator,
  DrawerContentComponentProps,
  DrawerContentScrollView,
  DrawerItem
} from '@react-navigation/drawer';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import {
  useEditorContext,
  EditorContextProvider
} from './Editor';
import MainScreen from './screens/Main';
import Settings from './screens/Settings';

const RightDrawer = createDrawerNavigator();
const LeftDrawer = createDrawerNavigator();
const BottomStack = createBottomTabNavigator();

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

const RightDrawerContent = (props: DrawerContentComponentProps) => {
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
};

const BottomTabs = () => {
  return (
    <BottomStack.Navigator>
      <BottomStack.Screen
        name="Notes"
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <AntDesign name="filetext1" size={size} color={color} />
          )
        }}
        component={RightDrawerScreen}
      />
      <BottomStack.Screen
        name="Settings"
        options={{
          tabBarIcon: ({ color, size }) => (
            <AntDesign name="setting" size={size} color={color} />
          )
        }}
        component={Settings}
      />
    </BottomStack.Navigator>
  );
};

const LeftDrawerScreen = () => {
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
};

const RightDrawerScreen = () => {
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
};


const App = () => {
  return (
    <EditorContextProvider>
      <NavigationContainer>
        <BottomTabs/>
      </NavigationContainer>
      <StatusBar style="auto" />
    </EditorContextProvider>
  );
};

export default App;

const styles = StyleSheet.create({
  drawerHeader: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  drawerTitle: {
    fontSize: 18,
    fontWeight: 'bold'
  }
});
