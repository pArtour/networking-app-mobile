import { useState, useEffect } from "react";
import { RequestError } from "../utils/types";

export default function useFetch<T>(
    url: string,
    method: "GET" | "POST" = "GET",
    token?: string
): { data: T | null; error: RequestError | null; isLoading: boolean } {
    const [data, setData] = useState<T | null>(null);
    const [error, setError] = useState<RequestError | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const controller = new AbortController();
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const response = await fetch(url, {
                    signal: controller.signal,
                    ...{
                        method,
                        headers: {
                            "Content-Type": "application/json",
                            ...(token ? { Authorization: `Bearer ${token}` } : {}),
                        },
                    },
                });
                if (!response.ok) {
                    const json = await response.json();
                    throw json;
                }
                const json = await response.json();

                setData(json);
            } catch (error) {
                setError(error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();

        return () => {
            controller.abort();
        };
    }, [url, method, token]);

    return { data, error, isLoading };
}
