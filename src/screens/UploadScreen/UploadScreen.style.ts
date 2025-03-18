import { StyleSheet } from 'react-native';
import theme from '../../../ theme';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        padding: 20,
    },
    selectedFileText: {
        marginTop: 10,
        fontSize: 16,
        fontFamily: theme.fonts.bold,
    },
    errorText: {
        color: 'red',
        marginTop: 10,
    },
    transcriptionContainer: {
        marginTop: 10,
        padding: 10,
        borderWidth: 0,
        borderRadius: 5,
        backgroundColor: theme.colors.diff,
        width: "100%",
    },
    transcriptionActions: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "flex-end",
        gap: 10,
    },
    transcribedText: {
        fontSize: 16,
        fontFamily: theme.fonts.regular,
    },
    copyButton: {
        marginTop: 10,
        backgroundColor: theme.colors.primary,
        padding: 10,
        borderRadius: 5,
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        width: 40,
    },
    copyButtonText: {
        color: 'white',
    },
    uploadButton: {
        backgroundColor: "transparent",
        paddingVertical: 10,
        paddingHorizontal: 25,
        borderRadius: 15,
        alignItems: "center",
        borderWidth: 1,
        borderColor: theme.colors.secondary,
        display: "flex",
        flexDirection: "row",
        gap: 10,
    },
    uploadButtonText: {
        color: theme.colors.secondary,
        fontSize: 16,
        fontWeight: "bold",
        fontFamily: theme.fonts.bold,
    },
    selectedFileContainer: {
        marginTop: 10,
        gap: 10,
        alignItems: "center",
        padding: 10,
        borderWidth: 0,
        borderRadius: 10,
    },
    audioRecorderContainer: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: 40,
    },
    audioPreview: {
        marginTop: 15,
        width: "100%",
        padding: 10,
        backgroundColor: theme.colors.diff,
        borderRadius: 10,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },

    playButton: {
        backgroundColor: theme.colors.primary,
        borderRadius: 50,
        alignItems: "center",
        justifyContent: "center",
        display: "flex",
        width: 40,
        height: 40,
    },

});

export default styles;
