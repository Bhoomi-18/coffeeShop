import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';


const FAQContainer = styled.div`
  padding: 6rem 2rem 4rem 2rem;
  max-width: 1200px;
  margin: 0 auto;
  background-color: #fffbeb;
  box-shadow: 1px 1px 5px 6px #888888;
`;

const FAQHeading = styled(motion.h1)`
  font-size: 2.5rem;
  margin-bottom: 2rem;
  text-align: center;
  color: #78350f;
  font-family: "Playfair Display", serif;
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  align-content: space-around;
  font-weight: bold;

  @media (max-width: 768px) {
    font-size: 2rem;
    text-align: center;
  }
`;

const FAQContent = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0;
  flex-direction: column;
  flex-wrap: wrap;
  align-content: center;
`;

const FAQItem = styled(motion.div)`
  background-color: white;
  padding: 2.5rem;
  border-radius: 8px;
  text-align: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
  margin-bottom: 2rem;
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 15px 40px rgba(0, 0, 0, 0.2);
    background-color: rgb(241, 224, 198); /* Coffee color */
  }
`;

const Question = styled(motion.h3)`
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: #78350f;
  font-family: "Playfair Display", serif;
  cursor: pointer;
  font-weight: 550;
  display: flex;
  align-items: center; /* Aligns text and arrow horizontally */
  justify-content: space-between; /* Distributes space between question text and arrow */
  width: 100%; /* Ensure the question occupies full width */
`;

const Answer = styled(motion.p)`
  font-size: 1.1rem;
  color: #6b4423;
  line-height: 1.6;
  font-family: 'Poppins', sans-serif;
  max-height: ${({ isOpen }) => (isOpen ? '300px' : '0')};
  overflow: hidden;
  transition: max-height 0.4s ease-out;
`;

function FAQ() {
  
  const [openFAQ, setOpenFAQ] = useState(null); // State to track the currently open FAQ

  const toggleFAQ = (index) => {
    setOpenFAQ(openFAQ === index ? null : index); // Toggle the FAQ or close if clicked again
  };

  return (
    
    <FAQContainer>
      <FAQHeading
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Frequently Asked Questions (FAQs)
      </FAQHeading>
      <FAQContent>
        <FAQItem
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          onClick={() => toggleFAQ(1)}
        >
          <Question
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            How do I place an order?
          </Question>
          <Answer isOpen={openFAQ === 1}> {/* Pass the isOpen prop */}
          To place an order, browse our collection and click the 'Add to Cart' button. When you're ready, proceed to checkout.
        </Answer>

        </FAQItem>
        <FAQItem
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          onClick={() => toggleFAQ(2)}
        >
          <Question
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 , delay: 0.4 }}
          >
            Can I modify my order after placing it?
          </Question>
          <Answer isOpen={openFAQ === 2}>
            Unfortunately, once an order is placed, it cannot be modified. However, you can cancel it and place a new one if needed.
          </Answer>
        </FAQItem>
        <FAQItem
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          onClick={() => toggleFAQ(3)}
        >
          <Question
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            What payment methods do you accept?
          </Question>
          <Answer isOpen={openFAQ === 3}>
            We accept various payment methods including credit cards, PayPal, and bank transfers.
          </Answer>
        </FAQItem>
        <FAQItem
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          onClick={() => toggleFAQ(4)}
        >
          <Question
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            How can I track my order?
          </Question>
          <Answer isOpen={openFAQ === 4}>
            After your order is shipped, you will receive a tracking number via email to monitor your shipment.
          </Answer>
        </FAQItem>
      </FAQContent>
    </FAQContainer>
  );
}

export default FAQ;
