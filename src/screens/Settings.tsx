import {
  View,
  Text,
  StyleSheet
} from 'react-native';

import Layout from '../Layout';

const Settings = () => {
  return (
    <Layout>
      <View style={styles.container}>
        <Text style={styles.text}>Settings</Text>
      </View>
    </Layout>
  );
};

export default Settings;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  text: {
    fontSize: 18
  }
});
