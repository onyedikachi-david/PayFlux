import './globals.css'
import {ClusterProvider} from '@/components/cluster/cluster-data-access'
import {SolanaProvider} from '@/components/solana/solana-provider'
import {UiLayout} from '@/components/ui/ui-layout'
import {ReactQueryProvider} from './react-query-provider'

export const metadata = {
  title: 'PayFlux | Solana to Nigerian Bank Transfers',
  description: 'A decentralized crypto-to-fiat bridge enabling direct transfers from Solana wallets to Nigerian bank accounts.',
}

const links: { label: string; path: string }[] = [
  { label: 'Send Payment', path: '/' },
  { label: 'Market Maker', path: '/market-maker' },
  { label: 'Account', path: '/account' },
  { label: 'Network', path: '/clusters' },
]

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ReactQueryProvider>
          <ClusterProvider>
            <SolanaProvider>
              <UiLayout links={links}>{children}</UiLayout>
            </SolanaProvider>
          </ClusterProvider>
        </ReactQueryProvider>
      </body>
    </html>
  )
}
