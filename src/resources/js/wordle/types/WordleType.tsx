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

export type WordleCharactersProps = {
    classes: any,
    turn_flag: boolean,
    handleInputStack: MouseEventHandler,
    errata: any
}