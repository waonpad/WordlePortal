import * as Yup from 'yup';
import React, {useContext, createContext, useState, ReactNode, useEffect } from "react"

declare module "yup" {
    interface ArraySchema<T> {
        unique(
            message: string,
            mapper?: (value: T, index?: number, list?: T[]) => T[]
        ): ArraySchema<T>;
    }
}

type Props = {
    children: ReactNode
}

function YupCustom({children}: Props): React.ReactElement {
    // ユニークバリデーション
    Yup.addMethod(Yup.array, "unique", function (
        message,
        mapper = (val: unknown) => val
    ) {
        return this.test(
            "unique",
            message,
            (list = []) => list.length === new Set(list.map(mapper)).size
        );
    });
    // .unique("must be unique", (val: any) => val)

    return (
        <React.Fragment>
            {children}
        </React.Fragment>
    )
}

export default YupCustom;