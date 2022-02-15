import { Box, Typography, Stack } from '@mui/material';
import type { AnyJson } from '@polkadot/types/types';
import { v4 } from 'uuid';

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
  <Stack spacing={2} mb={3} alignItems="start">
    <Box>
      <Typography variant="h5">Classes</Typography>
      <Stack spacing={1}>
        {classes.map(({ id, value }: { id: number, value: AnyJson }) => {
          return (
            <Box
              key={v4()}
              onClick={() => handleClassClick(id)}
              sx={{
                border: selectedClass === id ? '1px solid' : 'none',
                cursor: 'pointer',
              }}
            >
              ID: {id} | owner: {(value as Record<string, unknown>).owner}
            </Box>
          )
        })}
      </Stack>
    </Box>
    <Box mb={3}>
      <Typography variant="h5">Assets</Typography>
      <Stack spacing={1}>
        {assets.map(({ id, value }: { id: number, value: AnyJson }) => {
          return (
            <Box
              key={v4()}
              onClick={() => handleAssetClick(id)}
              sx={{
                border: selectedAsset === id ? '1px solid' : 'none',
                cursor: 'pointer',
              }}
            >
              ID: {id} | owner: {(value as Record<string, unknown>).owner}
            </Box>
          )
        })}
      </Stack>
    </Box>
    <Box mb={3}>
      <Typography variant="h5">Metadata</Typography>
      <Box>
        <pre>{metadata ? JSON.stringify(metadata, null, 2) : "select asset"}</pre>
      </Box>
    </Box>
  </Stack >
)

export default PalletInfo;
