import { WordleData, WordleErrorData, WordleDefaultData } from '@/wordle/types/WordleType';
import { useForm, SubmitHandler, UseFormHandleSubmit, UseFormRegister, FieldErrorsImpl } from "react-hook-form";
import { MuiChipsInput, MuiChipsInputChip } from 'mui-chips-input';

export type WordlePrimaryManageProps = {
    handleSubmit: UseFormHandleSubmit<WordleData>
    onSubmit: SubmitHandler<WordleData>
    wordle_default_data: WordleDefaultData | undefined
    register: UseFormRegister<WordleData>
    errors: FieldErrorsImpl<{
        id: number;
        name: string;
        words: string[];
        input: string[];
        description: string;
        tags: string[];
        submit: string;
    }>
    tags: string[]
    handleSelecetedTags: (selectedItem: MuiChipsInputChip[]) => void
    input_values: string[]
    input: {
        [key: string]: boolean;
    }
    handleInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void
    words: string[]
    handleDeleteWord: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
    handleChangeWord: (event: React.ChangeEvent<HTMLInputElement>) => void
    handleAddWord: () => void
    loading: boolean;
    wordle_id: string;
}