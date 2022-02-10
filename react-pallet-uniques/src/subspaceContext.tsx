import { useContext, createContext, useEffect, useState } from 'react';
import { SubspaceClient, Identity } from "@subspace/subspace";

const NODE_WS_PROVIDER = process.env.REACT_APP_NODE_WS_PROVIDER;
const FARMER_WS_PROVIDER = process.env.REACT_APP_FARMER_WS_PROVIDER;

interface SubspaceContextType {
  apiSubspace?: SubspaceClient;
  chainName?: string;
}

interface ContextProviderProps {
  children?: React.ReactElement;
}

const SubspaceContext: React.Context<SubspaceContextType> =
  createContext({} as SubspaceContextType);

const getSubspaceApi = async (nodeUrl: string, farmerUrl: string) => {
  const identity = await Identity.fromWeb3();

  const api = await SubspaceClient.connect(
    identity,
    nodeUrl,
    farmerUrl
  );

  return api;
}

export function SubspaceProvider(
  { children }: ContextProviderProps
): React.ReactElement {
  const [apiSubspace, setApiSubspace] = useState<SubspaceClient>();

  useEffect(() => {
    if (apiSubspace) return;

    console.log(`Connecting to Subspace node: ${NODE_WS_PROVIDER}`);
    console.log(`Connecting to Subspace farmer: ${FARMER_WS_PROVIDER}`);

    getSubspaceApi(NODE_WS_PROVIDER!, FARMER_WS_PROVIDER!)
      .then((api) => setApiSubspace(api))
      .catch((e) => console.error(e));
  }, [apiSubspace]);

  return (
    <SubspaceContext.Provider value={{ apiSubspace }}>
      {children}
    </SubspaceContext.Provider>
  );
}

export const useSubspaceApi = () => {
  return useContext(SubspaceContext);
};

