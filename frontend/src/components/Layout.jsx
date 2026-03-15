import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'
import { whatsappURL } from '../services/api'

export default function Layout() {
  return (
    <>
      <Navbar />
      <main className="page-enter">
        <Outlet />
      </main>
      <Footer />

      {/* Floating WhatsApp Button */}
      <a
        href={whatsappURL()}
        target="_blank"
        rel="noopener noreferrer"
        className="whatsapp-float"
        title="Chat with us on WhatsApp"
      >
        <i className="bi bi-whatsapp" />
      </a>
    </>
  )
}