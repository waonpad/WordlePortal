import React from 'react';

export type WordleData = {
    id: number | null;
    name: string;
    words: string[];
    input: string[];
    description: string;
    tags: string[];
    submit: string;
}

export type WordleErrorData = {
    id: string;
    name: string;
    words: string;
    input: string;
    description: string;
    tags: string;
    submit: string;
}

export type WordleDefaultData = {
    id: number | null;
    name: string;
    words: string[];
    input: string[];
    description: string;
    tags: any[];
}

export type WordleBoardProps = {
    game_words: any;
    classes: any;
}

export type WordleInputProps = {
    classes: any;
    turn_flag: boolean;
    handleInputStack: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
    errata: any;
    input_stack: any[];
    handleTypingStack: (event: React.ChangeEvent<HTMLInputElement>) => void;
    display_input_component: 'japanese' | 'english' | 'number' | 'typing' | null;
}

export type WordleCharactersProps = {
    classes: any;
    turn_flag: boolean;
    handleInputStack: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
    errata: any;
}

export type WordleTypingProps = {
    classes: any;
    turn_flag: boolean;
    input_stack: any[];
    handleTypingStack: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export type GameWords = {
    [index: number]: {
        character: string;
        errata: string;
    };
}

export type ErrataList = {
    matchs: any[];
    exists: any[];
    not_exists: any[];
}

export type DisplayInputComponent = 'japanese' | 'english' | 'number' | 'typing' | null;

export type WordleGameProps = {
    classes: any;
    game_status: any;
    game_words: any;
    turn_flag: boolean;
    handleInputStack: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
    input_stack: any[];
    handleTypingStack: (event: React.ChangeEvent<HTMLInputElement>) => void;
    handleDisplayInputComponentSelect: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
    handleInputBackSpace: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
    handleInputEnter: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
    loading: boolean;
    errata_list: ErrataList;
    display_input_component: 'japanese' | 'english' | 'number' | 'typing' | null;
}

export type WordleLobbyProps = {
    classes: any;
    game_status: any;
    firebase_game_data: any;
    handleGameStart: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

export type WordleListProps = {
    request_config: {
        api_url: string;
        params: object;
        response_keys: string[];
        listening_channel?: string;
        listening_event?: string;
    };
    listen: boolean;
}

export type WordleListItemProps = {
    wordle: any;
    handleLikeToggle: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
    handleDeleteWordle: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
    handleSinglePlayStart: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
    handleVSPlayOptionOpen: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

export type WordleInputSelectButtonGroupProps = {
    input: string[];
    handleDisplayInputComponentSelect: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}