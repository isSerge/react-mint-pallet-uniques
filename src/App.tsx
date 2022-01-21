import { useEffect, useState } from 'react';
import { Box, Heading, Form, FormField, TextInput, Button, Select } from 'grommet';
import type { AnyJson, AnyTuple, Codec } from '@polkadot/types/types';
import type { StorageKey } from '@polkadot/types';
import { useApi } from './context';

function normalizeClass([key, value]: [StorageKey<AnyTuple>, Codec]) {
  const id = parseInt((key.toHuman() as Array<string>)[0].replace(/,/g, ''), 10);
  return { id, value: value.toJSON() }
}

function normalizeAsset([key, value]: [StorageKey<AnyTuple>, Codec]) {
  const id = parseInt((key.toHuman() as Array<string>)[1], 10);
  return { id, value: value.toJSON() }
}

function App() {
  const [classes, setClasses] = useState<{ id: number, value: AnyJson }[]>([]);
  const [assets, setAssets] = useState<{ id: number, value: AnyJson }[]>([]);
  const [metadata, setMetadata] = useState<AnyJson | void>();
  const [selectedClass, selectClass] = useState<number | void>();
  const [selectedAsset, selectAsset] = useState<number | void>();
  const { api, isApiReady } = useApi();
  const [formValue, setFormValue] = useState({ classId: '', assetId: '', owner: '' });
  const [selectValue, setSelectValue] = useState('Westmint');

  console.log({ selectedAsset, selectedClass });

  useEffect(() => {
    if (isApiReady) {
      api.query.uniques.class.entries().then(data => {
        const classes = data.map(normalizeClass)
        setClasses(classes);
      })
    }
  }, [api, isApiReady]);

  useEffect(() => {
    if (isApiReady && selectedClass !== undefined) {
      api.query.uniques.asset.entries(selectedClass).then(data => {
        const assets = data.map(normalizeAsset)
        setAssets(assets);
      })
    }
  }, [api, isApiReady, selectedClass]);

  useEffect(() => {
    if (isApiReady && selectedAsset) {
      api.query.uniques.instanceMetadataOf(selectedClass, selectedAsset).then(metadata => {
        setMetadata(metadata.toHuman());
      })
    }
  }, [api, isApiReady, selectedAsset]);

  const handleClassClick = (id: number) => {
    selectAsset();
    setMetadata();
    selectClass(id)
  }

  const mint = async ({ classId, assetId, owner }: any) => {
    const unsub = await api.tx.uniques.mint(classId, assetId, owner).signAndSend(owner, { nonce: -1 }, async (result) => {
      if (result.status.isFinalized) {
        console.log("Finalized");
        console.log({ classId, assetId, owner })
        unsub();
      }
    })
  }

  return (
    <Box>
      <Box width="200px">
        <Select
          options={['Statemint', 'Statemine', 'Westmint']}
          value={selectValue}
          onChange={({ option }) => setSelectValue(option)}
        />
      </Box>
      <Box>
        <Heading level="3">Classes</Heading>
        <Box>
          {classes.map(({ id, value }: { id: number, value: AnyJson }) => {
            return (
              <Box
                key={id}
                onClick={() => handleClassClick(id)}
                border={selectedClass === id && 'all'}
                pad="xxsmall"
              >
                ID: {id} | owner: {(value as Record<string, string>).owner}
              </Box>
            )
          })}
        </Box>
      </Box>
      <Box>
        <Heading level="3">Assets</Heading>
        <Box>
          {assets.map(({ id, value }: { id: number, value: AnyJson }) => {
            return (
              <Box
                key={id}
                onClick={() => selectAsset(id)}
                border={selectedAsset === id && 'all'}
                pad="xxsmall"
              >
                ID: {id} | owner: {(value as Record<string, string>).owner}
              </Box>
            )
          })}
        </Box>
      </Box>
      <Box>
        <Heading level="3">Metadata</Heading>
        <Box overflow="scroll" pad="small" background="dark-2">
          <pre>{metadata ? JSON.stringify(metadata, null, 2) : "select asset"}</pre>
        </Box>
      </Box>
      <Box width={{ max: "300px" }}>
        <Heading level="3">Mint asset</Heading>
        <Form
          value={formValue}
          onChange={nextValue => setFormValue(nextValue)}
          onReset={() => setFormValue({ classId: '', assetId: '', owner: '' })}
          onSubmit={({ value }) => console.log(value)}
        >
          <FormField name="Class ID" htmlFor="text-input-id" label="Class ID">
            <TextInput name="classId" />
          </FormField>
          <FormField name="Asset ID" htmlFor="text-input-id" label="Asset ID">
            <TextInput name="assetId" />
          </FormField>
          <FormField name="Owner address" htmlFor="text-input-id" label="Owner address">
            <TextInput name="owner" />
          </FormField>
          <Box direction="row" gap="medium">
            <Button type="submit" primary label="Submit" />
            <Button type="reset" label="Reset" />
          </Box>
        </Form>
      </Box>
    </Box >
  );
}

export default App;
