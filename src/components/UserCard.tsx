import React, { useContext } from 'react'
import { Interest, User, UserConnection, UserWithInterests } from '../utils/types';
import { Card, H2, YStack, Paragraph, XStack, Stack, Button, Circle, Image } from "tamagui";
import useFetch from '../hooks/useFetch';
import { API_URL } from '../utils/constants';
import { TokenContext } from '../hooks/useToken';
import Loader from './Loader';
import useFetchSend from '../hooks/useFetchSend';
import { useNavigation } from '@react-navigation/native';

interface UserCardProps {
	user: UserWithInterests
}

const UserCard = ({user}: UserCardProps) => {
	const navigation = useNavigation();
	const {token} = useContext(TokenContext);

	const { send: createConnection } = useFetchSend<UserConnection>(`${API_URL}/connections`, "POST", token);

    const handleConnect = async (id: number) => {
        const connection = await createConnection({ connect_with_user: id });
		console.log(connection);
		
        navigation.navigate("Chat", { connection: connection.id, userId: connection.user_id_2 });
    };
	
  return (
      <Card key={user.id} elevate size="$4" mb="$5" bordered>
          <Card.Header padded>
              <YStack>
                  <Stack mb="$2" overflow="hidden" borderRadius="$2">
                      <Image
                          borderRadius="$2"
                          source={{ uri: user.profile_picture, width: 400, height: 200 }}
                      />
                  </Stack>
                  <H2>{user.name}</H2>
              </YStack>
          </Card.Header>
          <YStack px="$4">
              <Paragraph mb="$2" mt={2}>
                  Interests:
              </Paragraph>
              <XStack space="$2" mb="$4">
                  {user.interests?.map((interest) => (
                      <Stack
                          key={interest.id + "-" + user.id}
                          borderColor="$blue8"
                          backgroundColor="$blue5"
                          borderWidth="$1"
                          borderRadius="$4"
                          px="$3"
                          py="$1"
                      >
                          <Paragraph size="$3" fontWeight="bold">
                              {interest.name}
                          </Paragraph>
                      </Stack>
                  ))}
              </XStack>
              <Paragraph>About me: {user.bio}</Paragraph>
          </YStack>
          <Card.Footer>
              <Button onPress={() => handleConnect(user.id)} f={1} fontSize="$5" themeInverse borderRadius="$4">
                  Connect
              </Button>
          </Card.Footer>
      </Card>
  );
}

export default UserCard