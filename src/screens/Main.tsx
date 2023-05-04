import React, { useContext, useState } from "react";
import { SafeAreaView, useColorScheme, ScrollView } from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { Paragraph, YStack, Button, Stack, Card, H2, H1, XStack } from "tamagui";
import useFetch from "../hooks/useFetch";
import { API_URL, TOKEN_KEY } from "../utils/constants";
import Loader from "../components/Loader";
import { Interest, User, UserWithInterests} from "../utils/types";
import { TokenContext } from "../hooks/useToken";
import useFetchSend from "../hooks/useFetchSend";
import UserCard from "../components/UserCard";

const MainScreen = () => {
    const { token } = useContext(TokenContext);
    const { data: users, error, isLoading } = useFetch<UserWithInterests[]>(`${API_URL}/users`, "GET", token);

    if (isLoading) {
        return (
            <Stack>
                <Loader />
            </Stack>
        );
    }

    

    return (
        <SafeAreaView>
            <Stack px="$3">
                {error ? (
                    <H1 color="$red8" size="$9" mb="$4">
                        Error: {error.message}
                    </H1>
                ) : (
                    <ScrollView>
                        <H1 color="$blue8" size="$9" mb="$4">
                            Connect with others
                        </H1>
                        {users?.map((user) => (
                            <UserCard key={user.id} user={user}/>
                        ))}
                    </ScrollView>
                )}
            </Stack>
        </SafeAreaView>
    );
};

export default MainScreen;
