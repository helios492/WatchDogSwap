import { createContext, useContext, useState } from "react";

const ChainIdContext = createContext();

const ChainIdProvider = ({children}) => {
    const [netChainId, setNetChainId] = useState(1);
  return (
  <ChainIdContext.Provider value={{netChainId, setNetChainId}}>
    {children}
  </ChainIdContext.Provider>
  )
};

export const ChainIdState = () => {
    return useContext(ChainIdContext);
}

export default ChainIdProvider;
