/* eslint-disable @next/next/no-html-link-for-pages */
/* eslint-disable react/no-unescaped-entities */
'use client';

import Image from 'next/image';
import logo from '../assets/Frame.png';

export default function Footer() {
  return (
    <footer className="bg-[#2952a1] text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Nova Health Column */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Image
                src={logo}
                alt="NovaHealth Logo"
                width={48}
                height={48}
                className="bg-white rounded-lg p-1"
              />
              <h3 className="text-2xl font-bold">Nova Health</h3>
            </div>
            <p className="text-white/80 mb-6 leading-relaxed">
              His Footer Text Ties Directly To Your Portfolio's Theme Of Creative + Technical Expertise While Giving Visitors A Way To Connect With You
            </p>
            <div className="flex gap-3">
              <a href="#" className="w-11 h-11 bg-[#FF6B4A] rounded-full flex items-center justify-center hover:bg-[#FF5533] transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/>
                </svg>
              </a>
              <a href="#" className="w-11 h-11 bg-[#FF6B4A] rounded-full flex items-center justify-center hover:bg-[#FF5533] transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm6.066 9.645c.183 4.04-2.83 8.544-8.164 8.544-1.622 0-3.131-.476-4.402-1.291 1.524.18 3.045-.244 4.252-1.189-1.256-.023-2.317-.854-2.684-1.995.451.086.895.061 1.298-.049-1.381-.278-2.335-1.522-2.304-2.853.388.215.83.344 1.301.359-1.279-.855-1.641-2.544-.889-3.835 1.416 1.738 3.533 2.881 5.92 3.001-.419-1.796.944-3.527 2.799-3.527.825 0 1.572.349 2.096.907.654-.128 1.27-.368 1.824-.697-.215.671-.67 1.233-1.263 1.589.581-.07 1.135-.224 1.649-.453-.384.578-.87 1.084-1.433 1.489z"/>
                </svg>
              </a>
              <a href="#" className="w-11 h-11 bg-[#FF6B4A] rounded-full flex items-center justify-center hover:bg-[#FF5533] transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* For Patients Column */}
          <div>
            <h4 className="text-xl font-bold mb-6 border-b-2 border-[#ebe2cd] pb-2 inline-block">For Patients</h4>
            <ul className="space-y-3 text-white/80">
              <li><a href="/search-doctors" className="hover:text-white transition-colors hover:translate-x-1 inline-block">Find A Doctor</a></li>
              <li><a href="/onboarding" className="hover:text-white transition-colors hover:translate-x-1 inline-block">How It Works</a></li>
              <li><a href="/matches" className="hover:text-white transition-colors hover:translate-x-1 inline-block">Browse Specialties</a></li>
              <li><a href="/patient/appointments" className="hover:text-white transition-colors hover:translate-x-1 inline-block">Patient Reviews</a></li>
            </ul>
          </div>

          {/* For Doctors Column */}
          <div>
            <h4 className="text-xl font-bold mb-6 border-b-2 border-[#ebe2cd] pb-2 inline-block">For Doctors</h4>
            <ul className="space-y-3 text-white/80">
              <li><a href="/signup" className="hover:text-white transition-colors hover:translate-x-1 inline-block">Join CareMatch</a></li>
              <li><a href="/doctor/dashboard" className="hover:text-white transition-colors hover:translate-x-1 inline-block">Pricing</a></li>
              <li><a href="/doctor/profile" className="hover:text-white transition-colors hover:translate-x-1 inline-block">Success Stories</a></li>
              <li><a href="/doctor/appointments" className="hover:text-white transition-colors hover:translate-x-1 inline-block">Resources</a></li>
            </ul>
          </div>

          {/* Company Column */}
          <div>
            <h4 className="text-xl font-bold mb-6 border-b-2 border-[#ebe2cd] pb-2 inline-block">Company</h4>
            <ul className="space-y-3 text-white/80">
              <li><a href="#" className="hover:text-white transition-colors hover:translate-x-1 inline-block">About Us</a></li>
              <li><a href="#" className="hover:text-white transition-colors hover:translate-x-1 inline-block">Contact</a></li>
              <li><a href="#" className="hover:text-white transition-colors hover:translate-x-1 inline-block">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors hover:translate-x-1 inline-block">Terms Of Service</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-[#ebe2cd]/30 mt-12 pt-8 text-center text-white/80">
          <p>&copy; 2026 NovaHealth. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
