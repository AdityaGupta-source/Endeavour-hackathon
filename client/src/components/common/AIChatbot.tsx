import React, { useState, useRef, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { sendChatMessage, clearChatHistory } from '../../services/aiService';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

const pulse = keyframes`
  0%, 100% { box-shadow: 0 0 10px rgba(0, 255, 163, 0.4); }
  50% { box-shadow: 0 0 25px rgba(0, 255, 163, 0.8); }
`;

const dotBounce = keyframes`
  0%, 80%, 100% { transform: scale(0); }
  40% { transform: scale(1); }
`;

const ChatToggle = styled(motion.button)`
  position: fixed;
  bottom: 24px;
  right: 24px;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #00FFA3, #00C882);
  border: none;
  cursor: pointer;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: ${pulse} 2s ease-in-out infinite;
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.1);
  }
`;

const ChatIcon = styled.span`
  font-size: 26px;
  line-height: 1;
`;

const ChatWindow = styled(motion.div)`
  position: fixed;
  bottom: 96px;
  right: 24px;
  width: 380px;
  max-height: 520px;
  background: #0D1117;
  border: 1px solid #1E2D3D;
  border-radius: 16px;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5), 0 0 30px rgba(0, 255, 163, 0.1);

  @media (max-width: 480px) {
    width: calc(100vw - 32px);
    right: 16px;
    bottom: 88px;
    max-height: 70vh;
  }
`;

const ChatHeader = styled.div`
  background: linear-gradient(135deg, #0A0F16 0%, #131C28 100%);
  padding: 16px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #1E2D3D;
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const AIAvatar = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: linear-gradient(135deg, #00FFA3, #00F0FF);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
`;

const HeaderInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const HeaderTitle = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: #FFFFFF;
`;

const HeaderStatus = styled.span`
  font-size: 11px;
  color: #00FFA3;
  display: flex;
  align-items: center;
  gap: 4px;

  &::before {
    content: '';
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #00FFA3;
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: #A0AEC0;
  font-size: 20px;
  cursor: pointer;
  padding: 4px;
  line-height: 1;
  transition: color 0.2s;

  &:hover {
    color: #FFFFFF;
  }
`;

const MessagesContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-height: 300px;
  max-height: 340px;

  &::-webkit-scrollbar {
    width: 4px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background: #2D3748;
    border-radius: 4px;
  }
`;

const MessageBubble = styled.div<{ $isUser: boolean }>`
  max-width: 85%;
  padding: 10px 14px;
  border-radius: ${({ $isUser }) => $isUser ? '16px 16px 4px 16px' : '16px 16px 16px 4px'};
  background: ${({ $isUser }) => $isUser
    ? 'linear-gradient(135deg, #00FFA3, #00C882)'
    : '#1A2332'};
  color: ${({ $isUser }) => $isUser ? '#0A0F16' : '#E2E8F0'};
  align-self: ${({ $isUser }) => $isUser ? 'flex-end' : 'flex-start'};
  font-size: 13px;
  line-height: 1.5;
  word-break: break-word;
  box-shadow: ${({ $isUser }) => $isUser 
    ? '0 2px 8px rgba(0, 255, 163, 0.2)' 
    : '0 2px 8px rgba(0, 0, 0, 0.3)'};
`;

const TypingIndicator = styled.div`
  display: flex;
  gap: 4px;
  padding: 12px 16px;
  align-self: flex-start;
  background: #1A2332;
  border-radius: 16px 16px 16px 4px;

  span {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #00FFA3;
    animation: ${dotBounce} 1.4s ease-in-out infinite;

    &:nth-child(1) { animation-delay: -0.32s; }
    &:nth-child(2) { animation-delay: -0.16s; }
    &:nth-child(3) { animation-delay: 0s; }
  }
`;

const InputArea = styled.form`
  display: flex;
  gap: 8px;
  padding: 12px 16px;
  background: #0A0F16;
  border-top: 1px solid #1E2D3D;
`;

const ChatInput = styled.input`
  flex: 1;
  padding: 10px 14px;
  background: #131C28;
  border: 1px solid #2D3748;
  border-radius: 24px;
  color: #FFFFFF;
  font-size: 13px;
  outline: none;
  transition: border-color 0.2s;

  &:focus {
    border-color: #00FFA3;
  }

  &::placeholder {
    color: #4A5568;
  }
`;

const SendButton = styled.button`
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: linear-gradient(135deg, #00FFA3, #00C882);
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  flex-shrink: 0;

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 0 12px rgba(0, 255, 163, 0.4);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

const WelcomeMessage = styled.div`
  text-align: center;
  padding: 20px;
  color: #A0AEC0;
  font-size: 13px;
  line-height: 1.6;

  strong {
    color: #00FFA3;
    display: block;
    font-size: 15px;
    margin-bottom: 8px;
  }
`;

const QuickActions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  justify-content: center;
  margin-top: 12px;
`;

const QuickAction = styled.button`
  padding: 6px 12px;
  background: #131C28;
  border: 1px solid #2D3748;
  border-radius: 20px;
  color: #00FFA3;
  font-size: 11px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #1A2332;
    border-color: #00FFA3;
    box-shadow: 0 0 8px rgba(0, 255, 163, 0.2);
  }
`;

const AIChatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = async (text?: string) => {
    const messageText = text || inputValue.trim();
    if (!messageText || isTyping) return;

    const userMessage: Message = {
      id: Date.now(),
      text: messageText,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    try {
      const reply = await sendChatMessage(messageText);
      const aiMessage: Message = {
        id: Date.now() + 1,
        text: reply,
        sender: 'ai',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiMessage]);
    } catch {
      const errorMessage: Message = {
        id: Date.now() + 1,
        text: 'Sorry, I encountered an error. Please try again.',
        sender: 'ai',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage();
  };

  const handleToggle = () => {
    setIsOpen(!isOpen);
    if (isOpen) {
      // Optionally clear chat on close
      // clearChatHistory();
      // setMessages([]);
    }
  };

  const quickActions = [
    'How do I list materials?',
    'Pricing guidance',
    'What materials are in demand?',
    'How does verification work?',
  ];

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <ChatWindow
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
          >
            <ChatHeader>
              <HeaderLeft>
                <AIAvatar>🤖</AIAvatar>
                <HeaderInfo>
                  <HeaderTitle>ReValue AI Assistant</HeaderTitle>
                  <HeaderStatus>Online</HeaderStatus>
                </HeaderInfo>
              </HeaderLeft>
              <CloseButton onClick={handleToggle}>✕</CloseButton>
            </ChatHeader>

            <MessagesContainer>
              {messages.length === 0 && (
                <WelcomeMessage>
                  <strong>👋 Hi! I'm ReValue AI</strong>
                  Your intelligent assistant for the circular economy marketplace.
                  Ask me anything about listing materials, finding buyers, or sustainability!
                  <QuickActions>
                    {quickActions.map((action, i) => (
                      <QuickAction key={i} onClick={() => handleSendMessage(action)}>
                        {action}
                      </QuickAction>
                    ))}
                  </QuickActions>
                </WelcomeMessage>
              )}

              {messages.map(msg => (
                <MessageBubble key={msg.id} $isUser={msg.sender === 'user'}>
                  {msg.text}
                </MessageBubble>
              ))}

              {isTyping && (
                <TypingIndicator>
                  <span /><span /><span />
                </TypingIndicator>
              )}

              <div ref={messagesEndRef} />
            </MessagesContainer>

            <InputArea onSubmit={handleSubmit}>
              <ChatInput
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask ReValue AI..."
                disabled={isTyping}
                autoFocus
              />
              <SendButton type="submit" disabled={!inputValue.trim() || isTyping}>
                <span style={{ color: '#0A0F16', fontSize: '16px' }}>➤</span>
              </SendButton>
            </InputArea>
          </ChatWindow>
        )}
      </AnimatePresence>

      <ChatToggle
        onClick={handleToggle}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <ChatIcon>{isOpen ? '✕' : '🤖'}</ChatIcon>
      </ChatToggle>
    </>
  );
};

export default AIChatbot;
