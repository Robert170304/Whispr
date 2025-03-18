import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, TouchableOpacity, ScrollView } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { Audio } from "expo-av";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from "expo-file-system";
import styles from './UploadScreen.style'; // Import styles
import CustomText from '../../components/CustomText';
import theme from '../../../ theme';
import AudioRecorder from '../AudioRecorder/AudioRecorder';

const UploadScreen = () => {
    const [file, setFile] = useState<DocumentPicker.DocumentPickerAsset | null>(null);
    const [transcription, setTranscription] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [isRecording, setIsRecording] = useState<Audio.Recording | null>(null);
    const [audioUri, setAudioUri] = useState<string | null>(null);

    const [sound, setSound] = useState<Audio.Sound | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);

    useEffect(() => {
        return () => {
            if (sound) {
                sound.unloadAsync();
            }
        };
    }, [sound]);

    const pickFile = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({ type: 'audio/*' });
            if (result.canceled) return;
            setFile(result.assets[0]);
            setAudioUri(result.assets[0].uri); // Save the uri for audio player
            console.log("🚀 ~ pickFile ~ audioUri:", audioUri)
        } catch (error) {
            console.error('Error picking file:', error);
        }
    };

    const prepareRecordedFile = async (uri: string) => {
        const newUri = FileSystem.cacheDirectory + "recorded.mp3";
        await FileSystem.copyAsync({ from: uri, to: newUri });
        return newUri;
    }

    const uploadAudio = async (uri: string) => {
        setLoading(true);
        setError("");
        const convertedUri = await prepareRecordedFile(uri);
        const formData = new FormData();

        // Append the file with correct metadata
        formData.append("audio", {
            uri: convertedUri,
            name: "audio.mp3", // You can use file.name if available
            type: "audio/mpeg", // Adjust based on the file type
        } as any); // `as any` to avoid TypeScript complaints

        try {
            const res = await fetch("https://c14b-103-247-54-97.ngrok-free.app/transcribe", {
                method: "POST",
                headers: {
                    "Content-Type": "multipart/form-data", // No need to set boundary, RN handles it
                },
                body: formData,
            });

            const data = await res.json();
            console.log("Response from /transcribe:", data);
            setTranscription(data.transcript || "Transcription failed");
        } catch (error) {
            console.error("Fetch Error:", error);
            setError("Failed to transcribe. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = async () => {
        if (transcription) {
            await Clipboard.setStringAsync(transcription);
            alert("Transcription copied to clipboard!");
        }
    };

    const playPauseAudio = async () => {
        try {
            if (!audioUri) return;

            if (sound) {
                if (isPlaying) {
                    await sound.pauseAsync();
                } else {
                    await sound.replayAsync();
                }
                setIsPlaying(!isPlaying);
                return;
            }

            const { sound: newSound } = await Audio.Sound.createAsync({ uri: audioUri, }, { shouldPlay: true });
            setSound(newSound);
            setIsPlaying(true);

            newSound.setOnPlaybackStatusUpdate((status) => {
                if (status.isLoaded && status.didJustFinish) {
                    setIsPlaying(false);
                    setSound(null);
                }
            });
        } catch (error) {
            console.error("Error playing audio:", error);
        }
    };



    return (
        <ScrollView>
            <View style={styles.container}>
                <View style={styles.audioRecorderContainer}>
                    <AudioRecorder
                        setIsRecording={setIsRecording}
                        isRecording={isRecording}
                        setAudioUri={setAudioUri}
                        setFile={setFile}
                    />
                    {!isRecording && (
                        <TouchableOpacity style={styles.uploadButton} onPress={pickFile}>
                            <MaterialIcons name="audio-file" size={30} color={theme.colors.secondary} />
                            <CustomText style={styles.uploadButtonText}>Upload File</CustomText>
                        </TouchableOpacity>
                    )}
                </View>
                {audioUri && (
                    <View style={styles.audioPreview}>
                        <CustomText style={{ maxWidth: 300 }} >Audio File: {file?.name ?? "Recorded Audio"}</CustomText>
                        <TouchableOpacity onPress={playPauseAudio} style={styles.playButton}>
                            <MaterialIcons name={isPlaying ? "pause-circle-filled" : "play-circle-filled"} size={25} color={theme.colors.background} />
                        </TouchableOpacity>
                    </View>
                )}
                {file && <View style={styles.selectedFileContainer}>
                    <TouchableOpacity style={styles.uploadButton} onPress={() => file && uploadAudio(file.uri)} disabled={!file || loading} >
                        {loading && <ActivityIndicator size="small" color={theme.colors.secondary} />}
                        <CustomText style={styles.uploadButtonText}>Transcribe Audio</CustomText>
                    </TouchableOpacity></View>}
                {error ? <CustomText style={styles.errorText}>{error}</CustomText> : null}
                {transcription ? (
                    <View style={styles.transcriptionContainer}>
                        <CustomText style={styles.transcribedText} >{transcription}</CustomText>
                        <View style={styles.transcriptionActions}>
                            <TouchableOpacity disabled={transcription === "Transcription failed"} onPress={copyToClipboard} style={styles.copyButton}>
                                <Ionicons name="copy" size={20} color="#fff" />
                            </TouchableOpacity>
                            <TouchableOpacity disabled={transcription === "Transcription failed"} onPress={copyToClipboard} style={styles.copyButton}>
                                <MaterialIcons name="save" size={20} color="#fff" />
                            </TouchableOpacity>
                        </View>
                    </View>
                ) : null}
            </View>
        </ScrollView>
    );
};

export default UploadScreen;
