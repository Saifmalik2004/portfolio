import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User } from 'lucide-react';

interface Message {
  id: number;
  text: string;
  isBot: boolean;
  timestamp: Date;
}

interface ChatbotInterfaceProps {
  onExit?: () => void;
}

const ChatbotInterface: React.FC<ChatbotInterfaceProps> = ({ onExit }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hi! I'm your AI assistant. I can answer questions about this portfolio, including skills, projects, experience, and more. Type 'exit' to return to the main page. What would you like to know?",
      isBot: true,
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const responses = {
    skills: "I specialize in full-stack development with expertise in React, TypeScript, Node.js, and Python. I'm also skilled in cloud technologies like AWS, database management with PostgreSQL and MongoDB, and have experience with Docker, Git, and various testing frameworks.",
    
    projects: "I've worked on several exciting projects including an e-commerce platform with React and Node.js, an AI analytics dashboard using Python and TensorFlow, a blockchain wallet with Web3 integration, and a SaaS analytics tool. Each project showcases different aspects of my technical abilities.",
    
    experience: "I have 5+ years of professional development experience. Currently working as a Senior Full Stack Developer at TechCorp Inc., previously at StartupXYZ as a Frontend Developer, and started my career at WebSolutions as a Junior Developer. I've led teams and improved application performance significantly.",
    
    education: "I have a Bachelor's degree in Computer Science from University of Technology (2015-2019) where I graduated Magna Cum Laude. I also completed a Full Stack Web Development Bootcamp at CodeAcademy Pro in 2019.",
    
    contact: "You can reach me at hello@yourname.com or call +1 (555) 123-4567. I'm based in San Francisco, CA. You can also find me on LinkedIn and GitHub. Feel free to download my resume from the resume page!",
    
    certificates: "I hold several professional certifications including AWS Certified Solutions Architect, React Developer Certification from Meta, Google Cloud Professional Developer, Certified Kubernetes Administrator, MongoDB Certified Developer, and Certified Ethical Hacker.",
    
    about: "I'm a passionate full-stack developer who loves creating innovative digital solutions. I believe in writing clean, maintainable code and creating great user experiences. I'm always learning new technologies and enjoy collaborating with teams to solve complex problems.",
    
    technologies: "I work with a wide range of technologies including React, TypeScript, Next.js, Vue.js for frontend; Node.js, Express, Python, Django for backend; PostgreSQL, MongoDB for databases; and AWS, Docker, Git for DevOps and tools.",
    
    hobbies: "When I'm not coding, I enjoy exploring new technologies, contributing to open source projects, reading tech blogs, and staying up-to-date with the latest industry trends. I also enjoy hiking and photography in my free time!"
  };

  const getResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();
    
    if (input.includes('skill') || input.includes('technology') || input.includes('tech stack')) {
      return responses.skills;
    }
    if (input.includes('project') || input.includes('work') || input.includes('portfolio')) {
      return responses.projects;
    }
    if (input.includes('experience') || input.includes('job') || input.includes('career')) {
      return responses.experience;
    }
    if (input.includes('education') || input.includes('study') || input.includes('degree')) {
      return responses.education;
    }
    if (input.includes('contact') || input.includes('reach') || input.includes('email') || input.includes('phone')) {
      return responses.contact;
    }
    if (input.includes('certificate') || input.includes('certification') || input.includes('credential')) {
      return responses.certificates;
    }
    if (input.includes('about') || input.includes('who') || input.includes('tell me')) {
      return responses.about;
    }
    if (input.includes('hobby') || input.includes('free time') || input.includes('interest')) {
      return responses.hobbies;
    }
    if (input.includes('hello') || input.includes('hi') || input.includes('hey')) {
      return "Hello! Nice to meet you! I'm here to help you learn more about this portfolio. What would you like to know about the skills, projects, or experience?";
    }
    if (input.includes('thank') || input.includes('thanks')) {
      return "You're welcome! I'm glad I could help. Is there anything else you'd like to know about this portfolio?";
    }
    if (input.includes('exit') || input.includes('quit') || input.includes('bye')) {
      if (onExit) {
        setTimeout(() => onExit(), 1000);
        return "Thanks for chatting! Returning to the main page...";
      }
      return "Thanks for chatting! Have a great day!";
    }
    
    return "That's an interesting question! I can help you learn about skills, projects, work experience, education, certifications, contact information, or just general information about this portfolio. What specific area interests you most?";
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now(),
      text: input,
      isBot: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate typing delay
    setTimeout(() => {
      const botResponse: Message = {
        id: Date.now() + 1,
        text: getResponse(input),
        isBot: true,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000); // Random delay between 1-2 seconds
  };

  return (
    <div className="h-full flex flex-col bg-gray-900">
      {/* Chat Header */}
      <div className="bg-gray-800 px-6 py-4 border-b border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full flex items-center justify-center">
            <Bot size={20} className="text-white" />
          </div>
          <div>
            <h3 className="text-white font-medium">Portfolio AI Assistant</h3>
            <p className="text-gray-400 text-sm">Ask me anything about this portfolio!</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
            >
              <div className={`flex items-start space-x-3 max-w-xs lg:max-w-md ${message.isBot ? '' : 'flex-row-reverse space-x-reverse'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  message.isBot 
                    ? 'bg-gradient-to-r from-cyan-500 to-purple-500' 
                    : 'bg-gradient-to-r from-purple-500 to-pink-500'
                }`}>
                  {message.isBot ? <Bot size={16} className="text-white" /> : <User size={16} className="text-white" />}
                </div>
                
                <div className={`rounded-2xl px-4 py-2 ${
                  message.isBot 
                    ? 'bg-gray-700 text-gray-100' 
                    : 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white'
                }`}>
                  <p className="text-sm leading-relaxed">{message.text}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Typing Indicator */}
        {isTyping && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-start"
          >
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full flex items-center justify-center">
                <Bot size={16} className="text-white" />
              </div>
              <div className="bg-gray-700 rounded-2xl px-4 py-2">
                <div className="flex space-x-1">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.2 }}
                      className="w-2 h-2 bg-gray-400 rounded-full"
                    />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="border-t border-gray-700 p-4">
        <div className="flex items-center space-x-3">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask me about skills, projects, experience..."
            className="flex-1 bg-gray-800 text-white rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-400 border border-gray-600"
            disabled={isTyping}
          />
          <motion.button
            type="submit"
            disabled={isTyping || !input.trim()}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 bg-gradient-to-r from-cyan-500 to-purple-500 text-white rounded-full hover:shadow-lg transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send size={20} />
          </motion.button>
        </div>
      </form>
    </div>
  );
};

export default ChatbotInterface;