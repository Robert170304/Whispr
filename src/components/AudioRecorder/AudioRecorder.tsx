import React, { useState } from "react";
import { View, TouchableOpacity } from "react-native";
import { Audio } from "expo-av";
import Icon from "../../../assets/icons/audio-mic-bg.svg"; // Import your SVG file
import { Entypo, FontAwesome6 } from "@expo/vector-icons";
import theme from "../../../ theme";
import styles from './AudioRecorder.style'; // Import styles
import Svg, { Circle } from "react-native-svg"; // For circular progress
import CustomText from "../CustomText";
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from "expo-file-system";

interface AudioRecorderProps {
    setIsRecording: (recording: Audio.Recording | null) => void;
    isRecording: Audio.Recording | null;
    setAudioUri: (uri: string | null) => void;
    setFile: (file: DocumentPicker.DocumentPickerAsset | null) => void;
}

const MAX_RECORDING_TIME = 60; // Max duration in seconds

const AudioRecorder: React.FC<AudioRecorderProps> = ({ setIsRecording, isRecording, setAudioUri, setFile }) => {
    const [seconds, setSeconds] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const [timerInterval, setTimerInterval] = useState<NodeJS.Timeout | null>(null);

    // Calculate progress (0 to 1)
    const progress = seconds / MAX_RECORDING_TIME;

    // Function to format time (HH:MM:SS)
    const formatTime = (totalSeconds: number) => {
        const hrs = Math.floor(totalSeconds / 3600);
        const mins = Math.floor((totalSeconds % 3600) / 60);
        const secs = totalSeconds % 60;
        return `${String(hrs).padStart(2, "0")} : ${String(mins).padStart(2, "0")} : ${String(secs).padStart(2, "0")}`;
    };

    const startRecording = async () => {
        try {
            const { status } = await Audio.requestPermissionsAsync();
            if (status !== "granted") {
                console.log("Mic permission denied!");
                return;
            }

            console.log("Starting recording...");

            const recordingObject = new Audio.Recording();
            await recordingObject.prepareToRecordAsync({
                android: {
                    extension: ".wav",
                    outputFormat: 2, // MPEG_4 format
                    audioEncoder: 3, // AAC Encoder
                    sampleRate: 44100,
                    numberOfChannels: 1,
                    bitRate: 128000,
                },
                ios: {
                    extension: ".wav",
                    audioQuality: 1,
                    outputFormat: 2, // MPEG_4 format
                    sampleRate: 44100,
                    numberOfChannels: 1,
                    bitRate: 128000,
                    linearPCMBitDepth: 16,
                    linearPCMIsBigEndian: false,
                    linearPCMIsFloat: false,
                },
                web: {
                    mimeType: "audio/wav",
                    bitsPerSecond: 128000,
                },
            });


            await recordingObject.startAsync();

            setIsRecording(recordingObject);
            setSeconds(0); // Reset timer
            setIsPaused(false); // Reset pause state

            // Start timer
            // const interval = setInterval(() => {
            //     setSeconds((prev) => Math.min(prev + 1, MAX_RECORDING_TIME));
            // }, 1000);
            const interval = setInterval(() => {
                setSeconds((prev) => {
                    if (prev + 1 >= MAX_RECORDING_TIME) {
                        clearInterval(interval); // Stop timer
                        stopRecording(recordingObject); // Auto-stop recording after 60 sec
                        return MAX_RECORDING_TIME;
                    }
                    return prev + 1;
                });
            }, 1000);
            setTimerInterval(interval);

            console.log("Recording started");
        } catch (error) {
            console.log("Error starting recording:", error);
        }
    };

    const stopRecording = async (recordingInstance?: Audio.Recording) => {
        try {
            const recordingToStop = recordingInstance || isRecording; // Use passed instance or fallback to state
            if (!recordingToStop) {
                console.log("No recording instance found!");
                return;
            }
            console.log("Stopping recording...");

            await recordingToStop.stopAndUnloadAsync();
            const uri = recordingToStop.getURI();
            console.log("Raw recorded URI:", uri)
            // Check file info
            const fileInfo = await FileSystem.getInfoAsync(uri ?? "");
            console.log("Recorded file info:", fileInfo);
            setAudioUri(uri);
            setFile({ name: `recorded_audio_${Date.now()}.wav`, uri: uri ?? "" });
            setIsRecording(null);

            // Clear timer
            if (timerInterval) clearInterval(timerInterval);
            setTimerInterval(null);

            console.log("Recording stopped. File saved at:", uri);
        } catch (error) {
            console.log("Error stopping recording:", error);
        }
    };

    const pauseRecording = async () => {
        try {
            if (!isRecording) return;

            if (isPaused) {
                // Resume Recording
                await isRecording.startAsync();
                setIsPaused(false);

                // Resume timer
                // const interval = setInterval(() => {
                //     setSeconds((prev) => Math.min(prev + 1, MAX_RECORDING_TIME));
                // }, 1000);
                const interval = setInterval(() => {
                    setSeconds((prev) => {
                        if (prev + 1 >= MAX_RECORDING_TIME) {
                            clearInterval(interval); // Stop timer
                            stopRecording(); // Auto-stop recording after 60 sec
                            return MAX_RECORDING_TIME;
                        }
                        return prev + 1;
                    });
                }, 1000);
                setTimerInterval(interval);
            } else {
                // Pause Recording
                await isRecording.pauseAsync();
                setIsPaused(true);

                // Stop timer
                if (timerInterval) clearInterval(timerInterval);
            }
        } catch (error) {
            console.log("Error pausing/resuming recording:", error);
        }
    };


    return (
        <View>
            {!isRecording ? <View style={styles.audioRecorderContainer}>
                <Icon width={350} height={350} />
                <TouchableOpacity onPress={startRecording} style={styles.recordButton}>
                    <Entypo name="mic" size={80} color={theme.colors.background} style={styles.audioMicIcon} />
                </TouchableOpacity>
            </View> :
                <View style={styles.progressContainer}>
                    <Svg width={350} height={350} viewBox="0 0 100 100">
                        {/* Thin Outer Ring */}
                        <Circle cx="50" cy="50" r="48" stroke="#E0E0E0" strokeWidth="0.2" fill="none" />

                        {/* Thick Inner Ring */}
                        <Circle cx="50" cy="50" r="40" stroke={theme.colors.lightYellowShade} strokeWidth="2.5" fill="none" />
                        {/* Progress Ring */}
                        <Circle
                            cx="50"
                            cy="50"
                            r="40"
                            stroke={theme.colors.secondary}
                            strokeWidth="0.7"
                            fill="none"
                            strokeDasharray="251.2" // 2 * π * r (circle circumference)
                            strokeDashoffset={251.2 - (progress * 251.2)}
                            strokeLinecap="round"
                            transform="rotate(-90 50 50)"
                        />

                        {/* Another Inner Ring (Lighter Gray) */}
                        <Circle cx="50" cy="50" r="25" stroke="#F0F0F0" strokeWidth="6" fill="none" />
                    </Svg>
                    <Entypo name="mic" size={80} color={theme.colors.secondary} style={styles.audioMicRecOnIcon} />
                </View>}
            {isRecording && <View style={styles.recorderActions}>
                <TouchableOpacity onPress={pauseRecording} style={styles.pauseButton}>
                    <FontAwesome6 name={isPaused ? "play" : "pause"} size={22} color={theme.colors.secondary} />
                </TouchableOpacity>
                <CustomText style={styles.timerText}>{formatTime(seconds)}</CustomText>
                <TouchableOpacity onPress={() => stopRecording(isRecording)} style={styles.stopButton}>
                    <FontAwesome6 name="stop" size={20} color={theme.colors.background} />
                </TouchableOpacity>
            </View>}
        </View>
    );
};

export default AudioRecorder;
