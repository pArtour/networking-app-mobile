import { SafeAreaView } from "react-native";
import React, { useContext } from "react";
import { Button, Image, H3, Paragraph, Stack, XStack, YStack } from "tamagui";
import { MeContext } from "../hooks/useMe";
import { TokenContext } from "../hooks/useToken";
import { Interest } from "../utils/types";
import { API_URL } from "../utils/constants";
import useFetch from "../hooks/useFetch";
import { useNavigation } from "@react-navigation/native";

const ProfileScreen = () => {
    const navigation = useNavigation();
    const { token, setToken } = useContext(TokenContext);
    const { me } = useContext(MeContext);
	const { data: interests, isLoading, error } = useFetch<Interest[]>(`${API_URL}/interests/${me?.id}`, "GET", token);

    const handleLogout = () => {
        setToken(null);
        navigation.navigate("Login");
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <Stack p="$4" space="$4">
                <YStack space="$2">
                    <H3 size="$9">
                        {me?.name}
                    </H3>
                <Stack >
                    <Image borderRadius="$2" source={{ uri: me?.profile_picture, width: 400, height: 300 }}/>
                </Stack>
                </YStack>
                <XStack justifyContent="space-between">
                    <Paragraph fontSize="$6">Email:</Paragraph>
                    <Paragraph fontSize="$6">{me?.email}</Paragraph>
                </XStack>
                <XStack justifyContent="space-between">
                    <Paragraph fontSize="$6">Interests:</Paragraph>
                    <Paragraph fontSize="$6">{interests?.map((interest) => interest.name).join(", ")}</Paragraph>
                </XStack>
                <XStack justifyContent="space-between">
                    <YStack space>
                        <Paragraph fontSize="$6">Bio:</Paragraph>
                        <Paragraph fontSize="$5">{me?.bio}</Paragraph>
                    </YStack>
                </XStack>
                <Stack>
                    <Button color="$gray1" fontSize="$6" bg="$red10" onPress={handleLogout}>
                        Log out
                    </Button>
                </Stack>
            </Stack>
        </SafeAreaView>
    );
};

export default ProfileScreen;
