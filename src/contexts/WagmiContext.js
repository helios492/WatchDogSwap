import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { config } from '../config';

const queryClient = new QueryClient()

const WagmiQueryProvider = ({children}) => {
  return (
  <WagmiProvider config={config}>
    <QueryClientProvider client={queryClient}> 
    {children}
    </QueryClientProvider> 
  </WagmiProvider>
  )
};


export default WagmiQueryProvider;
