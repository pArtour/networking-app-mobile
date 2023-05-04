import React from 'react'
import { Stack, Image } from 'tamagui';

interface AvatarProps {
	uri: string;
	width?: number;
	height?: number;
}
const Avatar = ({uri, width = 50, height = 50}: AvatarProps) => {
    return (
        <Stack overflow="hidden" borderRadius="$2">
            <Image borderRadius="$10" source={{ uri, width, height }} />
        </Stack>
    );
};

export default Avatar