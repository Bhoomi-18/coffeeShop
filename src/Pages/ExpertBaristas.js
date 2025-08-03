import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion'; 


const ExpertContainer = styled.div`
  padding: 6rem 2rem;
  max-width: 1200px;
  margin: 0 auto;
  background: linear-gradient(135deg, #fffbeb 0%, #fef2dc 100%);
  border-radius: 15px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    padding: 4rem 1rem;
  }
`;

const FeatureTitle = styled(motion.h1)`
  font-size: 3.5rem;
  margin-bottom: 2rem;
  color: #5b342d;
  font-family: 'Playfair Display', serif;
  text-align: center;
  font-weight: 700;

  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const BaristaCardsContainer = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 2rem;
  margin-top: 3rem;
`;

const BaristaCard = styled(motion.div)`
  background: white;
  border-radius: 15px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  width: 300px;
  overflow: hidden;
  text-align: center;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.05);
  }
`;

const BaristaImage = styled.img`
  width: 100%;
  height: 290px;
  object-fit: cover;
`;

const BaristaContent = styled.div`
  padding: 1.5rem;
`;

const BaristaName = styled.h2`
  font-size: 1.8rem;
  color: #5b342d;
  margin-bottom: 0.5rem;
`;

const BaristaExpertise = styled.p`
  font-size: 1.2rem;
  color: #d2691e;
  margin-bottom: 1rem;
  font-weight: 600;
`;

const BaristaDescription = styled.p`
  font-size: 1rem;
  color: #6b4423;
  line-height: 1.5;
`;

const ChatContainer = styled.div`
  position: fixed;
  bottom: 5rem;
  right: 2rem;
  background: white;
  border-radius: 15px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  max-width: 300px;
  width: 100%;
  overflow: hidden;
  z-index: 1000;
`;

const ChatHeader = styled.div`
  background: #5b342d;
  color: white;
  padding: 1rem;
  font-size: 1.2rem;
  font-weight: bold;
  cursor: pointer;
`;

const ChatBody = styled.div`
  padding: 1rem;
  height: 300px;
  overflow-y: auto;
  display: ${(props) => (props.isOpen ? 'block' : 'none')};
`;

const ChatInputContainer = styled.div`
  display: flex;
  padding: 1rem;
  border-top: 1px solid #ddd;
`;

const ChatInput = styled.input`
  flex: 1;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 1rem;
`;

const SendButton = styled.button`
  background: #5b342d;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  margin-left: 0.5rem;
  border-radius: 5px;
  cursor: pointer;
`;

const ChatMessage = styled.div`
  margin-bottom: 1rem;
  color: ${(props) => (props.isUser ? '#5b342d' : '#6b4423')};
  font-weight: ${(props) => (props.isUser ? 'bold' : 'normal')};
`;

function ExpertBaristas() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [userMessage, setUserMessage] = useState('');

  const baristas = [
    {
      name: 'Sophie Martinez',
      expertise: 'Latte Art Specialist',
      description: 'Sophia creates stunning latte art and can teach you how to craft beautiful designs.',
      image: 'https://images.pexels.com/photos/4349736/pexels-photo-4349736.jpeg?auto=compress&cs=tinysrgb&w=600',
    },
    {
      name: 'James White',
      expertise: 'Espresso Expert',
      description: 'James knows everything about pulling the perfect espresso shot.',
      image: 'https://images.pexels.com/photos/980074/pexels-photo-980074.jpeg?auto=compress&cs=tinysrgb&w=600',
    },
    {
      name: 'Emily Chen',
      expertise: 'Pour Over Master',
      description: 'Emily is skilled in manual brewing techniques like pour-over and Chemex.',
      image: 'https://images.pexels.com/photos/4350057/pexels-photo-4350057.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    },
  ];

  const handleSendMessage = async () => {
    if (!userMessage.trim()) return;

    const newMessages = [...chatMessages, { text: userMessage, isUser: true }];
    setChatMessages(newMessages);
    setUserMessage('');

    // Mock API call for chat response
    const response = `Thank you for asking! Here's some advice: ${userMessage}`;
    setChatMessages((prev) => [...prev, { text: response, isUser: false }]);
  };

  return (
    <>
      <ExpertContainer>
        <FeatureTitle
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Meet Our Expert Baristas
        </FeatureTitle>
        <BaristaCardsContainer>
          {baristas.map((barista, index) => (
            <BaristaCard key={index}>
              <BaristaImage src={barista.image} alt={barista.name} />
              <BaristaContent>
                <BaristaName>{barista.name}</BaristaName>
                <BaristaExpertise>{barista.expertise}</BaristaExpertise>
                <BaristaDescription>{barista.description}</BaristaDescription>
              </BaristaContent>
            </BaristaCard>
          ))}
        </BaristaCardsContainer>
      </ExpertContainer>

      {/* Chat Component */}
      <ChatContainer>
        <ChatHeader onClick={() => setIsChatOpen(!isChatOpen)}>
          {isChatOpen ? '❌' : 'Chat with a Barista 💬'}
        </ChatHeader>
        <ChatBody isOpen={isChatOpen}>
          {chatMessages.map((msg, index) => (
            <ChatMessage key={index} isUser={msg.isUser}>
              {msg.text}
            </ChatMessage>
          ))}
        </ChatBody>
        {isChatOpen && (
          <ChatInputContainer>
            <ChatInput
              type="text"
              placeholder="Type your message..."
              value={userMessage}
              onChange={(e) => setUserMessage(e.target.value)}
            />
            <SendButton onClick={handleSendMessage}>Send</SendButton>
          </ChatInputContainer>
        )}
      </ChatContainer>
    </>
  );
}

export default ExpertBaristas;
