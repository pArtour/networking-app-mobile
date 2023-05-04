import { KeyboardAvoidingView, Platform, SafeAreaView } from "react-native";
import React, { useContext, useEffect, useRef, useState } from "react";
import { ScrollView } from "react-native";
import { Button, Circle, H3, H4, Input, Paragraph, Separator, Stack, XStack, YStack } from "tamagui";
import { useNavigation } from "@react-navigation/native";
import useFetch from "../hooks/useFetch";
import { API_URL } from "../utils/constants";
import { TokenContext } from "../hooks/useToken";
import Loader from "../components/Loader";
import { Message, User } from "../utils/types";
import { MeContext } from "../hooks/useMe";
import Avatar from "../components/Avatar";

const ChatScreen = ({route, navigation}) => {

	if (!route.params) {
		return (
            <SafeAreaView>
                <YStack p="$2">
                    <H3 color="$blue8" size="$9" mb="$4">
                        No chat selected
                    </H3>
                    <Button themeInverse onPress={() => navigation.navigate("Connections")}>
                        Connections
                    </Button>
                </YStack>
            </SafeAreaView>
        );

	}
	const { id, userId } = route.params;
    
	const { token } = useContext(TokenContext);
	const { me } = useContext(MeContext);
	const {data: messages, isLoading, error} = useFetch<Message[]>(`${API_URL}/messages/${id}`, "GET", token);
	const {
        data: user,
        isLoading: isUserLoading,
        error: userError,
    } = useFetch<User>(`${API_URL}/users/${userId}`, "GET", token);
	const ws = useRef(new WebSocket("wss://fiber-development-3942.up.railway.app/api/v1/chat/" + id)).current;
	const [message, setMessage] = useState("");
    
	const [chatMessages, setChatMessages] = useState<Message[]>([]);
    
	useEffect(() => {
        if (messages) {
            setChatMessages(messages);
		}
	}, [messages]);
    console.log(id, userId, me);
    
    // connection opening
    useEffect(() => {
        ws.onopen = () => {
            console.log("Connected to the server");
        };
        ws.onclose = (e) => {
            console.log("Disconnected. Check internet or server.");
        };
        ws.onerror = (e: any) => {
			console.error(e.message);
			
        };
        ws.onmessage = (e) => {
			console.log("MESSAGE", JSON.parse(e.data));
			
			setChatMessages(prev => [...prev, JSON.parse(e.data)]);
        };
    }, []);


    // sending a message
    const sendMessage = () => {
        if (ws.readyState === WebSocket.OPEN) {
			const messageObject = {
                sender_id: me?.id,
                receiver_id: userId,
                message: message,
                connection_id: id,
                jwt: token,
            };
            ws.send(JSON.stringify(messageObject));
			setMessage("");
        } else {
            console.log("WebSocket is not open. Ready state: ", ws.readyState);
        }
    };

	console.log({me});
	
	
	

    return (
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
            <SafeAreaView style={{ flex: 1, position: "relative" }}>
                {!route.params ? (
                    <YStack space>
                        <H3 color="$blue8" size="$9" mb="$4">
                            No chat selected
                        </H3>
                        <Button onPress={() => navigation.navigate("Connections")}>Go back</Button>
                    </YStack>
                ) : null}
                <YStack f={1} position="relative" px="$3">
                    {!isUserLoading && (
                            <XStack>
                                <Stack mr="$4">
                                    <Avatar uri={user?.profile_picture} />
                                </Stack>
                                <H3 maxWidth={"$19"} color="$blue8" size="$9" mb="$4">
                                    {user?.name}
                                </H3>
                            </XStack>
                    )}
                    <ScrollView>
                        {chatMessages?.map((message) => (
                            <Stack key={message.id} f={1} px="$3" py="$2" mb="$2" borderRadius="$2" bg="$blue2Light">
                                <Paragraph ta={message.sender_id === me?.id ? "right" : "left"} f={1}>
                                    {message.message}
                                </Paragraph>
                            </Stack>
                        ))}
                    </ScrollView>
                </YStack>
                <YStack position="absolute" p="$2" left={0} right={0} bottom="$10">
                    <Input value={message} onChangeText={setMessage} mb="$4" placeholder="Type a message..." />
                    <Button themeInverse onPress={sendMessage}>
                        Send
                    </Button>
                </YStack>
            </SafeAreaView>
        </KeyboardAvoidingView>
    );
};

export default ChatScreen;