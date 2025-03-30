import React, { useEffect, useRef, useState } from 'react';
import { View, TextInput, TouchableOpacity, Animated, ScrollView, Keyboard, } from 'react-native';
import CustomText from '../../components/CustomText';
import styles from './Recordings.style';
import { Ionicons, MaterialIcons, FontAwesome6 } from "@expo/vector-icons";
import CatSittingInTheHouse from '../../../assets/icons/cat-sitting-in-the-house.svg';
import * as DocumentPicker from 'expo-document-picker';
import { useSelector, useDispatch } from 'react-redux';
import { completeUpload } from '../../redux/appSlice';
import { useNavigation } from '@react-navigation/native';
import type { NavigationProps } from '../../../types/AppNavigatorTypes';
import { Audio } from 'expo-av';
import theme from '../../../ theme';
import ContextMenuView from "react-native-context-menu-view";

const MAX_TRANSCRIPTION_LINES = 3;

const Recordings = () => {
    const [searchValue, setSearchValue] = useState('');
    const dispatch = useDispatch();
    const { recordings } = useSelector((state: { app: { recordings: any } }) => state.app);
    const navigation = useNavigation<NavigationProps>();
    const [sound, setSound] = useState<Audio.Sound | null>(null);
    const [playingRecordingId, setPlayingRecordingId] = useState<string | null>(null);
    const [expandedItems, setExpandedItems] = useState<{ [key: string]: boolean }>({});
    const animations = useRef<{ [key: string]: Animated.Value }>({}).current;
    const transcriptionHeights = useRef<{ [key: string]: { collapsed: number, expanded: number } }>({});
    const [heightAnimations, setHeightAnimations] = useState<{ [key: string]: Animated.Value }>({});
    const [contextMenuVisible, setContextMenuVisible] = useState(false);

    // Initialize animation values for each item
    recordings.forEach((recording: Recording) => {
        if (!animations[recording.id]) {
            animations[recording.id] = new Animated.Value(0);
        }
    });

    const onTranscriptionLayout = (id: string, event: any, type: 'collapsed' | 'expanded') => {
        const height = event.nativeEvent.layout.height;

        if (!transcriptionHeights.current[id]) {
            transcriptionHeights.current[id] = { collapsed: 0, expanded: 0 };
        }

        transcriptionHeights.current[id][type] = height;

        if (!heightAnimations[id]) {
            setHeightAnimations(prev => ({
                ...prev,
                [id]: new Animated.Value(height), // Start at collapsed height
            }));
        }
    };

    const toggleExpand = (id: string) => {
        const isExpanded = expandedItems[id];

        Animated.timing(animations[id], {
            toValue: isExpanded ? 0 : 1,
            duration: 300,
            useNativeDriver: false,
        }).start();

        setExpandedItems(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const pickFile = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({ type: 'audio/*' });
            if (result.canceled) return;
            dispatch(completeUpload(result.assets[0]));
            navigation.navigate('Upload');
        } catch (error) {
            console.error('Error picking file:', error);
        }
    };

    const playPauseAudio = async (audioURI: string, recordingId: string) => {
        try {
            if (!audioURI) return;

            if (sound) {
                await sound.stopAsync();
                setSound(null);
            }

            if (playingRecordingId === recordingId) {
                setPlayingRecordingId(null);
                return;
            }

            const { sound: newSound } = await Audio.Sound.createAsync(
                { uri: audioURI },
                { shouldPlay: true }
            );

            setSound(newSound);
            setPlayingRecordingId(recordingId);

            newSound.setOnPlaybackStatusUpdate((status) => {
                if (status.isLoaded && status.didJustFinish) {
                    setPlayingRecordingId(null);
                    setSound(null);
                }
            });
        } catch (error) {
            console.error("Error playing audio:", error);
        }
    };
    useEffect(() => {
        Object.keys(expandedItems).forEach(id => {
            const finalHeight = expandedItems[id]
                ? transcriptionHeights.current[id]?.expanded || 200
                : transcriptionHeights.current[id]?.collapsed || 60;

            Animated.timing(heightAnimations[id], {
                toValue: finalHeight,
                duration: 300,
                useNativeDriver: false,
            }).start();
        });
    }, [expandedItems]);

    const scaleAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.spring(scaleAnim, {
            toValue: 1,
            friction: 5,
            useNativeDriver: true,
        }).start();
    }, []);

    const filteredRecordings = recordings.filter((recording: Recording) =>
        recording.title.toLowerCase().includes(searchValue.toLowerCase())
    );

    return (
        <View
            onStartShouldSetResponderCapture={() => {
                Keyboard.dismiss();
                // Return false so that the tap event still propagates.
                return false;
            }}
            style={styles.container}>
            <View style={styles.searchContainer}>
                <Ionicons name="search" size={25} color="#888" />
                <TextInput
                    style={styles.searchInput}
                    onChangeText={setSearchValue}
                    value={searchValue}
                    placeholder="Search Recordings"
                    placeholderTextColor="#aaa"
                />
            </View>
            <ScrollView keyboardShouldPersistTaps="handled">
                <View style={styles.recordingListScrollView}>
                    {filteredRecordings.length > 0 ? (
                        filteredRecordings.map((recording: any) => {
                            const isExpanded = expandedItems[recording.id];
                            return (
                                <View key={recording.id} style={styles.recordingItem}>
                                    <View style={styles.recording}>
                                        <View style={styles.recordingDetails}>
                                            <TouchableOpacity style={styles.audioPlayBtn} onPress={() => playPauseAudio(recording.audioFile.uri, recording.id)}>
                                                <FontAwesome6
                                                    name={playingRecordingId === recording.id ? "pause" : "play"}
                                                    size={20}
                                                    color={theme.colors.secondary}
                                                />
                                            </TouchableOpacity>
                                            <CustomText style={styles.recordingTitle}>{recording.title}</CustomText>
                                        </View>
                                        {/* <View>
                                            <ContextMenuView
                                                actions={[{ title: "Rename" }, { title: "Delete", destructive: true }]}
                                                onPress={(event: { nativeEvent: { name: string } }) => console.log(event.nativeEvent.name)}
                                            >
                                                <TouchableOpacity onPress={() => setContextMenuVisible(true)}>
                                                    <MaterialIcons name="more-vert" size={30} color={theme.colors.primary} />
                                                </TouchableOpacity>
                                            </ContextMenuView>
                                        </View> */}
                                    </View>

                                    {/* Animated View for Smooth Slide */}
                                    <Animated.View style={{ height: heightAnimations[recording.id] }}>
                                        <CustomText
                                            numberOfLines={expandedItems[recording.id] ? undefined : MAX_TRANSCRIPTION_LINES}
                                            onLayout={(event) => onTranscriptionLayout(recording.id, event, expandedItems[recording.id] ? 'expanded' : 'collapsed')}
                                            style={styles.transcribedText}>
                                            {recording.transcription}
                                        </CustomText>
                                    </Animated.View>

                                    <TouchableOpacity onPress={() => toggleExpand(recording.id)}>
                                        <CustomText style={styles.showMoreText}>{isExpanded ? "Show less" : "Show more"}</CustomText>
                                    </TouchableOpacity>
                                </View>
                            );
                        })
                    ) : (
                        <>
                            <View style={styles.noDataFoundSection}>
                                <CatSittingInTheHouse width={324} height={324} />
                                <CustomText style={styles.noDataFoundText}>No recordings yet — it’s awfully quiet in here. Upload your first audio and let’s get this transcription party started!</CustomText>
                            </View>
                            <View style={styles.uploadBtnContainer}>
                                <TouchableOpacity style={styles.uploadButton} onPress={pickFile}>
                                    <MaterialIcons name="audio-file" size={30} color={theme.colors.secondary} />
                                    <CustomText style={styles.uploadButtonText}>Upload File</CustomText>
                                </TouchableOpacity>
                            </View>
                        </>
                    )}
                </View>
            </ScrollView>
            <View style={styles.fabContainer}>
                <TouchableOpacity style={styles.fab} onPress={pickFile}>
                    <MaterialIcons name="add" size={30} color="#fff" />
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default Recordings;
