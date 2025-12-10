import React from 'react';
import { Link } from 'react-router-dom';

const AboutPage = () => {
  return (
    <div className='bg-white min-h-screen'>
      <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12'>
        {/* Header */}
        <div className='text-center mb-8 sm:mb-12'>
          <h1 className='text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent'>
            About CartNova
          </h1>
          <p className='text-lg sm:text-xl text-gray-600'>
            Your Trusted E-Commerce Partner
          </p>
        </div>

        {/* Main Content */}
        <div className='space-y-8 sm:space-y-10'>
          {/* Mission Section */}
          <section className='bg-gray-50 rounded-xl p-6 sm:p-8 shadow-md'>
            <h2 className='text-2xl sm:text-3xl font-bold text-gray-900 mb-4'>Our Mission</h2>
            <p className='text-gray-700 leading-relaxed text-base sm:text-lg'>
              At CartNova, we are dedicated to revolutionizing the online shopping experience. 
              Our mission is to provide customers with a seamless, secure, and enjoyable platform 
              to discover and purchase high-quality products from the comfort of their homes. We 
              believe in making e-commerce accessible, convenient, and trustworthy for everyone.
            </p>
          </section>

          {/* Vision Section */}
          <section className='bg-white rounded-xl p-6 sm:p-8 shadow-md border border-gray-200'>
            <h2 className='text-2xl sm:text-3xl font-bold text-gray-900 mb-4'>Our Vision</h2>
            <p className='text-gray-700 leading-relaxed text-base sm:text-lg'>
              We envision a future where online shopping is not just a transaction, but an 
              experience that brings joy and satisfaction to every customer. CartNova aims to 
              become the leading e-commerce platform by continuously innovating, improving our 
              services, and building lasting relationships with our customers and partners.
            </p>
          </section>

          {/* What We Offer Section */}
          <section className='bg-indigo-50 rounded-xl p-6 sm:p-8 shadow-md'>
            <h2 className='text-2xl sm:text-3xl font-bold text-gray-900 mb-4'>What We Offer</h2>
            <ul className='space-y-3 text-gray-700 text-base sm:text-lg'>
              <li className='flex items-start'>
                <span className='text-indigo-600 font-bold mr-3'>✓</span>
                <span><strong>Wide Product Range:</strong> From electronics to fashion, home essentials to beauty products, we offer an extensive catalog to meet all your needs.</span>
              </li>
              <li className='flex items-start'>
                <span className='text-indigo-600 font-bold mr-3'>✓</span>
                <span><strong>Secure Shopping:</strong> Your security is our priority. We use advanced encryption and secure payment gateways to protect your transactions.</span>
              </li>
              <li className='flex items-start'>
                <span className='text-indigo-600 font-bold mr-3'>✓</span>
                <span><strong>Smart Recommendations:</strong> Our AI-powered recommendation system helps you discover products tailored to your preferences.</span>
              </li>
              <li className='flex items-start'>
                <span className='text-indigo-600 font-bold mr-3'>✓</span>
                <span><strong>Easy Navigation:</strong> Intuitive search and filtering options make finding products quick and effortless.</span>
              </li>
              <li className='flex items-start'>
                <span className='text-indigo-600 font-bold mr-3'>✓</span>
                <span><strong>Customer Support:</strong> Our dedicated support team is always ready to assist you with any queries or concerns.</span>
              </li>
            </ul>
          </section>

          {/* Technology Section */}
          <section className='bg-white rounded-xl p-6 sm:p-8 shadow-md border border-gray-200'>
            <h2 className='text-2xl sm:text-3xl font-bold text-gray-900 mb-4'>Built with Modern Technology</h2>
            <p className='text-gray-700 leading-relaxed text-base sm:text-lg mb-4'>
              CartNova is built using cutting-edge web technologies to ensure fast, reliable, 
              and secure performance. We leverage advanced algorithms for product recommendations 
              and search functionality, making your shopping experience smooth and personalized.
            </p>
            <p className='text-gray-700 leading-relaxed text-base sm:text-lg'>
              Our platform is continuously updated and improved to incorporate the latest 
              technological advancements and best practices in e-commerce.
            </p>
          </section>

          {/* Values Section */}
          <section className='bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-6 sm:p-8 shadow-lg text-white'>
            <h2 className='text-2xl sm:text-3xl font-bold mb-4'>Our Core Values</h2>
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
              <div>
                <h3 className='font-bold text-lg mb-2'>Customer First</h3>
                <p className='text-indigo-100'>Every decision we make prioritizes customer satisfaction and experience.</p>
              </div>
              <div>
                <h3 className='font-bold text-lg mb-2'>Integrity</h3>
                <p className='text-indigo-100'>We conduct business with honesty, transparency, and ethical practices.</p>
              </div>
              <div>
                <h3 className='font-bold text-lg mb-2'>Innovation</h3>
                <p className='text-indigo-100'>We constantly seek new ways to improve and enhance our platform.</p>
              </div>
              <div>
                <h3 className='font-bold text-lg mb-2'>Quality</h3>
                <p className='text-indigo-100'>We are committed to offering only the best products and services.</p>
              </div>
            </div>
          </section>

          {/* Call to Action */}
          <div className='text-center pt-6'>
            <Link
              to='/store'
              className='inline-block px-6 sm:px-8 py-3 sm:py-4 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition duration-300 shadow-lg hover:shadow-xl text-base sm:text-lg'
            >
              Start Shopping Now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;

