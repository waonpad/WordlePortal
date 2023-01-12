export type UserPrimaryDetailProps = {
    user: any;
    myself: boolean;
    follow: boolean;
    setFollow: React.Dispatch<React.SetStateAction<boolean>>;
    expanded: boolean;
    setExpanded: React.Dispatch<React.SetStateAction<boolean>>;
}

export type EditProfileProps = {
    user: any;
    handleModalClose: React.Dispatch<React.SetStateAction<boolean>>
}