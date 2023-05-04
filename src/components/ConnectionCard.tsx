import { useNavigation } from '@react-navigation/native';
import React, { useContext } from 'react';
import { TouchableOpacity } from 'react-native';
import { Card, H3, XStack } from 'tamagui';
import useFetch from '../hooks/useFetch';
import { TokenContext } from '../hooks/useToken';
import { API_URL } from '../utils/constants';
import { User } from '../utils/types';
import Avatar from './Avatar';
import Loader from './Loader';

interface Connecton {
	id: number;
	user_id_1: number;
	user_id_2: number;
}

interface ConnectionCardProps {
	connection: Connecton;
}

const ConnectionCard = ({connection}: ConnectionCardProps) => {
	const navigation = useNavigation();
    const { token } = useContext(TokenContext);
    const { data: user, isLoading, error } = useFetch<User>(`${API_URL}/users/${connection.user_id_2}`, "GET", token);

	const handleConnectionPress = () => {
		navigation.navigate("Chat", { id: connection.id, userId: connection.user_id_2 });
	};


	
  return (
      <TouchableOpacity onPress={handleConnectionPress} style={{ marginBottom: 10 }}>
          <Card size="$4" p="$4" bordered>
              {isLoading ? (
                  <XStack jc='center' ai="center">
                      <Loader />
                  </XStack>
              ) : (
                  <XStack ai="center" space>
                    <Avatar uri={user?.profile_picture}/>
                      <H3>
                          {user?.name}
                      </H3>
                  </XStack>
              )}
          </Card>
      </TouchableOpacity>
  );
}

export default ConnectionCard