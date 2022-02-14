import { useState, useRef } from 'react';
import { Box, Typography, Button, Stack } from '@mui/material';
import { useSubspaceApi } from '../subspaceContext';

const StoreAsset = () => {
  const { apiSubspace } = useSubspaceApi();
  const [file, setFile] = useState<Uint8Array | undefined>();
  const [objectId, setObjectId] = useState<string | undefined>();
  const ref = useRef<HTMLInputElement>(null);

  const handleInputChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files !== null && event.target.files.length) {
      const file = event.target.files[0];
      const objectData = new Uint8Array(await file.arrayBuffer());
      setFile(objectData);
    }
  }

  const handleSubmit = async (file?: Uint8Array) => {
    if (apiSubspace && file) {
      const objectId = await apiSubspace.putObject(file);
      console.log(objectId)
      setObjectId(objectId);
    }
  }

  const handleReset = () => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    ref.current!.value = '';
    setObjectId(undefined);
    setFile(undefined);
  }

  return (
    <Stack spacing={2} mb={3} alignItems="start">
      <Typography variant="h5">0. Store object</Typography>
      <Stack spacing={2}>
        <Box>
          <input ref={ref} type="file" onChange={handleInputChange} />
        </Box>
        <Stack spacing={2} direction="row">
          <Button variant="contained" onClick={() => handleSubmit(file)}>Submit</Button>
          <Button variant="outlined" onClick={() => handleReset()}>Reset</Button>
        </Stack>
      </Stack>
      {objectId && (
        <Box>
          <Typography>Object submitted to Subspace</Typography>
          <Typography>Object ID: {objectId}</Typography>
        </Box>
      )}
    </Stack>
  )
}

export default StoreAsset;
