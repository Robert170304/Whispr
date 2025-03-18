import { StyleSheet } from 'react-native';
import theme from './ theme';

export default StyleSheet.create({
    container: {
        fontFamily: theme.fonts.regular,
        fontSize: 16,
        color: '#555',
        flex: 1,
        backgroundColor: theme.colors.background,
    },
});
