export type UserPrimaryDetailProps = {
    user: any;
    myself: boolean;
    follow: boolean;
    setFollow: React.Dispatch<React.SetStateAction<boolean>>;
    expanded: boolean;
    setExpanded: React.Dispatch<React.SetStateAction<boolean>>;
}

export type EditProfileData = {
    icon: string | null;
    name: string;
    description: string;
    age: number;
    gender: 'male' | 'female';
    submit: string;
}

export type EditProfileErrorData = {
    icon: string;
    name: string;
    description: string;
    age: string;
    gender: string;
    submit: string;
}