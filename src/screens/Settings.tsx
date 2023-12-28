import {
  View,
  Text,
  Switch,
  StyleSheet
} from 'react-native';

import Layout from '../Layout';
import { useTheme } from '../Theme';
import colors from '../const/colors';

const Settings = () => {
  const { darkMode, setTheme } = useTheme();

  const toggleSwitch = () => {
    setTheme(state => !state);
  };

  const background = {
    backgroundColor: darkMode ? colors.dark.main : colors.light.main
  };

  const forground = {
    color: darkMode ? '#fff' : '#000'
  };

  return (
    <Layout>
      <View style={[styles.container, background]}>
        <View style={styles.row}>
          <Text style={[styles.header, forground]}>Dark Mode</Text>
          <Switch
            trackColor={{false: '#767577', true: '#81b0ff'}}
            thumbColor="#f4f3f4"
            ios_backgroundColor="#3e3e3e"
            onValueChange={toggleSwitch}
            value={darkMode}
          />
        </View>
      </View>
    </Layout>
  );
};

export default Settings;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 20
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  header: {
    fontSize: 18
  },
  label: {
    fontSize: 16
  }
});
