import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import Recordings from '../screens/Recordings/Recordings';
import UploadScreen from '../screens/UploadScreen/UploadScreen';
import theme from '../../ theme';
import { StatusBar } from 'react-native';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
    return (
        <>
            <StatusBar barStyle="dark-content" backgroundColor={theme.colors.lightYellowShade} />
            <NavigationContainer>
                <Stack.Navigator screenOptions={{
                    headerTintColor: theme.colors.primary,
                    headerTitleStyle: {
                        fontWeight: 400,
                    },
                    headerTitleAlign: 'center',
                    headerShadowVisible: false,
                    headerStyle: {
                        backgroundColor: theme.colors.lightYellowShade,
                    },
                }}>
                    <Stack.Screen name="Recordings" component={Recordings} />
                    <Stack.Screen name="Upload" component={UploadScreen} />
                </Stack.Navigator>
            </NavigationContainer>
        </>
    );
};

export default AppNavigator;
