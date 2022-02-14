import { useState } from 'react';
import { Typography, TextField, Button, Stack } from '@mui/material';
import { DefaultFormProps } from '../types';

const CreateClassForm = ({ handleSubmit }: DefaultFormProps) => {
  const [value, setValue] = useState({ classId: '' });

  const handleChange =
    (prop: keyof Record<string, string>) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setValue({ ...value, [prop]: event.target.value });
    };

  return (
    <Stack spacing={2} mb={3} alignItems="start">
      <Typography variant="h5">1. Create class</Typography>
      <TextField label="Class ID" value={value.classId} onChange={handleChange('classId')} />
      <Stack spacing={2} direction="row">
        <Button variant="contained" onClick={() => handleSubmit(value)}>Submit</Button>
        <Button variant="outlined" onClick={() => setValue({ classId: '' })}>Reset</Button>
      </Stack>
    </Stack>
  )
}

export default CreateClassForm;
