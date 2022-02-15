import { useState } from 'react';
import { Typography, TextField, Button, Checkbox, Stack } from '@mui/material';
import { DefaultFormProps } from '../types';

const SetMetadataForm = ({ handleSubmit }: DefaultFormProps) => {
  const [value, setValue] = useState<Record<string, string | boolean>>({ classId: '', assetId: '', metadata: '', isFrozen: false });

  const handleChange =
    (prop: keyof Record<string, string>) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setValue({ ...value, [prop]: event.target.value });
    };

  const toggleFrozen = () => {
    setValue({ ...value, isFrozen: !value.isFrozen });
  }

  return (
    <Stack spacing={2} mb={3} alignItems="start">
      <Typography variant="h5">3. Set asset metadata</Typography>
      <TextField label="Class ID" value={value.classId} onChange={handleChange('classId')} />
      <TextField label="Asset ID" value={value.assetId} onChange={handleChange('assetId')} />
      <TextField label="Metadata" value={value.metadata} onChange={handleChange('metadata')} />
      <Checkbox
        checked={value.isFrozen as boolean}
        onChange={toggleFrozen}
        inputProps={{ 'aria-label': 'controlled' }}
      />
      <Stack spacing={2} direction="row">
        <Button variant="contained" onClick={() => handleSubmit(value)}>Submit</Button>
        <Button variant="outlined" onClick={() => setValue({ classId: '', assetId: '', metadata: '' })}>Reset</Button>
      </Stack>
    </Stack>
  )
}

export default SetMetadataForm;
