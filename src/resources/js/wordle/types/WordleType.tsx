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
    game_words: any
    classes: any
}

export type WordleInputProps = {
    classes: any,
    turn_flag: boolean,
    handleInputStack: MouseEventHandler,
    errata: any,
    display_input_component: 'japanese' | 'english' | 'number' | 'typing' | null
}

export type WordleCharactersProps = {
    classes: any,
    turn_flag: boolean,
    handleInputStack: MouseEventHandler,
    errata: any
}


export type GameWords = {
    [index: number]: {
        character: string
        errata: string
    }
}

export type ErrataList = {
    matchs: any[],
    exists: any[],
    not_exists: any[]
}

export type DisplayInputComponent = 'japanese' | 'english' | 'number' | 'typing' | null;