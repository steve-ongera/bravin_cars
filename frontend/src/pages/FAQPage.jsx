import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { whatsappURL } from '../services/api'

const FAQS = [
  {
    category: 'Buying a Car',
    items: [
      { q: 'Do I need an account to browse or buy a car?', a: 'No account needed! You can browse all listings, inquire, and even submit import orders without creating an account. Simply browse, find your car, and contact us via WhatsApp or the inquiry form.' },
      { q: 'How do I inquire about a specific car?', a: 'On any vehicle listing page, click "Inquire on WhatsApp" for instant chat, or fill in the inquiry form. You can also call us directly at +254 112 284 093.' },
      { q: 'Are the car prices negotiable?', a: 'Many of our listings are marked as "negotiable." You can always make an offer through WhatsApp. Our sales team will work with you to find a fair deal.' },
      { q: 'Can I test drive a car before buying?', a: 'Yes! Test drives are available at our branches during working hours. Book a viewing by contacting the branch nearest to you or WhatsApp us to schedule.' },
      { q: 'Do you offer financing or loans?', a: 'While we don\'t offer in-house financing, we work with several reputable banks and SACCO partners who offer competitive car loan rates. Ask us for recommendations.' },
    ]
  },
  {
    category: 'Car Imports',
    items: [
      { q: 'How long does it take to import a car from Japan?', a: 'Typically 6-8 weeks from auction purchase to delivery in Kenya. This includes shipping (3-4 weeks), clearance, and inspection. UAE imports can be faster at 3-5 weeks.' },
      { q: 'What documents do I get when importing a car?', a: 'You receive the original logbook, import documentation, customs clearance certificate, KEBS inspection certificate, and comprehensive inspection report.' },
      { q: 'Can I see the car before it ships?', a: 'Yes! We provide detailed pre-purchase inspection reports with multiple photos and a video walkthrough of the vehicle before it leaves the source country.' },
      { q: 'Are there any hidden import charges?', a: 'We are fully transparent. We provide a complete cost breakdown including the car price, shipping, insurance, customs duty, and our service fee — all upfront before you commit.' },
    ]
  },
  {
    category: 'Selling Your Car',
    items: [
      { q: 'How does the commission sale work?', a: 'Submit your car details and photos through our platform. We list it, market it, handle all inquiries and negotiations. Once sold, you receive your asking price minus our agreed commission (typically 5-8%).' },
      { q: 'How long does it take to sell my car through Bravin Cars?', a: 'Most cars sell within 2-6 weeks depending on the model, price, and demand. Popular models like Toyota, Nissan, and Subaru often sell faster.' },
      { q: 'What cars can I list for commission sale?', a: 'We accept most roadworthy vehicles manufactured from 2000 onwards. The car must be clean (no major accidents) and properly documented with a valid logbook.' },
      { q: 'Will my car be physically at your showroom?', a: 'It depends on the arrangement. Some sellers keep their car and we handle remote marketing. Others drop off the car at our branch for display — which typically leads to faster sales.' },
    ]
  },
  {
    category: 'Car Inspection',
    items: [
      { q: 'What does a pre-purchase inspection include?', a: 'Our inspection covers engine health, transmission, suspension, brakes, electrical systems, body condition, mileage verification, and documentation check. You receive a detailed report.' },
      { q: 'Can you inspect a car at the seller\'s location?', a: 'Yes! For an additional fee, our inspectors can travel to the seller\'s location to inspect the car before you commit to purchasing.' },
      { q: 'How do I book an inspection?', a: 'Visit our Inspection page, fill the booking form, or WhatsApp us directly. Inspections are available at all our branches.' },
    ]
  },
  {
    category: 'General',
    items: [
      { q: 'How many branches does Bravin Cars have?', a: 'We currently have 8 branches across Kenya: Nairobi (HQ), Mombasa, Kisumu, Nakuru, Eldoret, Thika, Nyeri, and Meru.' },
      { q: 'What are your working hours?', a: 'Monday to Saturday: 8:00 AM – 6:00 PM. Sunday: 10:00 AM – 4:00 PM. WhatsApp inquiries are monitored 7 days a week.' },
    ]
  }
]

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="faq-item">
      <div className={`faq-question ${open ? 'open' : ''}`} onClick={() => setOpen(o => !o)}>
        {q}
        <i className={`bi bi-chevron-down faq-icon`} />
      </div>
      <div className={`faq-answer ${open ? 'open' : ''}`}>
        <div className="faq-answer-inner">{a}</div>
      </div>
    </div>
  )
}

export default function FAQPage() {
  return (
    <div>
      <div className="page-header">
        <div className="container">
          <h1><i className="bi bi-question-circle" /> Frequently Asked Questions</h1>
          <p>Everything you need to know about buying, selling, and importing cars with Bravin Cars.</p>
          <div className="breadcrumb">
            <Link to="/">Home</Link><span className="sep"><i className="bi bi-chevron-right" /></span><span>FAQs</span>
          </div>
        </div>
      </div>

      <div className="section">
        <div className="container" style={{ maxWidth: 860 }}>
          {FAQS.map(section => (
            <div key={section.category} style={{ marginBottom: 36 }}>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8, color: 'var(--primary)' }}>
                <i className="bi bi-folder2" /> {section.category}
              </h2>
              {section.items.map((item, i) => <FAQItem key={i} {...item} />)}
            </div>
          ))}

          {/* Still have questions */}
          <div style={{ marginTop: 40, background: 'linear-gradient(135deg, var(--secondary), #1a2d4a)', borderRadius: 16, padding: 32, color: 'white', textAlign: 'center' }}>
            <h3 style={{ fontFamily: 'var(--font-heading)', marginBottom: 8 }}>Still have questions?</h3>
            <p style={{ opacity: 0.85, marginBottom: 20 }}>Our team is ready to help you. Reach out via WhatsApp for the fastest response.</p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <a href={whatsappURL('Hello! I have a question about Bravin Cars.')} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp">
                <i className="bi bi-whatsapp" /> Chat on WhatsApp
              </a>
              <Link to="/contact" className="btn" style={{ background: 'rgba(255,255,255,0.15)', color: 'white', border: '1.5px solid rgba(255,255,255,0.3)' }}>
                <i className="bi bi-envelope" /> Contact Us
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}