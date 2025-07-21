import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface TerminalInterfaceProps {
  onExit?: () => void;
}

const TerminalInterface: React.FC<TerminalInterfaceProps> = ({ onExit }) => {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<Array<{ command: string; output: string }>>([
    { command: '', output: 'Welcome to my interactive terminal! Type -help to see available commands.' }
  ]);
  const [currentPath] = useState('~/portfolio');
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);

  const commands = {
    '-help': `Available commands:
    -help       Show this help message
    -about      Display information about me
    -skills     List my technical skills
    -projects   Show my featured projects
    -contact    Display contact information
    -experience Show work experience
    -clear      Clear the terminal
    -whoami     Display current user info
    -ls         List portfolio contents
    -cat        Read file contents (e.g., cat skills.txt)`,
    
    '-about': `Hi! I'm a passionate full-stack developer with 5+ years of experience.
    
    🚀 Specializing in React, TypeScript, and Node.js
    🎯 Love creating innovative solutions and beautiful UIs
    🌟 Always learning new technologies and best practices
    
    Currently based in San Francisco, CA`,
    
    '-skills': `Technical Skills:
    
    Frontend:     React, TypeScript, Next.js, Vue.js, HTML5, CSS3
    Backend:      Node.js, Express, Python, Django, PostgreSQL
    Tools:        Git, Docker, AWS, Jest, Figma
    Specialties:  Full-stack development, UI/UX design, Performance optimization`,
    
    '-projects': `Featured Projects:
    
    1. E-Commerce Platform    - React, Node.js, MongoDB
    2. AI Analytics Dashboard - Python, TensorFlow, React  
    3. Blockchain Wallet      - Web3, Solidity, React
    4. SaaS Analytics Tool    - Vue.js, Laravel, PostgreSQL
    
    Visit /projects page for detailed information!`,
    
    '-contact': `Contact Information:
    
    📧 Email:    hello@yourname.com
    📱 Phone:    +1 (555) 123-4567
    🌍 Location: San Francisco, CA
    💼 LinkedIn: linkedin.com/in/yourname
    🐙 GitHub:   github.com/yourname`,
    
    '-experience': `Work Experience:
    
    Senior Full Stack Developer @ TechCorp Inc. (2022-Present)
    • Led development of scalable web applications
    • Mentored junior developers
    • Improved performance by 40%
    
    Frontend Developer @ StartupXYZ (2020-2022)
    • Built responsive web applications
    • Improved user engagement by 25%
    
    Junior Developer @ WebSolutions (2019-2020)
    • Fixed 200+ bugs and improved code quality`,
    
    '-whoami': `guest@portfolio-terminal`,
    
    '-ls': `portfolio/
    ├── projects/
    ├── skills.txt
    ├── experience.md
    ├── contact.json
    └── about.txt`,
    
    'cat skills.txt': `JavaScript ████████████████████ 95%
React      ████████████████████ 90%
TypeScript ████████████████████ 85%
Node.js    ████████████████████ 80%
Python     ████████████████████ 75%
Design     ████████████████████ 85%`,
    
    'cat about.txt': `Full-stack developer passionate about creating innovative digital solutions.
Experienced in modern web technologies and always eager to learn new skills.
Believes in writing clean, maintainable code and great user experiences.`,
    
    'cat contact.json': `{
  "name": "Your Name",
  "email": "hello@yourname.com",
  "phone": "+1 (555) 123-4567",
  "location": "San Francisco, CA",
  "social": {
    "github": "github.com/yourname",
    "linkedin": "linkedin.com/in/yourname"
  }
}`,
    
    '-clear': 'CLEAR_TERMINAL',
    'exit': 'EXIT_TERMINAL'
  };

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [history]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const command = input.trim();
    
    if (command === '-clear') {
      setHistory([{ command: '', output: 'Terminal cleared. Type -help for available commands.' }]);
    } else if (command === 'exit') {
      if (onExit) {
        onExit();
      } else {
        setHistory(prev => [...prev, { 
          command, 
          output: 'Exiting terminal... Goodbye!' 
        }]);
      }
    } else if (commands[command as keyof typeof commands]) {
      const output = commands[command as keyof typeof commands];
      setHistory(prev => [...prev, { command, output }]);
    } else if (command) {
      setHistory(prev => [...prev, { 
        command, 
        output: `Command not found: ${command}. Type -help for available commands.` 
      }]);
    }
    
    setInput('');
  };

  return (
    <div className="h-full flex flex-col bg-black text-green-400 font-mono">
      {/* Terminal Header */}
      <div className="flex items-center justify-between bg-gray-800 px-4 py-2 border-b border-gray-700">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
        </div>
        <span className="text-gray-400 text-sm">portfolio-terminal</span>
      </div>

      {/* Terminal Content */}
      <div 
        ref={terminalRef}
        className="flex-1 overflow-y-auto p-4 text-sm leading-relaxed"
      >
        {history.map((entry, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="mb-2"
          >
            {entry.command && (
              <div className="flex items-center space-x-2 mb-1">
                <span className="text-cyan-400">guest@portfolio</span>
                <span className="text-white">:</span>
                <span className="text-blue-400">{currentPath}</span>
                <span className="text-white">$</span>
                <span className="text-green-400">{entry.command}</span>
              </div>
            )}
            <div className="whitespace-pre-line text-gray-300 ml-0 mb-2">
              {entry.output}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Terminal Input */}
      <form onSubmit={handleSubmit} className="border-t border-gray-700 p-4">
        <div className="flex items-center space-x-2">
          <span className="text-cyan-400">guest@portfolio</span>
          <span className="text-white">:</span>
          <span className="text-blue-400">{currentPath}</span>
          <span className="text-white">$</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 bg-transparent text-green-400 outline-none"
            placeholder="Type a command..."
            autoComplete="off"
          />
          <motion.span
            animate={{ opacity: [1, 0] }}
            transition={{ duration: 1, repeat: Infinity }}
            className="text-green-400"
          >
            |
          </motion.span>
        </div>
      </form>
    </div>
  );
};

export default TerminalInterface;