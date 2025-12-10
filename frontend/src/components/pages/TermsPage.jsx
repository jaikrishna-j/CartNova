import React from 'react';
import { Link } from 'react-router-dom';

const TermsPage = () => {
  return (
    <div className='bg-white min-h-screen'>
      <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12'>
        {/* Header */}
        <div className='text-center mb-8 sm:mb-12'>
          <h1 className='text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent'>
            Terms & Conditions
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
              Welcome to CartNova. These Terms and Conditions ("Terms") govern your use of our 
              e-commerce platform and services. By accessing or using CartNova, you agree to be 
              bound by these Terms. If you do not agree with any part of these Terms, please do 
              not use our services.
            </p>
            <p className='text-gray-700 leading-relaxed text-base sm:text-lg'>
              CartNova reserves the right to modify these Terms at any time. Your continued use 
              of the platform after changes are posted constitutes your acceptance of the modified Terms.
            </p>
          </section>

          {/* Account Terms */}
          <section className='bg-white rounded-xl p-6 sm:p-8 shadow-md border border-gray-200'>
            <h2 className='text-2xl sm:text-3xl font-bold text-gray-900 mb-4'>2. Account Registration</h2>
            <ul className='space-y-3 text-gray-700 text-base sm:text-lg'>
              <li className='flex items-start'>
                <span className='text-indigo-600 font-bold mr-3'>•</span>
                <span>You must be at least 18 years old to create an account and make purchases.</span>
              </li>
              <li className='flex items-start'>
                <span className='text-indigo-600 font-bold mr-3'>•</span>
                <span>You are responsible for maintaining the confidentiality of your account credentials.</span>
              </li>
              <li className='flex items-start'>
                <span className='text-indigo-600 font-bold mr-3'>•</span>
                <span>You agree to provide accurate, current, and complete information during registration.</span>
              </li>
              <li className='flex items-start'>
                <span className='text-indigo-600 font-bold mr-3'>•</span>
                <span>You are responsible for all activities that occur under your account.</span>
              </li>
            </ul>
          </section>

          {/* Products and Pricing */}
          <section className='bg-gray-50 rounded-xl p-6 sm:p-8 shadow-md'>
            <h2 className='text-2xl sm:text-3xl font-bold text-gray-900 mb-4'>3. Products and Pricing</h2>
            <ul className='space-y-3 text-gray-700 text-base sm:text-lg'>
              <li className='flex items-start'>
                <span className='text-indigo-600 font-bold mr-3'>•</span>
                <span>We strive to display accurate product information, including descriptions, images, and prices.</span>
              </li>
              <li className='flex items-start'>
                <span className='text-indigo-600 font-bold mr-3'>•</span>
                <span>Prices are subject to change without notice. The price at checkout is the final price.</span>
              </li>
              <li className='flex items-start'>
                <span className='text-indigo-600 font-bold mr-3'>•</span>
                <span>Product availability is subject to change. We reserve the right to limit quantities.</span>
              </li>
              <li className='flex items-start'>
                <span className='text-indigo-600 font-bold mr-3'>•</span>
                <span>We reserve the right to refuse or cancel any order at our discretion.</span>
              </li>
            </ul>
          </section>

          {/* Payment Terms */}
          <section className='bg-white rounded-xl p-6 sm:p-8 shadow-md border border-gray-200'>
            <h2 className='text-2xl sm:text-3xl font-bold text-gray-900 mb-4'>4. Payment Terms</h2>
            <ul className='space-y-3 text-gray-700 text-base sm:text-lg'>
              <li className='flex items-start'>
                <span className='text-indigo-600 font-bold mr-3'>•</span>
                <span>Payment must be made at the time of purchase through our secure payment gateways.</span>
              </li>
              <li className='flex items-start'>
                <span className='text-indigo-600 font-bold mr-3'>•</span>
                <span>We accept various payment methods including credit/debit cards and digital wallets.</span>
              </li>
              <li className='flex items-start'>
                <span className='text-indigo-600 font-bold mr-3'>•</span>
                <span>All transactions are processed securely. We do not store your complete payment information.</span>
              </li>
              <li className='flex items-start'>
                <span className='text-indigo-600 font-bold mr-3'>•</span>
                <span>You agree to pay all charges incurred by your account, including applicable taxes.</span>
              </li>
            </ul>
          </section>

          {/* Returns and Refunds */}
          <section className='bg-gray-50 rounded-xl p-6 sm:p-8 shadow-md'>
            <h2 className='text-2xl sm:text-3xl font-bold text-gray-900 mb-4'>5. Returns and Refunds</h2>
            <ul className='space-y-3 text-gray-700 text-base sm:text-lg'>
              <li className='flex items-start'>
                <span className='text-indigo-600 font-bold mr-3'>•</span>
                <span>Returns must be initiated within 7 days of delivery.</span>
              </li>
              <li className='flex items-start'>
                <span className='text-indigo-600 font-bold mr-3'>•</span>
                <span>Products must be unused, in original packaging, and in the same condition as received.</span>
              </li>
              <li className='flex items-start'>
                <span className='text-indigo-600 font-bold mr-3'>•</span>
                <span>Refunds will be processed to the original payment method within 5-10 business days.</span>
              </li>
              <li className='flex items-start'>
                <span className='text-indigo-600 font-bold mr-3'>•</span>
                <span>Shipping costs for returns are the responsibility of the customer unless the product is defective.</span>
              </li>
            </ul>
          </section>

          {/* User Conduct */}
          <section className='bg-white rounded-xl p-6 sm:p-8 shadow-md border border-gray-200'>
            <h2 className='text-2xl sm:text-3xl font-bold text-gray-900 mb-4'>6. User Conduct</h2>
            <p className='text-gray-700 leading-relaxed text-base sm:text-lg mb-4'>
              You agree not to:
            </p>
            <ul className='space-y-2 text-gray-700 text-base sm:text-lg'>
              <li className='flex items-start'>
                <span className='text-red-600 font-bold mr-3'>✗</span>
                <span>Use the platform for any illegal or unauthorized purpose.</span>
              </li>
              <li className='flex items-start'>
                <span className='text-red-600 font-bold mr-3'>✗</span>
                <span>Attempt to gain unauthorized access to our systems or other users' accounts.</span>
              </li>
              <li className='flex items-start'>
                <span className='text-red-600 font-bold mr-3'>✗</span>
                <span>Interfere with or disrupt the platform's functionality.</span>
              </li>
              <li className='flex items-start'>
                <span className='text-red-600 font-bold mr-3'>✗</span>
                <span>Upload malicious code, viruses, or harmful content.</span>
              </li>
            </ul>
          </section>

          {/* Limitation of Liability */}
          <section className='bg-gray-50 rounded-xl p-6 sm:p-8 shadow-md'>
            <h2 className='text-2xl sm:text-3xl font-bold text-gray-900 mb-4'>7. Limitation of Liability</h2>
            <p className='text-gray-700 leading-relaxed text-base sm:text-lg'>
              CartNova shall not be liable for any indirect, incidental, special, or consequential 
              damages arising from your use of the platform. Our total liability shall not exceed 
              the amount you paid for the product in question.
            </p>
          </section>

          {/* Contact */}
          <section className='bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-6 sm:p-8 shadow-lg text-white'>
            <h2 className='text-2xl sm:text-3xl font-bold mb-4'>Questions About These Terms?</h2>
            <p className='text-indigo-100 mb-4 text-base sm:text-lg'>
              If you have any questions about these Terms & Conditions, please contact us.
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

export default TermsPage;

