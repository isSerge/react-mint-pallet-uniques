import { useEffect, useState } from 'react';
import { Box, Heading, Form, FormField, TextInput, Button, Select, Text, CheckBox } from 'grommet';
import type { AnyJson, AnyTuple, Codec } from '@polkadot/types/types';
import type { StorageKey } from '@polkadot/types';
import { web3FromSource } from '@polkadot/extension-dapp';
import { useApi } from './apiContext';
import { useAccount } from './accountContext';
import { useChain } from './chainContext';
import { sendAndFinalize } from './utils';

function normalizeClass([key, value]: [StorageKey<AnyTuple>, Codec]) {
  const id = parseInt((key.toHuman() as Array<string>)[0].replace(/,/g, ''), 10);
  return { id, value: value.toJSON() }
}

function normalizeAsset([key, value]: [StorageKey<AnyTuple>, Codec]) {
  const id = parseInt((key.toHuman() as Array<string>)[1], 10);
  return { id, value: value.toJSON() }
}

type DefaultState = {
  assetId: string;
  classId: string;
}

type MetadataState = {
  assetId: string;
  classId: string;
  metadata: string;
  isFrozen: boolean;
}

type TransferState = {
  assetId: string;
  classId: string;
  destination: string;
}

function App() {
  const [classes, setClasses] = useState<{ id: number, value: AnyJson }[]>([]);
  const [assets, setAssets] = useState<{ id: number, value: AnyJson }[]>([]);
  const [metadata, setMetadata] = useState<AnyJson | void>();
  const [selectedClass, selectClass] = useState<number | void>();
  const [selectedAsset, selectAsset] = useState<number | void>();
  const [classFormValue, setClassFormValue] = useState({ classId: '' });
  const [mintFormValue, setMintFormValue] = useState<DefaultState>({ classId: '', assetId: '' });
  const [metadataFormValue, setMetadataFormValue] = useState<MetadataState>({ classId: '', assetId: '', metadata: '', isFrozen: false });
  const [transferFormValue, setTransferFormValue] = useState<TransferState>({ classId: '', assetId: '', destination: '' });
  const [burnFormValue, setBurnFormValue] = useState<DefaultState>({ classId: '', assetId: '' });

  const { api } = useApi();
  const { accounts, selectedAccount, selectAccount } = useAccount();
  const { selectedChain, chains } = useChain();

  useEffect(() => {
    if (api) {
      api.query.uniques.class.entries().then(data => {
        const classes = data.map(normalizeClass)
        setClasses(classes);
      })
    }
  }, [api]);

  useEffect(() => {
    if (selectedClass !== undefined && api) {
      api.query.uniques.asset.entries(selectedClass).then(data => {
        const assets = data.map(normalizeAsset);
        setAssets(assets);
      })
    }
  }, [api, selectedClass]);

  useEffect(() => {
    if (selectedAsset && api) {
      api.query.uniques.instanceMetadataOf(selectedClass, selectedAsset).then(metadata => {
        setMetadata(metadata.toHuman());
      })
    }
  }, [api, selectedAsset]);

  const handleClassClick = (id: number) => {
    selectAsset();
    setMetadata();
    selectClass(id)
  }

  const mint = async ({ classId, assetId }: DefaultState) => {
    const account = accounts.find(({ meta }) => meta.name === selectedAccount);

    if (account && api) {
      const extrinsic = api.tx.uniques.mint(parseInt(classId, 10), parseInt(assetId, 10), account.address);
      const injector = await web3FromSource(account.meta.source);
      const { block } = await sendAndFinalize(extrinsic, account.address, api, injector.signer);
      console.log("Block: ", block);
    }
  }

  const createClass = async (classId: string) => {
    const account = accounts.find(({ meta }) => meta.name === selectedAccount);

    if (account && api) {
      const extrinsic = api.tx.uniques.create(parseInt(classId, 10), account.address);
      const injector = await web3FromSource(account.meta.source);
      const { block } = await sendAndFinalize(extrinsic, account.address, api, injector.signer);
      console.log("Block: ", block);
    }
  }

  const setAssetMetadata = async ({ classId, assetId, metadata, isFrozen }: MetadataState) => {
    const account = accounts.find(({ meta }) => meta.name === selectedAccount);

    if (account && api) {
      const extrinsic = api.tx.uniques.setMetadata(parseInt(classId, 10), parseInt(assetId, 10), metadata, isFrozen);
      const injector = await web3FromSource(account.meta.source);
      const { block } = await sendAndFinalize(extrinsic, account.address, api, injector.signer);
      console.log("Block: ", block);
    }
  }

  const transer = async ({ classId, assetId, destination }: TransferState) => {
    const account = accounts.find(({ meta }) => meta.name === selectedAccount);

    if (account && api) {
      const extrinsic = api.tx.uniques.transfer(parseInt(classId, 10), parseInt(assetId, 10), destination);
      const injector = await web3FromSource(account.meta.source);
      const { block } = await sendAndFinalize(extrinsic, account.address, api, injector.signer);
      console.log("Block: ", block);
    }
  }

  const burn = async ({ classId, assetId }: DefaultState) => {
    const account = accounts.find(({ meta }) => meta.name === selectedAccount);

    if (account && api) {
      const extrinsic = api.tx.uniques.burn(parseInt(classId, 10), parseInt(assetId, 10), null);
      const injector = await web3FromSource(account.meta.source);
      const { block } = await sendAndFinalize(extrinsic, account.address, api, injector.signer);
      console.log("Block: ", block);
    }
  }

  return (
    <Box>
      <Box width="200px">
        <Text>Chain</Text>
        <Select
          options={chains.map(({ name }) => name)}
          value={selectedChain.name}
          // onChange={({ option }) => handleChainSelect(option)}
          disabled
        />
      </Box>
      <br />
      <Box width="200px" gap="xxsmall">
        <Text>Account</Text>
        <Select
          options={accounts.map(({ meta }) => (meta.name as string))}
          value={selectedAccount}
          onChange={({ option }) => selectAccount(option)}
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
        <Heading level="3">1. Create class</Heading>
        <Form
          value={classFormValue}
          onChange={setClassFormValue}
          onReset={() => setClassFormValue({ classId: '' })}
          onSubmit={({ value }) => createClass(value.classId)}
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
      <Box width={{ max: "300px" }}>
        <Heading level="3">2. Mint asset</Heading>
        <Form
          value={mintFormValue}
          onChange={nextValue => setMintFormValue(nextValue)}
          onReset={() => setMintFormValue({ classId: '', assetId: '' })}
          onSubmit={({ value }) => mint(value)}
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
      <Box width={{ max: "300px" }}>
        <Heading level="3">3. Set asset metadata</Heading>
        <Form
          value={metadataFormValue}
          onChange={nextValue => setMetadataFormValue(nextValue)}
          onReset={() => setMetadataFormValue({ classId: '', assetId: '', metadata: '', isFrozen: false })}
          onSubmit={({ value }) => setAssetMetadata(value)}
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
      <Box width={{ max: "300px" }}>
        <Heading level="3">4. Transfer asset</Heading>
        <Form
          value={transferFormValue}
          onChange={nextValue => setTransferFormValue(nextValue)}
          onReset={() => setTransferFormValue({ classId: '', assetId: '', destination: '' })}
          onSubmit={({ value }) => transer(value)}
        >
          <FormField name="Class ID" htmlFor="text-input-id" label="Class ID">
            <TextInput name="classId" />
          </FormField>
          <FormField name="Asset ID" htmlFor="text-input-id" label="Asset ID">
            <TextInput name="assetId" />
          </FormField>
          <FormField name="Destination address" htmlFor="text-input-id" label="Destination address">
            <TextInput name="destination" />
          </FormField>
          <Box direction="row" gap="medium">
            <Button type="submit" primary label="Submit" />
            <Button type="reset" label="Reset" />
          </Box>
        </Form>
      </Box>
      <Box width={{ max: "300px" }}>
        <Heading level="3">4. Burn asset</Heading>
        <Form
          value={burnFormValue}
          onChange={nextValue => setBurnFormValue(nextValue)}
          onReset={() => setBurnFormValue({ classId: '', assetId: '' })}
          onSubmit={({ value }) => burn(value)}
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
    </Box >
  );
}

export default App;
