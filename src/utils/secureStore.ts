import * as SecureStore from 'expo-secure-store';

export async function save(key: string, value: string) {
	try {
		await SecureStore.setItemAsync(key, value);
	} catch (error) {
		console.error(error);
	}
}

export async function get(key: string) {
	try {
		return await SecureStore.getItemAsync(key);
	} catch (error) {
		console.error(error);
	}
}