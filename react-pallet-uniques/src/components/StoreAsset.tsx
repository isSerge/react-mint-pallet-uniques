import { useState } from 'react';
import { Box, Button, FileInput, Form, FormField, Heading, Text } from 'grommet';
import { useSubspaceApi } from '../subspaceContext';

const StoreAsset = () => {
  const { apiSubspace } = useSubspaceApi();
  const [file, setFile] = useState<Uint8Array>();
  const [objectId, setObjectId] = useState<string>()

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
      setObjectId(objectId);
    }
  }

  return (
    <Box gap="small">
      <Heading level="3">0. Store object</Heading>
      <Box width={{ max: "300px" }}>
        <Form onSubmit={() => handleSubmit(file)}>
          <FormField label="FileInput" name="file-input" htmlFor="file-input">
            <FileInput onChange={handleInputChange} />
          </FormField>
          <Button label="Submit" type="submit" />
        </Form>
      </Box>
      {objectId && (
        <Box>
          <Text>Object submitted to Subspace</Text>
          <Text>Object ID: {objectId}</Text>
        </Box>
      )}
    </Box>
  )
}

export default StoreAsset;
