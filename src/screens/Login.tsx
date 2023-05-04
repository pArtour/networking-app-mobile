import { useNavigation } from "@react-navigation/native";
import React, { useContext, useState } from "react";
import { Button, Input, Paragraph, Stack, YStack } from "tamagui";
import Loader from "../components/Loader";
import useFetchSend from "../hooks/useFetchSend";
import { API_URL, TOKEN_KEY } from "../utils/constants";
import { save } from "../utils/secureStore";
import { TokenContext } from "../hooks/useToken";

const type: "sign-up" | "sign-in" = "sign-in";

const LoginScreen = () => {
    const { setToken } = useContext(TokenContext);
    const navigation = useNavigation();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const {
        isLoading: isloginLoading,
        error: loginError,
        send: login,
    } = useFetchSend<{ token: string }>(`${API_URL}/auth/login`, "POST");

    const handleSignUpPress = () => {
        navigation.navigate("Registration");
    }

    const handleLogin = async () => {
        try {
            const { token } = await login({
                email,
                password,
            });
            console.log(token);

            setToken(token);
            navigation.navigate("Main");
        } catch (error) {
            console.log(error);
        }
    };

    if (isloginLoading) {
        return (
            <Stack>
                <Loader />
            </Stack>
        );
    }

    return (
        <YStack ai="center" jc="center" f={1}>
            <YStack
                borderRadius="$10"
                space
                px="$7"
                py="$6"
                w={350}
                shadowColor={"#00000020"}
                shadowRadius={26}
                shadowOffset={{ width: 0, height: 4 }}
                bg="$background"
            >
                <Paragraph size="$5" fontWeight={"700"} opacity={0.8} mb="$1">
                    Log in to your account
                </Paragraph>
                <Input
                    placeholder="Email"
                    value={email}
                    onChangeText={(text) => {
                        setEmail(text);
                    }}
                />
                <Input
                    value={password}
                    placeholder="Password"
                    onChangeText={(text) => {
                        setPassword(text);
                    }}
                    textContentType="password"
                    secureTextEntry
                />
                <Button
                    themeInverse
                    onPress={() => {
                        handleLogin();
                    }}
                    hoverStyle={{ opacity: 0.8 }}
                    onHoverIn={() => {}}
                    onHoverOut={() => {}}
                    focusStyle={{ scale: 0.975 }}
                >
                    Sign in
                </Button>
                <YStack ai="center">
                    <Paragraph size="$2" mb="$2" opacity={0.4}>
                        Don’t have an account?
                    </Paragraph>
                    <Paragraph
                        onPress={handleSignUpPress}
                        size="$2"
                        fontWeight={"800"}
                        opacity={0.5}
                        hoverStyle={{ opacity: 0.4 }}
                    >
                        Sign up
                    </Paragraph>
                </YStack>
            </YStack>
        </YStack>
    );
};

export default LoginScreen;
