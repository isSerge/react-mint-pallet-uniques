
import { useContext, createContext, useEffect, useState } from 'react';
import { ApiPromise, WsProvider } from '@polkadot/api';
import { ApiOptions } from '@polkadot/api/types';

interface ApiPromiseContextType {
  api: ApiPromise;
  isApiReady: boolean;
}

interface ApiRxContextProviderProps {
  children?: React.ReactElement;
}

interface ApiContextProviderProps
  extends ApiRxContextProviderProps {
  types?: ApiOptions["types"];
}

const ApiPromiseContext: React.Context<ApiPromiseContextType> =
  createContext({} as ApiPromiseContextType);

export function ApiContextProvider(
  { children }: ApiContextProviderProps
): React.ReactElement {

  const [apiPromise] = useState<ApiPromise>(
    new ApiPromise({ provider: new WsProvider('wss://westmint-rpc.polkadot.io') })
  );

  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    apiPromise.isReady
      .then(() => {
        setIsReady(true);
      })
      .catch((e) => console.error(e));
  }, [apiPromise.isReady]);

  return (
    <ApiPromiseContext.Provider
      value={{ api: apiPromise, isApiReady: isReady }}
    >
      {children}
    </ApiPromiseContext.Provider>
  );
}

export const useApi = () => {
  return useContext(ApiPromiseContext);
};
