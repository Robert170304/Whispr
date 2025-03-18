import React from "react";
import { Text, TextProps, StyleSheet } from "react-native";
import theme from "../../ theme";

interface CustomTextProps extends TextProps {
    children: React.ReactNode;
}

const CustomText = ({ style, children, ...props }: CustomTextProps) => {
    return (
        <Text style={[styles.text, style]} {...props}>
            {children}
        </Text>
    );
};

const styles = StyleSheet.create({
    text: {
        fontFamily: theme.fonts.regular, // Global font
    },
});

export default CustomText;
