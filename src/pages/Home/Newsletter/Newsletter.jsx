import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaPaperPlane } from "react-icons/fa";

const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
    setEmail("");
    // 🔗 Integrate EmailJS / Firebase / API here if needed
  };

  return (
    <section className="relative py-20 bg-gradient-to-br from-primary to-secondary text-white overflow-hidden">
      {/* Decorative glowing circle */}
      <div className="absolute -top-20 -right-20 w-72 h-72 bg-white/10 rounded-full blur-3xl"></div>

      <div className="max-w-4xl mx-auto px-6 text-center relative z-10 font-roboto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="bg-white/20 p-4 rounded-full shadow-inner">
              <FaPaperPlane className="text-3xl text-white" />
            </div>
          </div>

          {/* Heading */}
          <h2 className="text-3xl md:text-4xl font-extrabold mb-3 tracking-wide">
            Subscribe & Stay Updated
          </h2>

          {/* Subtext */}
          <p className="text-base md:text-lg font-light text-gray-100/90 mb-10 max-w-2xl mx-auto leading-relaxed">
            Join the <span className="font-semibold text-white">ExploreBD</span> community
            and get exclusive travel updates, deals, and destination stories right in your inbox.
          </p>

          {/* Form or Success Message */}
          {!submitted ? (
            <form
              onSubmit={handleSubmit}
              className="flex flex-col sm:flex-row justify-center items-center gap-4"
            >
              <input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full sm:w-2/3 px-5 py-3 rounded-lg text-gray-900 font-medium placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white border border-white/40"
              />
              <button
                type="submit"
                className="bg-white text-primary font-semibold px-8 py-3 rounded-lg shadow-md hover:bg-gray-100 transition-transform transform hover:scale-105"
              >
                Subscribe
              </button>
            </form>
          ) : (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 text-lg text-white font-medium"
            >
              🎉 You’re all set! Thank you for joining the{" "}
              <span className="font-semibold text-white">ExploreBD</span> community.
            </motion.p>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default Newsletter;
