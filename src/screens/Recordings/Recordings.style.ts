import { StyleSheet } from 'react-native';
import theme from '../../../ theme';

const styles = StyleSheet.create({
    container: {
        padding: 10,
        display: "flex",
        flexDirection: "column",
        gap: 15,
        backgroundColor: theme.colors.background,
        flex: 1,
    },
    title: {
        fontSize: 23,
        fontWeight: "bold",
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 5,
        marginBottom: 20,
    },
    searchInput: {
        flex: 1,
        height: 40,
        marginLeft: 5,
    },
    noDataFoundSection: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
    },
    noDataFoundText: {
        textAlign: "center",
        fontSize: 15,
        color: "#888",
        fontWeight: "bold"
    },
    uploadBtnContainer: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
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
        justifyContent: "center",
        width: 200,
    },
    uploadButtonText: {
        color: theme.colors.secondary,
        fontSize: 16,
        fontWeight: "bold",
        fontFamily: theme.fonts.bold,
    },
    recordingItem: {
        padding: 20,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10,
        flexDirection: 'column',
        gap: 10,
        fontWeight: "bold",
        fontSize: 16,
    },
    recording: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    recordingDetails: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        flex: 1,
        borderRadius: 10,
        borderWidth: 0,
        borderColor: theme.colors.diff,
    },
    recordingTitle: {
        fontSize: 16,
        fontWeight: "bold",
        fontFamily: theme.fonts.bold,
    },
    audioPlayBtn: {
        width: 50,
        height: 50,
        backgroundColor: theme.colors.lightYellowShade,
        borderRadius: 50,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    },
    recordingActions: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginLeft: 'auto',
        gap: 10,
    },
    transcriptionContainer: {
        padding: 10,
        borderRadius: 10,
        borderWidth: 0,
        borderColor: theme.colors.diff,
    },
    transcribedText: {
        fontSize: 14,
        color: '#aaa',
    },
    showMoreText: {
        color: theme.colors.primary,
        fontSize: 14,
        textAlign: "right",
        marginTop: 5,
    },
    recordingListScrollView: {
        flex: 1,
        gap: 15,
        display: "flex",
        flexDirection: "column",
        marginBottom: 100,
    },
    fabContainer: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        zIndex: 100, // Ensure it's above other elements
    },
    fab: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: theme.colors.primary, // Use your theme color
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5, // Shadow for Android
    },

});

export default styles;
