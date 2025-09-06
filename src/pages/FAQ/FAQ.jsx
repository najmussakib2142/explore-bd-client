import React, { useState } from "react";
import emailjs from "@emailjs/browser";

const FAQ = () => {
    const faqs = [
        {
            question: "What is ExploreBD?",
            answer:
                "ExploreBD is your go-to platform for discovering trips, adventures, and travel communities across Bangladesh.",
        },
        {
            question: "How can I book a trip?",
            answer:
                "You can browse trips on our 'Trips' page, select the one you like, and follow the booking instructions provided for each package.",
        },
        {
            question: "Are the trip prices fixed?",
            answer:
                "Prices may vary depending on season, availability, and package inclusions. Always check the package details before booking.",
        },
        {
            question: "How do I contact support?",
            answer:
                "You can reach us via WhatsApp, email, or our contact form on the 'Contact' page. We aim to respond within 24 hours.",
        },
        {
            question: "Can I join the ExploreBD community?",
            answer:
                "Yes! Visit the 'Community' page to join discussions, share experiences, and connect with fellow travelers.",
        },
    ];

    const [openIndex, setOpenIndex] = useState(null);
    const [formData, setFormData] = useState({ name: "", email: "", question: "" });
    const [submitted, setSubmitted] = useState(false);

    const toggleFAQ = (index) => setOpenIndex(openIndex === index ? null : index);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = (e) => {
        e.preventDefault();

        emailjs
            .send(
                "YOUR_SERVICE_ID", // replace with your EmailJS service ID
                "YOUR_TEMPLATE_ID", // replace with your EmailJS template ID
                formData,
                "YOUR_PUBLIC_KEY" // replace with your EmailJS public key
            )
            .then(
                () => {
                    setSubmitted(true);
                    setFormData({ name: "", email: "", question: "" });
                },
                (error) => {
                    console.error("Failed to send email:", error);
                    alert("Failed to send message. Please try again later.");
                }
            );
    };

    return (
        <section className="bg-base-100 py-12 px-6 md:px-20">
            <div className="max-w-4xl mx-auto">
                <h2 className="text-3xl font-bold mb-8 text-center text-primary">
                    Frequently Asked Questions
                </h2>

                {/* FAQ Items */}
                <div className="space-y-4 mb-10">
                    {faqs.map((faq, index) => (
                        <div
                            key={index}
                            className="border border-gray-300 dark:border-gray-700 rounded-lg overflow-hidden"
                        >
                            <button
                                onClick={() => toggleFAQ(index)}
                                className="w-full text-left px-4 py-3 bg-gray-100 dark:bg-gray-800 flex justify-between items-center hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                            >
                                <span className="font-medium">{faq.question}</span>
                                <span className="text-xl">{openIndex === index ? "−" : "+"}</span>
                            </button>
                            {openIndex === index && (
                                <div className="px-4 py-3 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300">
                                    {faq.answer}
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Ask a Question Form */}
                <div className="border-t border-gray-300 dark:border-gray-700 pt-8">
                    <h3 className="text-2xl font-semibold mb-4 text-center md:text-left">
                        Have a Question? Ask Us!
                    </h3>

                    {submitted && (
                        <p className="text-green-600 dark:text-green-400 mb-4">
                            Thank you! Your question has been sent.
                        </p>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Your Name"
                            required
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200"
                        />
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Your Email"
                            required
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200"
                        />
                        <textarea
                            name="question"
                            value={formData.question}
                            onChange={handleChange}
                            placeholder="Your Question"
                            rows={4}
                            required
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200"
                        ></textarea>
                        <button
                            type="submit"
                            className="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
                        >
                            Send
                        </button>
                    </form>
                </div>
            </div>
        </section>
    );
};

export default FAQ;
