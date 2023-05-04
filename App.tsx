import "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import LoginScreen from "./src/screens/Login";
import MainScreen from "./src/screens/Main";

import { createDrawerNavigator } from "@react-navigation/drawer";

import { useFonts } from "expo-font";
import { useColorScheme } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { TamaguiProvider, Theme } from "tamagui";
import ChatScreen from "./src/screens/Chat";
import ConnectionsScreen from "./src/screens/Connections";
import RegistrationScreen from "./src/screens/Registration";
import initConfig from "./tamagui.config";
import { createContext, useContext, useEffect, useState } from "react";
import { get, save } from "./src/utils/secureStore";
import { API_URL, TOKEN_KEY } from "./src/utils/constants";
import { TokenContext } from "./src/hooks/useToken";
import * as SecureStore from "expo-secure-store";
import useFetch from "./src/hooks/useFetch";
import { MeContext } from "./src/hooks/useMe";
import ProfileScreen from "./src/screens/Profile";
const Drawer = createDrawerNavigator();

const config = initConfig();

export default function App() {
    const colorScheme = useColorScheme();
    const [token, setToken] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [tokenLoading, setTokenLoading] = useState(true);
    const [loaded] = useFonts({
        Inter: require("@tamagui/font-inter/otf/Inter-Medium.otf"),
        InterBold: require("@tamagui/font-inter/otf/Inter-Bold.otf"),
    });

    const addToken = (token: string) => {
        setToken(token);
        save(TOKEN_KEY, token);
    };

    useEffect(() => {
        (async () => {
            setTokenLoading(true);
            const token = await get(TOKEN_KEY);
            // const token = SecureStore.getItemAsync(TOKEN_KEY);
            console.log("token", token);

            setToken(token);
            setTokenLoading(false);
        })();
    }, []);

    const { data: me } = useFetch(`${API_URL}/users/me`, "GET", token);

    if (!loaded) {
        return null;
    }

    if (tokenLoading) {
        return null;
    }


    console.log({me});
    
    return (
        <TokenContext.Provider value={{ token, setToken: addToken }}>
            <MeContext.Provider value={{ me }}>
                <SafeAreaProvider>
                    <TamaguiProvider disableInjectCSS defaultTheme="light" config={config}>
                        <Theme name={colorScheme === "dark" ? "dark" : "light"}>
                            <NavigationContainer>
                                <Drawer.Navigator>
                                    {!token || tokenLoading ? (
                                        <Drawer.Group>
                                            <Drawer.Screen
                                                options={{
                                                    headerShown: false,
                                                    unmountOnBlur: true,
                                                    
                                                }}
                                                name="Login"
                                                component={LoginScreen}
                                            />
                                            <Drawer.Screen
                                                options={{
                                                    headerShown: false,
                                                    unmountOnBlur: true,
                                                    
                                                }}
                                                name="Registration"
                                                component={RegistrationScreen}
                                            />
                                        </Drawer.Group>
                                    ) : (
                                        <Drawer.Group>
                                            <Drawer.Screen
                                                options={{
                                                    headerShown: false,
                                                    unmountOnBlur: true,
                                                }}
                                                name="Main"
                                                component={MainScreen}
                                            />
                                            <Drawer.Screen
                                                options={{
                                                    headerShown: false,
                                                    unmountOnBlur: true,
                                                }}
                                                name="Connections"
                                                component={ConnectionsScreen}
                                            />
                                            <Drawer.Screen
                                                options={{
                                                    headerShown: false,
                                                    unmountOnBlur: true,
                                                }}
                                                name="Profile"
                                                component={ProfileScreen}
                                            />
                                            <Drawer.Screen
                                                options={{
                                                    headerShown: false,
                                                    unmountOnBlur: true,
                                                }}
                                                name="Chat"
                                                component={ChatScreen}
                                            />
                                        </Drawer.Group>
                                    )}
                                </Drawer.Navigator>
                            </NavigationContainer>
                        </Theme>
                    </TamaguiProvider>
                </SafeAreaProvider>
            </MeContext.Provider>
        </TokenContext.Provider>
    );
}
