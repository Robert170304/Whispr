import { StyleSheet } from 'react-native';
import theme from '../../../ theme';

export default StyleSheet.create({
    container: {
        marginTop: 25,
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        backgroundColor: theme.colors.primary,
    },
    backButton: {
        marginRight: 10,
    },
    title: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
    },
});
