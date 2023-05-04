export interface User {
	id: number;
	email: string;
	name: string;
	bio: string;
	profile_picture: string;
}

export interface Interest {
	id: number;
	name: string;
}

export interface UserWithInterests extends User {
	interests: Interest[];
}

export interface RequestError {
	message: string;
	code: number;
}

export interface UserConnection {
	id: number;
	user_id_1: number;
	user_id_2: number;
}

export interface Message {
	id: number;
	sender_id: number;
	receiver_id: number;
	connection_id: number;
	message: string;
}