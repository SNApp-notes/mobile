import { type FC, type ReactNode } from 'react';
import {
  SafeAreaView,
  StyleSheet
} from 'react-native';

const Layout: FC<{children: ReactNode}> = ({children}) => {
  return (
    <SafeAreaView style={styles.container}>
      {children}
    </SafeAreaView>
  );
};

export default Layout;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  }
});
