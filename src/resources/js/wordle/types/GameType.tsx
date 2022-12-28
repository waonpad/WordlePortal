export type GameListProps = {
    game_get_api_method: string;
    request_params: object;
    response_keys: string[];
    listen: boolean;
    listening_channel?: string;
    listening_event?: string;
}

export type GameListItemProps = {
    game: any;
    handleDeleteGame: any;
    handleVSPlayOptionOpen: any;
}