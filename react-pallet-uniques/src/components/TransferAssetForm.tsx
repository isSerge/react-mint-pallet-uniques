import { useState } from 'react';
import { Typography, TextField, Button, Stack } from '@mui/material';
import { DefaultFormProps } from '../types';

const TransferAssetForm = ({ handleSubmit }: DefaultFormProps) => {
  const [value, setValue] = useState<Record<string, string>>({ classId: '', assetId: '', destination: '' });

  const handleChange =
    (prop: keyof Record<string, string>) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setValue({ ...value, [prop]: event.target.value });
    };

  return (
    <Stack spacing={2} mb={3} alignItems="start">
      <Typography variant="h5">5. Transfer asset</Typography>
      <TextField label="Class ID" value={value.classId} onChange={handleChange('classId')} />
      <TextField label="Asset ID" value={value.assetId} onChange={handleChange('assetId')} />
      <TextField label="Destination address" value={value.destination} onChange={handleChange('destination')} />
      <Stack spacing={2} direction="row">
        <Button variant="contained" onClick={() => handleSubmit(value)}>Submit</Button>
        <Button variant="outlined" onClick={() => setValue({ classId: '', assetId: '', destination: '' })}>Reset</Button>
      </Stack>
    </Stack>
  )
}

export default TransferAssetForm;
