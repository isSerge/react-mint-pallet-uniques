export interface DefaultFormProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handleSubmit: (value: Record<string, string | any>) => Promise<void>;
}
