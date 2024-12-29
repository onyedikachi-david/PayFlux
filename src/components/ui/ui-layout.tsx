'use client'

import Link from 'next/link'
import {usePathname} from 'next/navigation'
import * as React from 'react'
import {ReactNode, Suspense, useEffect, useRef} from 'react'
import toast, {Toaster} from 'react-hot-toast'

import {AccountChecker} from '../account/account-ui'
import {ClusterChecker, ClusterUiSelect, ExplorerLink} from '../cluster/cluster-ui'
import {WalletButton} from '../solana/solana-provider'

export function UiLayout({ children, links }: { children: ReactNode; links: { label: string; path: string }[] }) {
  const pathname = usePathname()

  return (
    <div className="min-h-screen flex flex-col bg-slate-900 text-slate-300">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 backdrop-blur-lg bg-slate-900/80 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo and Navigation */}
            <div className="flex items-center">
              <Link className="flex items-center space-x-3 hover:opacity-80 transition-opacity" href="/">
                <span className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-indigo-600 bg-clip-text text-transparent">Pay</span>
                <span className="text-2xl font-bold text-white">Flux</span>
              </Link>
              <div className="hidden md:block ml-10">
                <div className="flex items-center space-x-4">
                  {links.map(({ label, path }) => (
                    <Link
                      key={path}
                      href={path}
                      className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 
                        ${pathname === path 
                          ? 'bg-indigo-600 text-white' 
                          : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}
                    >
                      {label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Wallet and Network */}
            <div className="flex items-center space-x-4">
              <div className="[&>button]:!bg-indigo-600 [&>button]:hover:!bg-indigo-700 [&>button]:transition-colors [&>button]:duration-200">
                <WalletButton />
              </div>
              <div className="hidden md:block [&_select]:bg-slate-800 [&_select]:border-slate-700 [&_select]:text-slate-300">
                <ClusterUiSelect />
              </div>
            </div>
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden border-t border-slate-800 py-2">
            <div className="flex flex-wrap gap-2">
              {links.map(({ label, path }) => (
                <Link
                  key={path}
                  href={path}
                  className={`px-3 py-2 rounded-md text-sm font-medium flex-shrink-0 transition-colors duration-200
                    ${pathname === path 
                      ? 'bg-indigo-600 text-white' 
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}
                >
                  {label}
                </Link>
              ))}
              <div className="[&_select]:bg-slate-800 [&_select]:border-slate-700 [&_select]:text-slate-300">
                <ClusterUiSelect />
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* System Status */}
      <div className="bg-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ClusterChecker>
            <AccountChecker />
          </ClusterChecker>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Suspense
          fallback={
            <div className="flex items-center justify-center min-h-[50vh]">
              <div className="w-8 h-8 border-4 border-indigo-400 border-t-transparent rounded-full animate-spin"></div>
            </div>
          }
        >
          {children}
        </Suspense>
        <Toaster 
          position="bottom-right"
          toastOptions={{
            className: '!bg-slate-800 !text-white !border !border-slate-700',
            duration: 5000,
          }} 
        />
      </main>

      {/* Footer */}
      <footer className="bg-slate-800/50 border-t border-slate-800">
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* About */}
            <div>
              <h3 className="text-lg font-semibold text-indigo-400 mb-4">About PayFlux</h3>
              <p className="text-slate-400 text-sm">
                A decentralized crypto-to-fiat bridge enabling direct transfers from Solana wallets to Nigerian bank accounts.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-semibold text-indigo-400 mb-4">Quick Links</h3>
              <ul className="space-y-2">
                {links.map(({ label, path }) => (
                  <li key={path}>
                    <Link href={path} className="text-slate-400 hover:text-white text-sm transition-colors duration-200">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h3 className="text-lg font-semibold text-indigo-400 mb-4">Resources</h3>
              <ul className="space-y-2">
                <li>
                  <a 
                    href="https://docs.solana.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-slate-400 hover:text-white text-sm transition-colors duration-200"
                  >
                    Solana Docs
                  </a>
                </li>
                <li>
                  <a 
                    href="https://quicknode.com/docs" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-slate-400 hover:text-white text-sm transition-colors duration-200"
                  >
                    QuickNode Docs
                  </a>
                </li>
                <li>
                  <a 
                    href="https://github.com/yourusername/payflux" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-slate-400 hover:text-white text-sm transition-colors duration-200"
                  >
                    GitHub Repository
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-slate-800 text-center text-slate-400 text-sm">
            <p>© {new Date().getFullYear()} PayFlux. Built with ❤️ for the Solana ecosystem.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export function AppModal({
  children,
  title,
  hide,
  show,
  submit,
  submitDisabled,
  submitLabel,
}: {
  children: ReactNode
  title: string
  hide: () => void
  show: boolean
  submit?: () => void
  submitDisabled?: boolean
  submitLabel?: string
}) {
  const dialogRef = useRef<HTMLDialogElement | null>(null)

  useEffect(() => {
    if (!dialogRef.current) return
    if (show) {
      dialogRef.current.showModal()
    } else {
      dialogRef.current.close()
    }
  }, [show, dialogRef])

  return (
    <dialog className="modal" ref={dialogRef}>
      <div className="modal-box space-y-5">
        <h3 className="font-bold text-lg">{title}</h3>
        {children}
        <div className="modal-action">
          <div className="join space-x-2">
            {submit ? (
              <button className="btn btn-xs lg:btn-md btn-primary" onClick={submit} disabled={submitDisabled}>
                {submitLabel || 'Save'}
              </button>
            ) : null}
            <button onClick={hide} className="btn">
              Close
            </button>
          </div>
        </div>
      </div>
    </dialog>
  )
}

export function AppHero({
  children,
  title,
  subtitle,
}: {
  children?: ReactNode
  title: ReactNode
  subtitle: ReactNode
}) {
  return (
    <div className="hero py-[64px]">
      <div className="hero-content text-center">
        <div className="max-w-2xl">
          {typeof title === 'string' ? <h1 className="text-5xl font-bold">{title}</h1> : title}
          {typeof subtitle === 'string' ? <p className="py-6">{subtitle}</p> : subtitle}
          {children}
        </div>
      </div>
    </div>
  )
}

export function ellipsify(str = '', len = 4) {
  if (str.length > 30) {
    return str.substring(0, len) + '..' + str.substring(str.length - len, str.length)
  }
  return str
}

export function useTransactionToast() {
  return (signature: string) => {
    toast.success(
      <div className={'text-center'}>
        <div className="text-lg">Transaction sent</div>
        <ExplorerLink path={`tx/${signature}`} label={'View Transaction'} className="btn btn-xs btn-primary" />
      </div>,
    )
  }
}
