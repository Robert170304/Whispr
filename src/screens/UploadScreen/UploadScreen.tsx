import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, TouchableOpacity, ScrollView, Modal, TextInput, ToastAndroid } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { Audio } from "expo-av";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import * as DocumentPicker from 'expo-document-picker';
// import * as FileSystem from "expo-file-system";
import styles from './UploadScreen.style'; // Import styles
import CustomText from '../../components/CustomText';
import theme from '../../../ theme';
import { useDispatch, useSelector } from 'react-redux';
import { addRecording, completeUpload } from '../../redux/appSlice';
import { useNavigation } from '@react-navigation/native';
import type { NavigationProps } from '../../../types/AppNavigatorTypes';

const UploadScreen = () => {
    const dispatch = useDispatch();
    const [transcription, setTranscription] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [title, setTitle] = useState("");
    const uploads = useSelector((state: { app: { uploads: any } }) => state.app.uploads);
    const [modalVisible, setModalVisible] = useState(false);
    const [sound, setSound] = useState<Audio.Sound | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const navigation = useNavigation<NavigationProps>();

    useEffect(() => {
        return () => {
            if (sound) {
                sound.unloadAsync();
            }
        };
    }, [sound]);

    const saveTranscription = () => {
        if (!title.trim()) return alert("Please enter a title.");
        dispatch(addRecording({
            id: Date.now().toString(),
            title,
            transcription,
            audioFile: uploads.uploadedFile,
        }));
        setTitle("");
        setModalVisible(false);
        ToastAndroid.show('Recording saved with transcription.', ToastAndroid.SHORT);
        navigation.goBack();
    };

    const pickFile = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({ type: 'audio/*' });
            if (result.canceled) return;
            dispatch(completeUpload(result.assets[0]));
        } catch (error) {
            console.error('Error picking file:', error);
        }
    };

    // const prepareRecordedFile = async (uri: string) => {
    //     const newUri = FileSystem.cacheDirectory + "recorded.mp3";
    //     await FileSystem.copyAsync({ from: uri, to: newUri });
    //     const newFileInfo = await FileSystem.getInfoAsync(newUri);
    //     console.log("Copied file info:", newFileInfo);
    //     return newUri;
    // }

    const uploadAudio = async (uri: string) => {
        setLoading(true);
        setError("");
        const formData = new FormData();

        // Append the file with correct metadata
        formData.append("audio", {
            uri,
            name: "audio.mp3", // You can use file.name if available
            type: "audio/mpeg", // Adjust based on the file type
        } as any); // `as any` to avoid TypeScript complaints

        try {
            const res = await fetch("https://6c50-103-247-54-82.ngrok-free.app/transcribe", {
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
            ToastAndroid.show('Transcription copied to clipboard!', ToastAndroid.SHORT);
        }
    };

    const playPauseAudio = async () => {
        try {
            if (!uploads.uploadedFile.uri) return;

            if (sound) {
                if (isPlaying) {
                    await sound.pauseAsync();
                } else {
                    await sound.replayAsync();
                }
                setIsPlaying(!isPlaying);
                return;
            }

            const { sound: newSound } = await Audio.Sound.createAsync({ uri: uploads.uploadedFile.uri, }, { shouldPlay: true });
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
        <ScrollView style={{ flex: 1, backgroundColor: theme.colors.background }}>
            <View style={styles.container}>
                <View style={styles.audioRecorderContainer}>
                    {/* <AudioRecorder
                        setIsRecording={setIsRecording}
                        isRecording={isRecording}
                        setAudioUri={setAudioUri}
                        setFile={setFile}
                    /> */}
                    {/* {!isRecording && ( */}
                    <TouchableOpacity style={styles.uploadButton} onPress={pickFile}>
                        <MaterialIcons name="audio-file" size={30} color={theme.colors.secondary} />
                        <CustomText style={styles.uploadButtonText}>Upload File</CustomText>
                    </TouchableOpacity>
                    {/* )} */}
                </View>
                {uploads.uploadedFile?.uri && (
                    <View style={styles.audioPreview}>
                        <CustomText style={{ maxWidth: 300 }} >Audio File: {uploads.uploadedFile?.name ?? "Recorded Audio"}</CustomText>
                        <TouchableOpacity onPress={playPauseAudio} style={styles.playButton}>
                            <MaterialIcons name={isPlaying ? "pause-circle-filled" : "play-circle-filled"} size={25} color={theme.colors.background} />
                        </TouchableOpacity>
                    </View>
                )}
                {uploads.uploadedFile && <View style={styles.selectedFileContainer}>
                    <TouchableOpacity style={styles.uploadButton} onPress={() => uploads.uploadedFile && uploadAudio(uploads.uploadedFile.uri)} disabled={!uploads.uploadedFile || loading} >
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
                            <TouchableOpacity disabled={transcription === "Transcription failed"} onPress={() => setModalVisible(true)} style={styles.copyButton}>
                                <MaterialIcons name="save" size={20} color="#fff" />
                            </TouchableOpacity>
                        </View>
                    </View>
                ) : null}
            </View>
            <Modal
                animationType="slide"
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <CustomText style={styles.modalTitle} >Give a name to this recording</CustomText>
                        <TextInput
                            placeholder="Enter name"
                            value={title}
                            onChangeText={setTitle}
                            style={styles.modalInput}
                        />
                        <View style={styles.modalButtons}>
                            <TouchableOpacity
                                onPress={() => setModalVisible(false)}
                                style={styles.cancelButton}
                            >
                                <CustomText style={styles.cancelBtnText} >Cancel</CustomText>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={saveTranscription}
                                style={styles.saveConfirmButton}
                            >
                                <CustomText style={styles.saveBtnText}>Save</CustomText>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </ScrollView>
    );
};

export default UploadScreen;
