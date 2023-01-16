export type UserPrimaryDetailProps = {
    user: any;
    setUser: React.Dispatch<any>;
    expanded: boolean;
    setExpanded: React.Dispatch<React.SetStateAction<boolean>>;
}

export type EditProfileProps = {
    user: any;
    handleModalClose: React.Dispatch<React.SetStateAction<boolean>>
}

export type UserListProps = {
    head?: React.ReactElement;
    request_config: {
        api_url: string;
        params: object;
        response_keys: string[];
        listening_channel?: string;
        listening_event?: string;
    };
    listen?: boolean;
    no_item_text: string;
}

export type UserListItemProps = {
    user: any;
    followToggle: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}