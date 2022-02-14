import { useState } from 'react';
import { Typography, TextField, Button, Stack } from '@mui/material';
import { DefaultFormProps } from '../types';

const BurnAssetForm = ({ handleSubmit }: DefaultFormProps) => {
  const [value, setValue] = useState<Record<string, string>>({ classId: '', assetId: '' });

  const handleChange =
    (prop: keyof Record<string, string>) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setValue({ ...value, [prop]: event.target.value });
    };

  return (
    <Stack spacing={2} mb={3} alignItems="start">
      <Typography variant="h5">6. Burn asset</Typography>
      <TextField label="Class ID" value={value.classId} onChange={handleChange('classId')} />
      <TextField label="Asset ID" value={value.assetId} onChange={handleChange('assetId')} />
      <Stack spacing={2} direction="row">
        <Button variant="contained" onClick={() => handleSubmit(value)}>Submit</Button>
        <Button variant="outlined" onClick={() => setValue({ classId: '', assetId: '' })}>Reset</Button>
      </Stack>
    </Stack>
  )
}

export default BurnAssetForm;
