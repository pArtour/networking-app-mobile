import { View, Text, SafeAreaView, ScrollView } from "react-native";
import React, { useContext } from "react";
import { H1, Stack, XStack } from "tamagui";
import ConnectionCard from "../components/ConnectionCard";
import { useNavigation } from "@react-navigation/native";
import { TokenContext } from "../hooks/useToken";
import useFetch from "../hooks/useFetch";
import { API_URL } from "../utils/constants";
import { UserConnection } from "../utils/types";
import Loader from "../components/Loader";


const ConnectionsScreen = () => {
    const { token } = useContext(TokenContext);
    const {data: connections, isLoading, error} = useFetch<UserConnection[]>(`${API_URL}/connections`, "GET", token);

    return (
        <SafeAreaView>
            <Stack px="$3">
                <ScrollView>
                    <H1 color="$blue8" size="$9" mb="$4">
                        My connections
                    </H1>
                    {isLoading && <XStack jc="center" p="$4" ai="center"><Loader/></XStack>}
                    {connections?.map((connection) => (
                        <ConnectionCard key={connection.id} connection={connection} />
                    ))}
                </ScrollView>
            </Stack>
        </SafeAreaView>
    );
};

export default ConnectionsScreen;