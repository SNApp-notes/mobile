import type { FC, ReactNode } from 'react';
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
  return (
    <>
      <NavigationContainer>
        <Drawer.Navigator initialRouteName="Main" drawerContent={CustomDrawer}>
          <Drawer.Screen name="Main" component={Main} />
        </Drawer.Navigator>
      </NavigationContainer>
      <StatusBar style="auto" />
    </>
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
        initValue={`# HEADER 1

\`\`\`
function hello(name) {
   return \`hello $\{name}\`;
}
\`\`\``} />
    </Layout>
  );
};

const NOTE = `
## Remote Images

<Image source={{ uri: imageUrl }} style={styles.image} />

const styles = StyleSheet.create({
  image: {
    width: '100%',
    height: 200
  }
});


## React Navigation

const Stack = createNativeStackNavigator();
import Categories from './components/Categories';

export default function App() {
  return (
    <>
      <StatusBar style="light" />
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Category"> {/* optional or first *}
          <Stack.Screeen name="Categories" component={Categories}/>
          <Stack.Screeen name="Category" component={Category}/>
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
};

function Categories({ navigation, route }) {
  function onPress() {
    navigation.navigate('Category', { id: 10 });
  }

}

function Category({ route }) {
  const { id } = route.params;
  return (
    <Text>This is { id }</Text>
  );
}


import { useNavigation, useRoute } from '@react-navigation/native';


function NestedComponent() {
  const navigation = useNavigation();
}`

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
