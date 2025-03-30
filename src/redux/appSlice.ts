import { createSlice } from '@reduxjs/toolkit';
import * as DocumentPicker from 'expo-document-picker';

// Initial state
const initialState: {
    recordings: Recording[];
    uploads: {
        uploadedFile: DocumentPicker.DocumentPickerAsset | null;
        isUploading: boolean;
    };
} = {
    recordings: [],
    uploads: {
        uploadedFile: null,
        isUploading: false,
    },
};

// Slice
const appSlice = createSlice({
    name: 'app',
    initialState,
    reducers: {
        // Recordings Reducers
        deleteRecording: (state, action) => {
            state.recordings = state.recordings.filter((rec) => rec.id !== action.payload);
        },
        addRecording: (state, action) => {
            state.recordings.push(action.payload);
        },

        // Upload Reducers
        startUpload: (state) => {
            state.uploads.isUploading = true;
        },
        completeUpload: (state, action) => {
            state.uploads.uploadedFile = action.payload;
            state.uploads.isUploading = false;
        },
        resetUploads: (state) => {
            state.uploads.uploadedFile = null;
        },
    },
});

export const {
    deleteRecording,
    startUpload,
    completeUpload,
    resetUploads,
    addRecording
} = appSlice.actions;

export default appSlice.reducer;
