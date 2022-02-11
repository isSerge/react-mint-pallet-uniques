import { useState } from 'react';
import { Box, Heading, Form, FormField, TextInput, Button } from 'grommet';
import { DefaultFormProps } from '../types';

const CreateClassForm = ({ handleSubmit }: DefaultFormProps) => {
  const [classFormValue, setClassFormValue] = useState({ classId: '' });
  return (
    <Box width={{ max: "300px" }}>
        <Heading level="3">1. Create class</Heading>
        <Form
          value={classFormValue}
          onChange={setClassFormValue}
          onReset={() => setClassFormValue({ classId: '' })}
          onSubmit={({ value }) => handleSubmit(value)}
        >
          <FormField name="Class ID" htmlFor="text-input-id" label="Class ID">
            <TextInput name="classId" />
          </FormField>
          <Box direction="row" gap="medium">
            <Button type="submit" primary label="Submit" />
            <Button type="reset" label="Reset" />
          </Box>
        </Form>
      </Box>
  )
}

export default CreateClassForm;
