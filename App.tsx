import { View } from 'react-native';
import styles from './AppStyles'; // Import styles
import { Provider } from 'react-redux';
import store from './src/redux/store';
import AppNavigator from './src/navigation/AppNavigator';
import { PaperProvider } from 'react-native-paper';

export default function App() {

  return (
    <Provider store={store}>
      <PaperProvider>
        <View style={styles.container}>
          <AppNavigator />
        </View>
      </PaperProvider>
    </Provider>
  );
}