import React, { useState, useEffect } from 'react';
import { IconButton, TextField, Button, FormLabel, FormControl, FormGroup, FormControlLabel, FormHelperText, Checkbox, Grid, Box, Typography, Container } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { MuiChipsInput } from 'mui-chips-input';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { WordlePrimaryManageProps } from '../types/WordleManageType';

function WordlePrimaryManage(props: WordlePrimaryManageProps): React.ReactElement {
    const {
        handleSubmit,
        onSubmit,
        wordle_default_data,
        register,
        errors,
        tags,
        handleSelecetedTags,
        input_values,
        input,
        handleInputChange,
        words,
        handleDeleteWord,
        handleChangeWord,
        handleAddWord,
        loading,
        wordle_id,
    } = props;

    return (
        <Box component="form" noValidate onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <TextField
                        required
                        fullWidth
                        id="wordle_name"
                        label="Wordle Name"
                        autoComplete="wordle-name"
                        defaultValue={wordle_default_data?.name}
                        {...register('name')}
                        error={errors.name ? true : false}
                        helperText={errors.name?.message}
                    />
                </Grid>
                <Grid item xs={12}>
                    <MuiChipsInput
                        value={(tags as string[])}
                        onChange={handleSelecetedTags}
                        fullWidth
                        variant='outlined'
                        id='tags'
                        // name='tags'
                        label='Tags'
                        placeholder=''
                        aria-multiline
                        maxRows={10}
                        validate={(chipValue) => {
                            return {
                                isError: chipValue.length > 50,
                                textError: 'the value must be at least 50 characters long'
                            }
                        }}
                    />
                    <FormHelperText sx={{mt: 1, ml: 2}}>Double click to edit a tag</FormHelperText>
                </Grid>
                <FormControl sx={{ m: 3 }} component="fieldset" variant="standard">
                    <FormLabel component="legend">Using Language Set</FormLabel>
                    <FormGroup>
                        {input_values.map((input_value, index) => 
                            <FormControlLabel
                                key={index}
                                control={
                                <Checkbox value={input_value} checked={input[input_value]} {...register('input')} onChange={handleInputChange} id={input_value} />
                                }
                                label={input_value}
                            />
                        )}
                    </FormGroup>
                    <FormHelperText sx={{color: '#d74343', mt: 1, ml: 2}}>{errors.input?.message}</FormHelperText>
                </FormControl>
                <Grid item xs={12}>
                    <TextField
                        required
                        fullWidth
                        multiline
                        rows={4}
                        id="description"
                        label="Description"
                        autoComplete="description"
                        defaultValue={wordle_default_data?.description}
                        {...register('description')}
                        error={errors.description ? true : false}
                        helperText={errors.description?.message}
                    />
                </Grid>
                <Grid item container spacing={2} xs={12}>
                    {words.map((word, index) => 
                        <Grid item xs={12} key={index}>
                            <TextField
                                fullWidth
                                autoComplete="words"
                                value={word}
                                label="word"
                                inputProps={{
                                    'data-word-id': index
                                }}
                                InputProps={{
                                    endAdornment: (
                                        <IconButton aria-label='delete-word-by-index' data-word-id={String(index)} onClick={handleDeleteWord} style={{ textDecoration: 'none', color: "inherit" }}>
                                            <HighlightOffIcon />
                                        </IconButton>
                                    ),
                                    style: {
                                        padding: 0
                                    }
                                }}
                                {...register(`words.${index}`)}
                                onChange={handleChangeWord}
                                error={errors.words ? errors.words[index]? true : false : false}
                                helperText={errors.words ? errors.words[index]?.message : ''}
                            />
                        </Grid>
                    )}
                    <Grid item xs={3} sx={{ mt: 1, mb: 1 }}>
                        <Button
                            type="button"
                            fullWidth
                            variant="contained"
                            onClick={handleAddWord}
                        >
                            Add
                        </Button>
                    </Grid>
                    <Grid item xs={12}>
                        <FormHelperText sx={{color: '#d74343', mt: 1, ml: 2}}>{errors.words?.message}</FormHelperText>
                    </Grid>
                </Grid>
            </Grid>
            <LoadingButton
                type="submit"
                loading={loading}
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
            >
                Wordle {wordle_id ? 'Update' : 'Create'}
            </LoadingButton>
        </Box>
    )
}

export default WordlePrimaryManage;