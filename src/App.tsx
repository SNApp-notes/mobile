import 'react-native-gesture-handler';
import {
  View,
  Text,
  StyleSheet
} from 'react-native';
import {
  NavigationContainer
} from '@react-navigation/native';
import { AntDesign } from '@expo/vector-icons';
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
import { ThemeProvider, useTheme } from './Theme';
import MainScreen from './screens/Main';
import Settings from './screens/Settings';
import StatusBar from './StatusBar';
import HamburgerMenu from './HamburgerMenu';
import colors from './const/colors';

const RightDrawer = createDrawerNavigator();
const LeftDrawer = createDrawerNavigator();
const BottomStack = createBottomTabNavigator();

const useNavigationStyle = () => {
  const { darkMode } = useTheme();
  const backgroundColor = darkMode ? colors.dark.header : colors.light.header;
  const color = darkMode ? '#fff' : '#000'
  const dimmColor = darkMode? '#646464' : '#4A4A4A';
  const focusColor = darkMode ? '#0F6FDB' : '#D5CBFF';
  return {
    headerStyle: {
      backgroundColor
    },
    tabBarInactiveTintColor: dimmColor,
    tabBarActiveTintColor: focusColor,
    tabBarStyle: {
      backgroundColor
    },
    headerTintColor: color
  };
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


const LeftDrawerScreen = () => {
  const options = useNavigationStyle();
  const color = options.headerTintColor;
  return (
    <LeftDrawer.Navigator
      id="LeftDrawer"
      screenOptions={{
        ...options,
        drawerPosition: 'left',
        headerTitle: ({ children }) => {
          return (
            <View style={styles.drawerHeader}>
              <Text style={[styles.drawerTitle, { color }]}>{children}</Text>
              <HamburgerMenu color={color}/>
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
  const options = useNavigationStyle();
  return (
    <RightDrawer.Navigator
      id="RightDrawer"
      drawerContent={(props) => <RightDrawerContent {...props} />}
      screenOptions={{
        ...options,
        drawerPosition: 'right',
        headerShown: false
      }}>
      <RightDrawer.Screen name="HomeDrawer" component={LeftDrawerScreen} />
    </RightDrawer.Navigator>
  );
};

const BottomTabs = () => {
  const options = useNavigationStyle();
  return (
    <BottomStack.Navigator
      screenOptions={options}>
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

const App = () => {
  return (
    <EditorContextProvider>
      <ThemeProvider>
        <NavigationContainer>
          <BottomTabs/>
        </NavigationContainer>
        <StatusBar/>
      </ThemeProvider>
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
