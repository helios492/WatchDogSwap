import { createContext, useContext, useState } from "react";

const ChainIdContext = createContext();

const ChainIdProvider = ({children}) => {
    const [chainId, setChainId] = useState(1);
  return (
  <ChainIdContext.Provider value={{chainId, setChainId}}>
    {children}
  </ChainIdContext.Provider>
  )
};

export const ChainIdState = () => {
    return useContext(ChainIdContext);
}

export default ChainIdProvider;
