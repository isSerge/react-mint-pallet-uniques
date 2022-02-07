import { useContext, createContext, useState, Context, Dispatch, SetStateAction } from 'react';

type Chain = {
  url: string;
  name: string;
}

interface IChainContext {
  chains: Chain[],
  selectedChain: Chain;
  selectChain: Dispatch<SetStateAction<Chain>>;
}

const defaultChains: Chain[] = [
  {
    url: 'wss://westmint-rpc.polkadot.io',
    name: 'Westmint'
  },
  {
    url: 'ws://127.0.0.1:9944',
    name: 'local'
  },
  
  {
    url: 'wss://statemine-rpc.polkadot.io',
    name: 'Statemine'
  },
  {
    url: 'wss://statemint-rpc.polkadot.io',
    name: 'Statemint'
  },
]

const ChainContext: Context<IChainContext> =
  createContext({
    chains: defaultChains,
    selectedChain: defaultChains[0],
    selectChain: () => null,
  } as IChainContext);

export function ChainContextProvider({ children }: any): React.ReactElement {
  const [chains] = useState<Chain[]>(defaultChains);
  const [selectedChain, selectChain] = useState<Chain>(chains[0]);

  return (
    <ChainContext.Provider
      value={{ chains, selectChain, selectedChain }}
    >
      {children}
    </ChainContext.Provider>
  );
}

export const useChain = () => {
  return useContext(ChainContext);
};
