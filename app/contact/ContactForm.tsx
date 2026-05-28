'use client'

import { useState } from 'react'

const services = [
  { id: '1', title: 'Strategic Consulting', description: 'Book a consultation' },
  { id: '2', title: 'Technology Platforms', description: 'Request a demonstration' },
  { id: '3', title: 'Learning & Capacity Building', description: 'Explore Learntu' },
  { id: '4', title: 'Partnerships & Collaboration', description: 'Discuss partnership opportunities' },
  { id: '5', title: 'Multimedia & Storytelling', description: 'Connect with Khaya Multimedia' },
]

export default function ContactForm() {
  const [selectedService, setSelectedService] = useState('')

  return (
    <form className="space-y-6 rounded-2xl border border-neutral-800 bg-neutral-900/60 p-8">
      <div className="space-y-2">
        <label htmlFor="name" className="text-sm font-medium text-white">Name</label>
        <input
          type="text"
          id="name"
          name="name"
          required
          className="w-full rounded-lg border border-neutral-700 bg-neutral-800/50 px-4 py-3 text-white placeholder-neutral-500 focus:border-brand-600 focus:outline-none focus:ring-1 focus:ring-brand-600"
          placeholder="Your name"
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-medium text-white">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          required
          className="w-full rounded-lg border border-neutral-700 bg-neutral-800/50 px-4 py-3 text-white placeholder-neutral-500 focus:border-brand-600 focus:outline-none focus:ring-1 focus:ring-brand-600"
          placeholder="your@email.com"
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="service" className="text-sm font-medium text-white">Service</label>
        <select
          id="service"
          name="service"
          value={selectedService}
          onChange={(e) => setSelectedService(e.target.value)}
          className="w-full rounded-lg border border-neutral-700 bg-neutral-800/50 px-4 py-3 text-white focus:border-brand-600 focus:outline-none focus:ring-1 focus:ring-brand-600"
        >
          <option value="">Select a service</option>
          {services.map((service) => (
            <option key={service.id} value={service.title}>
              {service.title}
            </option>
          ))}
        </select>
        {selectedService && (
          <p className="mt-1 text-xs text-neutral-400">
            {services.find(s => s.title === selectedService)?.description}
          </p>
        )}
      </div>
      <div className="space-y-2">
        <label htmlFor="subject" className="text-sm font-medium text-white">Subject</label>
        <input
          type="text"
          id="subject"
          name="subject"
          required
          className="w-full rounded-lg border border-neutral-700 bg-neutral-800/50 px-4 py-3 text-white placeholder-neutral-500 focus:border-brand-600 focus:outline-none focus:ring-1 focus:ring-brand-600"
          placeholder="How can we help?"
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="message" className="text-sm font-medium text-white">Message</label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          className="w-full rounded-lg border border-neutral-700 bg-neutral-800/50 px-4 py-3 text-white placeholder-neutral-500 focus:border-brand-600 focus:outline-none focus:ring-1 focus:ring-brand-600 resize-none"
          placeholder="Tell us about your project..."
        />
      </div>
      <button
        type="submit"
        className="w-full rounded-full bg-brand-600 px-8 py-3 font-semibold text-white transition-colors hover:bg-brand-700"
      >
        Send Message
      </button>
    </form>
  )
}
