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
import { CatalogProvider } from './lib/catalog'
import './index.css'

function NotFound() {
  return (
    <div className="shell py-20 text-center">
      <p className="label">404</p>
      <h1 className="mt-2 text-lg font-semibold">Page not found</h1>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <CatalogProvider>
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
      </CatalogProvider>
    </BrowserRouter>
  </React.StrictMode>
)
