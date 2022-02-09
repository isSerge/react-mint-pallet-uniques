import { useState } from 'react';
import { Box, Heading, Form, FormField, TextInput, Button, CheckBox } from 'grommet';
import { DefaultFormProps } from '../types';

const SetMetadataForm = ({ handleSubmit }:DefaultFormProps) => {
  const [value, setValue] = useState<Record<string, string | boolean>>({ classId: '', assetId: '', metadata: '', isFrozen: false });
  
  return (
    <Box width={{ max: "300px" }}>
      <Heading level="3">3. Set asset metadata</Heading>
      <Form
        value={value}
        onChange={nextValue => setValue(nextValue)}
        onReset={() => setValue({ classId: '', assetId: '', metadata: '', isFrozen: false })}
        onSubmit={({ value }) => handleSubmit(value)}
      >
        <FormField name="Class ID" htmlFor="text-input-id" label="Class ID">
          <TextInput name="classId" />
        </FormField>
        <FormField name="Asset ID" htmlFor="text-input-id" label="Asset ID">
          <TextInput name="assetId" />
        </FormField>
        <FormField name="Metadata" htmlFor="text-input-id" label="Metadata">
          <TextInput name="metadata" />
        </FormField>
        <FormField name="Freeze" htmlFor="text-input-id">
          <CheckBox name="isFrozen" label="Freeze" />
        </FormField>
        <Box direction="row" gap="medium">
          <Button type="submit" primary label="Submit" />
          <Button type="reset" label="Reset" />
        </Box>
      </Form>
    </Box>
  )
}

export default SetMetadataForm;
