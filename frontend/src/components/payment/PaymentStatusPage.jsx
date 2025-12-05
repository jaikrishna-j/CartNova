import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { FiLoader, FiCheckCircle, FiXCircle } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

const PaymentStatusPage = () => {
    const [searchParams] = useSearchParams();
    const [status, setStatus] = useState('verifying');
    const [orderRef, setOrderRef] = useState(null);

    useEffect(() => {
        const paymentStatus = searchParams.get('status');
        const paymentRef = searchParams.get('ref');
        setOrderRef(paymentRef);

        const timer = setTimeout(() => {
            if (paymentStatus === 'success') {
                setStatus('success');
            } else if (paymentStatus === 'failure') {
                setStatus('failure');
            } else {
                setStatus('failure');
            }
        }, 1500);

        return () => clearTimeout(timer);
    }, [searchParams]);

    // Define animation variants
    const cardVariants = {
        hidden: { opacity: 0, scale: 0.9 },
        visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: "easeOut" } },
        exit: { opacity: 0, scale: 0.9, transition: { duration: 0.3, ease: "easeIn" } }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1, transition: { duration: 0.5, ease: "easeOut" } }
    };

    let statusContent;

    // Define content based on status
    switch (status) {
        case 'success':
            statusContent = {
                icon: <FiCheckCircle className="text-6xl text-green-500" />,
                title: 'Payment Successful!',
                message: `Your order (Ref: ${orderRef || 'N/A'}) has been confirmed. Thank you!`,
                // --- FIX: Replaced placeholder with actual JSX ---
                actions: (
                    <>
                        <motion.div variants={itemVariants}>
                            <Link to="/profile" className="inline-block w-full sm:w-auto bg-indigo-600 text-white font-semibold rounded-xl px-6 py-3 transition duration-300 hover:bg-indigo-700 shadow-lg transform hover:scale-105">
                                View Order Details
                            </Link>
                        </motion.div>
                        <motion.div variants={itemVariants}>
                            <Link to="/store" className="inline-block w-full sm:w-auto bg-gray-200 text-gray-800 font-semibold rounded-xl px-6 py-3 transition duration-300 hover:bg-gray-300">
                                Continue Shopping
                            </Link>
                        </motion.div>
                    </>
                )
                // --- End Fix ---
            };
            break;
        case 'failure':
            statusContent = {
                icon: <FiXCircle className="text-6xl text-red-500" />,
                title: 'Payment Failed',
                message: `There was an issue processing your payment (Ref: ${orderRef || 'N/A'}). Please try again.`,
                // --- FIX: Replaced placeholder with actual JSX ---
                actions: (
                     <>
                         <motion.div variants={itemVariants}>
                             <Link to="/checkout" className="inline-block w-full sm:w-auto bg-indigo-600 text-white font-semibold rounded-xl px-6 py-3 transition duration-300 hover:bg-indigo-700 shadow-lg transform hover:scale-105">
                                 Try Again
                             </Link>
                         </motion.div>
                         <motion.div variants={itemVariants}>
                             <Link to="/" className="inline-block w-full sm:w-auto bg-gray-200 text-gray-800 font-semibold rounded-xl px-6 py-3 transition duration-300 hover:bg-gray-300">
                                 Continue Shopping
                             </Link>
                         </motion.div>
                     </>
                )
                 // --- End Fix ---
            };
            break;
        default: // 'verifying'
            statusContent = {
                icon: <FiLoader className="text-6xl text-indigo-500 animate-spin" />,
                title: 'Processing Payment...',
                message: 'Checking payment status. Please wait a moment.',
                actions: null
            };
            break;
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
            <AnimatePresence mode="wait">
                <motion.div
                    key={status}
                    className="w-full max-w-lg mx-auto bg-white rounded-2xl shadow-2xl flex flex-col items-center text-center p-8 md:p-12"
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                >
                    <motion.div className="mb-6" variants={itemVariants}>
                        {statusContent.icon}
                    </motion.div>
                    <motion.h1
                        className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3"
                        variants={itemVariants}
                    >
                        {statusContent.title}
                    </motion.h1>
                    <motion.p
                        className="text-gray-600 mb-8 max-w-md"
                        variants={itemVariants}
                    >
                        {statusContent.message}
                    </motion.p>
                    {statusContent.actions && (
                        <motion.div
                            className="flex flex-col sm:flex-row justify-center gap-4 w-full mt-4"
                            initial="hidden"
                            animate="visible"
                            variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
                         >
                            {statusContent.actions}
                        </motion.div>
                    )}
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

export default PaymentStatusPage;