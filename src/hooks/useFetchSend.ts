import { useState, useCallback } from "react";

export default function useFetchSend<T, B = unknown>(
    url: string,
    method: "POST" | "PUT" | "DELETE" = "POST",
    token?: string
) {
    const [error, setError] = useState<Error | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const send = useCallback(
        async (body: B) => {
            setIsLoading(true);
            try {
                const response = await fetch(url, {
                    method,
                    body: JSON.stringify(body),
                    headers: {
                        "Content-Type": "application/json",
                        ...(token ? { Authorization: `Bearer ${token}` } : {}),
                    },
                });
                const json = await response.json();
                console.log({ jsonSend: json });
                return json as T;
            } catch (error) {
                setError(error);
                console.log({ error });
            } finally {
                setIsLoading(false);
            }
        },
        [url, method, token]
    );

    return { error, isLoading, send };
}
