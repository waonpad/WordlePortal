import React, { useState, useEffect, MouseEventHandler } from 'react';

// idはhiddenで送る？
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
    handleInputStack: MouseEventHandler;
    errata: any;
    input_stack: any;
    handleTypingStack: any
    display_input_component: 'japanese' | 'english' | 'number' | 'typing' | null
}

export type WordleCharactersProps = {
    classes: any;
    turn_flag: boolean;
    handleInputStack: MouseEventHandler;
    errata: any;
}

export type WordleTypingProps = {
    classes: any;
    turn_flag: boolean;
    input_stack: any;
    handleTypingStack: any;
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
    game_words: GameWords
    turn_flag: boolean;
    handleInputStack: any;
    input_stack: any;
    handleTypingStack: any;
    handleDisplayInputComponentSelect: any;
    handleInputBackSpace: any;
    handleInputEnter: any;
    loading: boolean;
    errata_list: ErrataList;
    display_input_component: 'japanese' | 'english' | 'number' | 'typing' | null;
}

export type WordleLobbyProps = {
    classes: any;
    game_status: any;
    firebase_game_data: any;
    handleGameStart: any;
}

export type WordleListProps = {
    wordle_get_api_method: string;
    request_params: object;
    response_keys: string[];
    listen: boolean;
    listening_channel?: string;
    listening_event?: string;
}

export type WordleListItemProps = {
    wordle: any;
    handleLikeToggle: any;
    handleDeleteWordle: any;
    handleSinglePlayStart: any;
    // singleplay_loading: boolean;
    handleVSPlayOptionOpen: any;
}