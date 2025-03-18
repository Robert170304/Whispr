import { View } from 'react-native';
import UploadScreen from './src/screens/UploadScreen/UploadScreen';
import Header from './src/components/Header/Header';
import styles from './AppStyles'; // Import styles

export default function App() {
  return (
    <View style={styles.container}>
      <Header />
      <UploadScreen />
    </View>
  );
}