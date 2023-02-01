export type GameListProps = {
    game_status: ('wait' | 'start' | 'end')[];
    request_config: {
        api_url: string;
        params: object;
        response_keys: string[];
        listening_channel?: string;
        listening_event?: string;
    };
    listen: boolean;
}

export type GameListItemProps = {
    game: any;
    handleDeleteGame: any;
    handleVSPlayOptionOpen: any;
}

export type WordleGameUserListProps = {
    users: any;
    firebase_game_data: any;
}

export type WordleGameUserListItemProps = {
    user: any;
    firebase_game_data: any;
}