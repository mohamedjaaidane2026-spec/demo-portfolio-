import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Browse from './pages/Browse'
import TitleDetail from './pages/TitleDetail'
import Watch from './pages/Watch'
import { Library, Rooms } from './pages/Account'
import { StoreProvider } from './lib/store'
import './index.css'

function NotFound() {
  return (
    <div className="shell py-28 text-center">
      <p className="eyebrow">404</p>
      <h1 className="mt-3 font-display text-4xl font-bold">This page isn’t in the catalog</h1>
      <p className="mt-3 text-mist-400">Check the address, or head back to the home screen.</p>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <StoreProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/browse" element={<Browse />} />
            <Route path="/rooms" element={<Rooms />} />
            <Route path="/library" element={<Library />} />
            <Route path="/title/:id" element={<TitleDetail />} />
            <Route path="/watch/:id" element={<Watch />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </StoreProvider>
    </BrowserRouter>
  </React.StrictMode>
)
