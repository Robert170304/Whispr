import React from 'react';
import { View } from 'react-native';
import styles from './HeaderStyles'; // Import styles
import CustomText from '../CustomText';

const Header: React.FC = () => {
    return (
        <View style={styles.container}>
            <CustomText style={styles.title}>Whispr</CustomText>
        </View>
    );
};

export default Header;
