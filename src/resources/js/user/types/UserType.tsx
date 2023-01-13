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