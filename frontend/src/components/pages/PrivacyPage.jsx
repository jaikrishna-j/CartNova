import React from 'react';
import { Link } from 'react-router-dom';

const PrivacyPage = () => {
  return (
    <div className='bg-white min-h-screen'>
      <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12'>
        {/* Header */}
        <div className='text-center mb-8 sm:mb-12'>
          <h1 className='text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent'>
            Privacy Policy
          </h1>
          <p className='text-sm sm:text-base text-gray-500'>
            Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        {/* Content */}
        <div className='space-y-8'>
          {/* Introduction */}
          <section className='bg-gray-50 rounded-xl p-6 sm:p-8 shadow-md'>
            <h2 className='text-2xl sm:text-3xl font-bold text-gray-900 mb-4'>1. Introduction</h2>
            <p className='text-gray-700 leading-relaxed text-base sm:text-lg mb-4'>
              At CartNova, we are committed to protecting your privacy and ensuring the security 
              of your personal information. This Privacy Policy explains how we collect, use, 
              disclose, and safeguard your information when you use our e-commerce platform.
            </p>
            <p className='text-gray-700 leading-relaxed text-base sm:text-lg'>
              By using CartNova, you consent to the data practices described in this policy. 
              We may update this Privacy Policy from time to time, and we will notify you of 
              any significant changes.
            </p>
          </section>

          {/* Information We Collect */}
          <section className='bg-white rounded-xl p-6 sm:p-8 shadow-md border border-gray-200'>
            <h2 className='text-2xl sm:text-3xl font-bold text-gray-900 mb-4'>2. Information We Collect</h2>
            
            <h3 className='text-xl font-semibold text-gray-900 mb-3 mt-4'>Personal Information</h3>
            <ul className='space-y-2 text-gray-700 text-base sm:text-lg mb-4'>
              <li className='flex items-start'>
                <span className='text-indigo-600 font-bold mr-3'>•</span>
                <span>Name, email address, phone number, and shipping address</span>
              </li>
              <li className='flex items-start'>
                <span className='text-indigo-600 font-bold mr-3'>•</span>
                <span>Payment information (processed securely through third-party payment gateways)</span>
              </li>
              <li className='flex items-start'>
                <span className='text-indigo-600 font-bold mr-3'>•</span>
                <span>Account credentials and preferences</span>
              </li>
            </ul>

            <h3 className='text-xl font-semibold text-gray-900 mb-3 mt-4'>Usage Information</h3>
            <ul className='space-y-2 text-gray-700 text-base sm:text-lg'>
              <li className='flex items-start'>
                <span className='text-indigo-600 font-bold mr-3'>•</span>
                <span>Browsing history and product interactions</span>
              </li>
              <li className='flex items-start'>
                <span className='text-indigo-600 font-bold mr-3'>•</span>
                <span>Device information, IP address, and browser type</span>
              </li>
              <li className='flex items-start'>
                <span className='text-indigo-600 font-bold mr-3'>•</span>
                <span>Cookies and similar tracking technologies</span>
              </li>
            </ul>
          </section>

          {/* How We Use Information */}
          <section className='bg-gray-50 rounded-xl p-6 sm:p-8 shadow-md'>
            <h2 className='text-2xl sm:text-3xl font-bold text-gray-900 mb-4'>3. How We Use Your Information</h2>
            <ul className='space-y-3 text-gray-700 text-base sm:text-lg'>
              <li className='flex items-start'>
                <span className='text-indigo-600 font-bold mr-3'>✓</span>
                <span><strong>Order Processing:</strong> To process and fulfill your orders, manage payments, and handle returns.</span>
              </li>
              <li className='flex items-start'>
                <span className='text-indigo-600 font-bold mr-3'>✓</span>
                <span><strong>Account Management:</strong> To create and manage your account, authenticate users, and provide customer support.</span>
              </li>
              <li className='flex items-start'>
                <span className='text-indigo-600 font-bold mr-3'>✓</span>
                <span><strong>Personalization:</strong> To provide personalized product recommendations and improve your shopping experience.</span>
              </li>
              <li className='flex items-start'>
                <span className='text-indigo-600 font-bold mr-3'>✓</span>
                <span><strong>Communication:</strong> To send order confirmations, shipping updates, and respond to your inquiries.</span>
              </li>
              <li className='flex items-start'>
                <span className='text-indigo-600 font-bold mr-3'>✓</span>
                <span><strong>Analytics:</strong> To analyze usage patterns, improve our platform, and develop new features.</span>
              </li>
              <li className='flex items-start'>
                <span className='text-indigo-600 font-bold mr-3'>✓</span>
                <span><strong>Security:</strong> To detect and prevent fraud, unauthorized access, and other security threats.</span>
              </li>
            </ul>
          </section>

          {/* Information Sharing */}
          <section className='bg-white rounded-xl p-6 sm:p-8 shadow-md border border-gray-200'>
            <h2 className='text-2xl sm:text-3xl font-bold text-gray-900 mb-4'>4. Information Sharing and Disclosure</h2>
            <p className='text-gray-700 leading-relaxed text-base sm:text-lg mb-4'>
              We do not sell your personal information. We may share your information only in the following circumstances:
            </p>
            <ul className='space-y-3 text-gray-700 text-base sm:text-lg'>
              <li className='flex items-start'>
                <span className='text-indigo-600 font-bold mr-3'>•</span>
                <span><strong>Service Providers:</strong> With trusted third-party service providers who assist in operations (payment processing, shipping, analytics).</span>
              </li>
              <li className='flex items-start'>
                <span className='text-indigo-600 font-bold mr-3'>•</span>
                <span><strong>Legal Requirements:</strong> When required by law, court order, or government regulation.</span>
              </li>
              <li className='flex items-start'>
                <span className='text-indigo-600 font-bold mr-3'>•</span>
                <span><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets.</span>
              </li>
              <li className='flex items-start'>
                <span className='text-indigo-600 font-bold mr-3'>•</span>
                <span><strong>With Your Consent:</strong> When you explicitly authorize us to share your information.</span>
              </li>
            </ul>
          </section>

          {/* Data Security */}
          <section className='bg-gray-50 rounded-xl p-6 sm:p-8 shadow-md'>
            <h2 className='text-2xl sm:text-3xl font-bold text-gray-900 mb-4'>5. Data Security</h2>
            <p className='text-gray-700 leading-relaxed text-base sm:text-lg mb-4'>
              We implement industry-standard security measures to protect your personal information:
            </p>
            <ul className='space-y-3 text-gray-700 text-base sm:text-lg'>
              <li className='flex items-start'>
                <span className='text-green-600 font-bold mr-3'>🔒</span>
                <span>Encryption of sensitive data during transmission (SSL/TLS)</span>
              </li>
              <li className='flex items-start'>
                <span className='text-green-600 font-bold mr-3'>🔒</span>
                <span>Secure storage of data with access controls</span>
              </li>
              <li className='flex items-start'>
                <span className='text-green-600 font-bold mr-3'>🔒</span>
                <span>Regular security audits and updates</span>
              </li>
              <li className='flex items-start'>
                <span className='text-green-600 font-bold mr-3'>🔒</span>
                <span>Payment information is processed through PCI-DSS compliant payment gateways</span>
              </li>
            </ul>
            <p className='text-gray-700 leading-relaxed text-base sm:text-lg mt-4'>
              However, no method of transmission over the internet is 100% secure. While we strive 
              to protect your data, we cannot guarantee absolute security.
            </p>
          </section>

          {/* Your Rights */}
          <section className='bg-white rounded-xl p-6 sm:p-8 shadow-md border border-gray-200'>
            <h2 className='text-2xl sm:text-3xl font-bold text-gray-900 mb-4'>6. Your Rights and Choices</h2>
            <p className='text-gray-700 leading-relaxed text-base sm:text-lg mb-4'>
              You have the following rights regarding your personal information:
            </p>
            <ul className='space-y-3 text-gray-700 text-base sm:text-lg'>
              <li className='flex items-start'>
                <span className='text-indigo-600 font-bold mr-3'>✓</span>
                <span><strong>Access:</strong> Request access to your personal data</span>
              </li>
              <li className='flex items-start'>
                <span className='text-indigo-600 font-bold mr-3'>✓</span>
                <span><strong>Correction:</strong> Update or correct inaccurate information</span>
              </li>
              <li className='flex items-start'>
                <span className='text-indigo-600 font-bold mr-3'>✓</span>
                <span><strong>Deletion:</strong> Request deletion of your account and data</span>
              </li>
              <li className='flex items-start'>
                <span className='text-indigo-600 font-bold mr-3'>✓</span>
                <span><strong>Opt-out:</strong> Unsubscribe from marketing communications</span>
              </li>
              <li className='flex items-start'>
                <span className='text-indigo-600 font-bold mr-3'>✓</span>
                <span><strong>Cookie Controls:</strong> Manage cookie preferences through your browser settings</span>
              </li>
            </ul>
          </section>

          {/* Cookies */}
          <section className='bg-gray-50 rounded-xl p-6 sm:p-8 shadow-md'>
            <h2 className='text-2xl sm:text-3xl font-bold text-gray-900 mb-4'>7. Cookies and Tracking Technologies</h2>
            <p className='text-gray-700 leading-relaxed text-base sm:text-lg mb-4'>
              We use cookies and similar technologies to enhance your experience:
            </p>
            <ul className='space-y-2 text-gray-700 text-base sm:text-lg'>
              <li className='flex items-start'>
                <span className='text-indigo-600 font-bold mr-3'>•</span>
                <span><strong>Essential Cookies:</strong> Required for basic site functionality</span>
              </li>
              <li className='flex items-start'>
                <span className='text-indigo-600 font-bold mr-3'>•</span>
                <span><strong>Analytics Cookies:</strong> Help us understand how visitors use our site</span>
              </li>
              <li className='flex items-start'>
                <span className='text-indigo-600 font-bold mr-3'>•</span>
                <span><strong>Preference Cookies:</strong> Remember your settings and preferences</span>
              </li>
            </ul>
            <p className='text-gray-700 leading-relaxed text-base sm:text-lg mt-4'>
              You can control cookies through your browser settings, but this may affect site functionality.
            </p>
          </section>

          {/* Contact */}
          <section className='bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-6 sm:p-8 shadow-lg text-white'>
            <h2 className='text-2xl sm:text-3xl font-bold mb-4'>Questions About Privacy?</h2>
            <p className='text-indigo-100 mb-4 text-base sm:text-lg'>
              If you have questions or concerns about this Privacy Policy or wish to exercise your rights, please contact us.
            </p>
            <Link
              to='/contact'
              className='inline-block px-6 py-3 bg-white text-indigo-600 font-semibold rounded-lg hover:bg-gray-100 transition duration-300'
            >
              Contact Us
            </Link>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPage;

