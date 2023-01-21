export type RequestConfig = {
    api_url: string;
    params: object;
    response_keys: string[];
    listening_channel?: string;
    listening_event?: string;
}