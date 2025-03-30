declare module "*.svg" {
    import React from "react";
    import { SvgProps } from "react-native-svg";
    const content: React.FC<SvgProps>;
    export default content;
}

interface Recording {
    id: string, // Unique ID
    title: string,
    transcription: string,
    audioFile: { uri: string, name: string }
}
