import { useState } from 'react';
import { Box, Heading, Form, FormField, TextInput, Button } from 'grommet';
import { DefaultFormProps } from '../types';

const BurnAssetForm = ({ handleSubmit }:DefaultFormProps) => {
  const [value, setValue] = useState<Record<string, string>>({ classId: '', assetId: '' });

  return (
    <Box width={{ max: "300px" }}>
        <Heading level="3">6. Burn asset</Heading>
        <Form
          value={value}
          onChange={nextValue => setValue(nextValue)}
          onReset={() => setValue({ classId: '', assetId: '' })}
          onSubmit={({ value }) => handleSubmit(value)}
        >
          <FormField name="Class ID" htmlFor="text-input-id" label="Class ID">
            <TextInput name="classId" />
          </FormField>
          <FormField name="Asset ID" htmlFor="text-input-id" label="Asset ID">
            <TextInput name="assetId" />
          </FormField>
          <Box direction="row" gap="medium">
            <Button type="submit" primary label="Submit" />
            <Button type="reset" label="Reset" />
          </Box>
        </Form>
      </Box>
  )
}

export default BurnAssetForm;
