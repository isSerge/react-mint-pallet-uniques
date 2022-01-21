import type { StorageKey } from '@polkadot/types';
import type { AnyTuple, AnyJson, Codec } from '@polkadot/types/types';
import { useEffect, useState } from 'react';
import { Box, Heading, Form, FormField, TextInput, Button } from 'grommet';
import { useApi } from './context';

function App() {
  const [classes, setClasses] = useState<[StorageKey<AnyTuple>, Codec][]>([]);
  const [assets, setAssets] = useState<[StorageKey<AnyTuple>, Codec][]>([]);
  const [selectedClass, selectClass] = useState<number | void>();
  const [selectedAsset, selectAsset] = useState<number | void>();
  const [metadata, setMetadata] = useState<AnyJson | void>();
  const { api, isApiReady } = useApi();
  const [formValue, setFormValue] = useState({ classId: '', assetId: '', owner: '' });

  useEffect(() => {
    if (isApiReady) {
      api.query.uniques.class.entries().then(xs => {
        setClasses(xs);
      })
    }
  }, [api, isApiReady]);

  useEffect(() => {
    if (isApiReady) {
      api.query.uniques.asset.entries(selectedClass).then(xs => {
        setAssets(xs);
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
      <Box>
        <Heading level="3">Classes</Heading>
        <Box>
          {classes.map(([key, value]: any, i: number) => {
            const id = parseInt(key.toHuman()[0].replace(/,/g, ''), 10);
            return (
              <Box
                key={i}
                onClick={() => handleClassClick(id)}
              >
                ID: {id} | owner: {value.toJSON().owner}
              </Box>
            )
          })}
        </Box>
      </Box>
      <Box>
        <Heading level="3">Assets</Heading>
        <Box>
          {assets.map(([key, value]: any, i: number) => {
            const id = key.toHuman()[1];
            return (
              <Box
                key={i}
                onClick={() => selectAsset(id)}
              >
                ID: {id} | owner: {value.toJSON().owner} | frozen: {value.toJSON().isFrozen ? 'yes' : 'no'}
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
