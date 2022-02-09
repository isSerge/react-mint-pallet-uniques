import { Box, Heading } from 'grommet';
import type { AnyJson } from '@polkadot/types/types';

interface PalletInfoProps {
  classes: { id: number, value: AnyJson }[]; 
  assets: { id: number, value: AnyJson }[]; 
  metadata: AnyJson | void;
  handleClassClick: (id: number) => void;
  handleAssetClick: (id: number) => void;
  selectedClass: number | void;
  selectedAsset: number | void;
}

const PalletInfo = ({
  classes, 
  assets, 
  metadata, 
  handleClassClick, 
  handleAssetClick, 
  selectedClass, 
  selectedAsset,
}: PalletInfoProps) => (
  <>
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
              ID: {id} | owner: {(value as Record<string, unknown>).owner}
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
              onClick={() => handleAssetClick(id)}
              border={selectedAsset === id && 'all'}
              pad="xxsmall"
            >
              ID: {id} | owner: {(value as Record<string, unknown>).owner}
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
  </>
)

export default PalletInfo;
