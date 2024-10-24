import React from 'react';
import './FAQSection.css'; // Create a CSS file for styling

const FAQSection = () => {
  const faqs = [
    {
      question: 'What is your return policy?',
      answer: 'Our return policy lasts 30 days. If 30 days have gone by since your purchase, we cannot offer you a refund or exchange.',
    },
    {
      question: 'How can I track my order?',
      answer: 'You can track your order using the tracking number sent to your email after shipment.',
    },
    {
      question: 'Do you ship internationally?',
      answer: 'Yes, we ship to select countries worldwide. Please check our shipping policy for more details.',
    },
    {
      question: 'Can I change my order?',
      answer: 'If you need to change your order, please contact us as soon as possible. We can accommodate changes before the order has been shipped.',
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards, PayPal, and bank transfers.',
    },
    {
      question: 'How do I cancel my subscription?',
      answer: 'You can cancel your subscription by going to your account settings and selecting "Cancel Subscription."',
    },
    {
      question: 'How do I contact customer support?',
      answer: 'You can reach us at support@example.com or call our hotline at +123-456-7890.',
    },
    {
      question: 'Do you offer gift cards?',
      answer: 'Yes, we offer digital gift cards which can be purchased and used online.',
    },
  ];

  return (
    <div className="faq-section">
      <h2>Frequently Asked Questions</h2>
      <ul>
        {faqs.map((faq, index) => (
          <li key={index}>
            <strong>{faq.question}</strong>
            <p>{faq.answer}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FAQSection;
