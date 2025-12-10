import React, { useState } from 'react';
import { FaEnvelope, FaMapMarkerAlt, FaLinkedinIn } from 'react-icons/fa';
import toast from 'react-hot-toast';
import api from '@/api';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await api.post('/contact/', formData);
      if (response.status === 200 || response.status === 201) {
        toast.success('Thank you for your message! We will get back to you within 24 hours.');
        setFormData({ name: '', email: '', subject: '', message: '' });
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error(error.response?.data?.error || 'Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className='bg-white min-h-screen'>
      <div className='max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 md:py-10'>
        {/* Header */}
        <div className='text-center mb-6 sm:mb-8'>
          <h1 className='text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 mb-3 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent'>
            Contact Us
          </h1>
          <p className='text-base sm:text-lg text-gray-600'>
            We'd love to hear from you. Get in touch with us!
          </p>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8'>
          {/* Contact Information */}
          <div className='space-y-4 sm:space-y-5'>
            <div className='bg-gray-50 rounded-xl p-4 sm:p-6 shadow-md'>
              <h2 className='text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-5'>Get in Touch</h2>
              
              <div className='space-y-4 sm:space-y-5'>
                {/* Email */}
                <div className='flex items-start'>
                  <div className='bg-indigo-100 rounded-lg p-2.5 sm:p-3 mr-3 sm:mr-4 flex-shrink-0'>
                    <FaEnvelope className='text-indigo-600 text-lg sm:text-xl' />
                  </div>
                  <div className='min-w-0'>
                    <h3 className='font-semibold text-gray-900 mb-1 text-sm sm:text-base'>Email</h3>
                    <a 
                      href='mailto:jaikrishnajaisankar2005@gmail.com' 
                      className='text-indigo-600 hover:text-indigo-700 hover:underline text-sm sm:text-base break-words'
                    >
                      jaikrishnajaisankar2005@gmail.com
                    </a>
                  </div>
                </div>

                {/* Location */}
                <div className='flex items-start'>
                  <div className='bg-indigo-100 rounded-lg p-2.5 sm:p-3 mr-3 sm:mr-4 flex-shrink-0'>
                    <FaMapMarkerAlt className='text-indigo-600 text-lg sm:text-xl' />
                  </div>
                  <div>
                    <h3 className='font-semibold text-gray-900 mb-1 text-sm sm:text-base'>Location</h3>
                    <p className='text-gray-600 text-sm sm:text-base'>India</p>
                  </div>
                </div>

                {/* Social Media */}
                <div className='flex items-start'>
                  <div className='bg-indigo-100 rounded-lg p-2.5 sm:p-3 mr-3 sm:mr-4 flex-shrink-0'>
                    <FaLinkedinIn className='text-indigo-600 text-lg sm:text-xl' />
                  </div>
                  <div>
                    <h3 className='font-semibold text-gray-900 mb-2 text-sm sm:text-base'>Connect With Us</h3>
                    <div className='flex flex-col sm:flex-row sm:space-x-4 space-y-1 sm:space-y-0'>
                      <a 
                        href='https://www.linkedin.com/in/jaikrishna-j/' 
                        target='_blank' 
                        rel='noopener noreferrer'
                        className='text-indigo-600 hover:text-indigo-700 hover:underline text-sm sm:text-base'
                      >
                        LinkedIn
                      </a>
                      <a 
                        href='https://github.com/jaikrishna-j' 
                        target='_blank' 
                        rel='noopener noreferrer'
                        className='text-indigo-600 hover:text-indigo-700 hover:underline text-sm sm:text-base'
                      >
                        GitHub
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Business Hours */}
            <div className='bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-4 sm:p-6 shadow-lg text-white'>
              <h2 className='text-xl sm:text-2xl font-bold mb-3 sm:mb-4'>Business Hours</h2>
              <div className='space-y-1.5 sm:space-y-2 text-sm sm:text-base'>
                <p><strong>Monday - Friday:</strong> 9:00 AM - 6:00 PM</p>
                <p><strong>Saturday:</strong> 10:00 AM - 4:00 PM</p>
                <p><strong>Sunday:</strong> Closed</p>
              </div>
              <p className='mt-3 sm:mt-4 text-indigo-100 text-sm sm:text-base'>
                We typically respond to inquiries within 24-48 hours.
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <div className='bg-white rounded-xl p-4 sm:p-6 shadow-md border border-gray-200'>
            <h2 className='text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-5'>Send us a Message</h2>
            <form onSubmit={handleSubmit} className='space-y-4'>
              <div>
                <label htmlFor='name' className='block text-sm font-medium text-gray-700 mb-1.5'>
                  Your Name *
                </label>
                <input
                  type='text'
                  id='name'
                  name='name'
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className='w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition text-sm sm:text-base'
                  placeholder='Enter your name'
                />
              </div>

              <div>
                <label htmlFor='email' className='block text-sm font-medium text-gray-700 mb-1.5'>
                  Your Email *
                </label>
                <input
                  type='email'
                  id='email'
                  name='email'
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className='w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition text-sm sm:text-base'
                  placeholder='your.email@example.com'
                />
              </div>

              <div>
                <label htmlFor='subject' className='block text-sm font-medium text-gray-700 mb-1.5'>
                  Subject *
                </label>
                <input
                  type='text'
                  id='subject'
                  name='subject'
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className='w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition text-sm sm:text-base'
                  placeholder='What is this regarding?'
                />
              </div>

              <div>
                <label htmlFor='message' className='block text-sm font-medium text-gray-700 mb-1.5'>
                  Message *
                </label>
                <textarea
                  id='message'
                  name='message'
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className='w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition resize-none text-sm sm:text-base'
                  placeholder='Tell us how we can help you...'
                />
              </div>

              <button
                type='submit'
                disabled={isSubmitting}
                className='w-full bg-indigo-600 text-white font-semibold py-2.5 sm:py-3 px-6 rounded-xl hover:bg-indigo-700 transition duration-300 shadow-md hover:shadow-lg disabled:bg-gray-400 disabled:cursor-not-allowed text-sm sm:text-base border-none outline-none'
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;

