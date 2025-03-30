import { StyleSheet } from 'react-native';
import theme from '../../../ theme';

const styles = StyleSheet.create({
    audioRecorderContainer: {
        position: "relative",
    },
    recordButton: {
        padding: 10,
        position: "absolute",
        top: 125,
        left: 125
    },
    audioMicIcon: {},
    audioMicRecOnIcon: { position: "absolute", top: 135, left: 135 },
    pauseButton: {
        width: 50,
        height: 50,
        backgroundColor: theme.colors.lightYellowShade,
        borderRadius: 50,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    },
    stopButton: {
        width: 50,
        height: 50,
        backgroundColor: theme.colors.secondary,
        borderRadius: "50%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    },
    recorderActions: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        gap: 20,
    },
    timerText: {
        fontSize: 20,
        fontWeight: "bold",
        color: theme.colors.text,
        marginVertical: 10,
        opacity: 0.3,
    },
    progressContainer: {
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
    },
});

export default styles;
