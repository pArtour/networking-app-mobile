import { useNavigation } from "@react-navigation/native";
import React, { useContext, useState } from "react";
import Svg, { Polyline } from "react-native-svg";
import { Button, Checkbox, Input, Label, Paragraph, Stack, TextArea, XStack, YStack } from "tamagui";
import Loader from "../components/Loader";
import useFetch from "../hooks/useFetch";
import useFetchSend from "../hooks/useFetchSend";

import { API_URL, TOKEN_KEY } from "../utils/constants";
import { Interest } from "../utils/types";
import { TokenContext } from "../hooks/useToken";

const RegistrationScreen = () => {
    const navigation = useNavigation();
    const { setToken } = useContext(TokenContext);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [selectedInterests, setSelectedInterests] = useState(new Set());
    const [name, setName] = useState("");
    const [bio, setBio] = useState("");

    const {
        data: interests,
        isLoading: isInterestsLoading,
        error: interestsError,
    } = useFetch<Interest[]>(`${API_URL}/interests`);
    const {
        isLoading: isRegisterLoading,
        error: registerError,
        send: register,
    } = useFetchSend<{ token: string }>(`${API_URL}/auth/register`, {
        method: "POST",
    });

    const handleCheckboxPress = (id: number) => {
        if (selectedInterests.has(id)) {
            selectedInterests.delete(id);
        } else {
            selectedInterests.add(id);
        }
        setSelectedInterests(new Set(selectedInterests));
    };

    const type = "sign-up";

    const handleSugnup = async () => {
        try {
            const {token} = await register({
                name,
                email,
                password,
                bio,
                profile_picture: "some_picture",
                interests: Array.from(selectedInterests).map((id) => ({ id })),
            });
            setToken(TOKEN_KEY, token);
            
            navigation.navigate("Main");
        } catch (error) {
            console.log(error);
        }
    };

    const handleSignInPress = () => {
        navigation.navigate("Login");
    };

    if (isRegisterLoading) {
        return (
            <Stack>
                <Loader />
            </Stack>
        );
    }


    if (isInterestsLoading) {
        return (
            <Stack>
                <Loader />
            </Stack>
        );
    }

    if (interestsError) {
        return (
            <Stack>
                <Paragraph>{JSON.stringify(interestsError)}</Paragraph>
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
                <Paragraph size="$5" fontWeight={"800"} opacity={0.8} mb="$1">
                    {"Create your account"}
                </Paragraph>
                <Input
                    value={name}
                    placeholder="Name"
                    onChangeText={(text) => {
                        setName(text);
                    }}
                />

                {/* email sign up option */}
                <Input
                    placeholder="Email"
                    value={email}
                    onChangeText={(text) => {
                        setEmail(text);
                    }}
                    keyboardType="email-address"
                    autoCapitalize="none"
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

                <YStack space>
                    <Paragraph size="$5" fontWeight={"800"} opacity={0.8} mb="$1">
                        {"Select your interests"}
                    </Paragraph>
                    <XStack fw="wrap" ai="center" space>
                        {interests?.map((interest) => (
                            <XStack key={interest.id} alignItems="center" space="$4">
                                <Checkbox
                                    id={interest.id + ""}
                                    size="$3"
                                    checked={selectedInterests.has(interest.id)}
                                    onCheckedChange={() => handleCheckboxPress(interest.id)}
                                >
                                    <Checkbox.Indicator>
                                        <Svg
                                            width={12}
                                            height={12}
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke={`black`}
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        >
                                            <Polyline
                                                points="20 6 9 17 4 12"
                                                fill="none"
                                                stroke={`black`}
                                                strokeWidth="4"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                        </Svg>
                                    </Checkbox.Indicator>
                                </Checkbox>

                                <Label size="$3" htmlFor={interest.id + ""}>
                                    {interest.name}
                                </Label>
                            </XStack>
                        ))}
                    </XStack>
                </YStack>

                <YStack space>
                    <Paragraph size="$5" fontWeight={"800"} opacity={0.8} mb="$1">
                        {"Write about yourself"}
                    </Paragraph>
                    <TextArea
                        value={bio}
                        onChangeText={(text) => {
                            setBio(text);
                        }}
                        placeholder="Bio"
                        size="$4"
                        numberOfLines={4}
                    />
                </YStack>

                {/* sign up button */}
                <Button
                    themeInverse
                    onPress={() => {
                        handleSugnup();
                    }}
                    hoverStyle={{ opacity: 0.8 }}
                    onHoverIn={() => {}}
                    onHoverOut={() => {}}
                    focusStyle={{ scale: 0.975 }}
                >
                    {type === "sign-up" ? "Sign up" : "Sign in"}
                </Button>

                {/* or sign in, in small and less opaque font */}
                <YStack ai="center">
                    <Paragraph size="$2" mb="$2" opacity={0.4}>
                        {type === "sign-up" ? "Already have an account?" : "Don’t have an account?"}
                    </Paragraph>
                    <Paragraph
                        onPress={handleSignInPress}
                        size="$2"
                        fontWeight={"800"}
                        opacity={0.5}
                        hoverStyle={{ opacity: 0.4 }}
                    >
                        {type === "sign-up" ? "Sign in" : "Sign up"}
                    </Paragraph>
                </YStack>
            </YStack>
        </YStack>
    );
};

export default RegistrationScreen;
