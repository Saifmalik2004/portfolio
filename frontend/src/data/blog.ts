import { Blog } from '../types/blog';

export const mockBlogs: Blog[] = [
  {
    id: '1',
    title: 'Building Scalable React Applications with TypeScript',
    slug: 'scalable-react-typescript',
    excerpt: 'Learn how to structure large React applications using TypeScript for better maintainability and developer experience. Discover best practices for component architecture, state management, and type safety.',
    content: `
      <p>TypeScript has become an essential tool for building large-scale React applications. In this comprehensive guide, we'll explore how to structure your React projects with TypeScript to ensure maintainability, scalability, and developer productivity.</p>
      
      <h2>Why TypeScript?</h2>
      <p>TypeScript brings static type checking to JavaScript, which helps catch errors at compile time rather than runtime. This is particularly valuable in React applications where prop drilling and state management can become complex.</p>
      
      <h3>Key Benefits:</h3>
      <ul>
        <li>Better IntelliSense and autocomplete</li>
        <li>Refactoring support</li>
        <li>Self-documenting code</li>
        <li>Reduced runtime errors</li>
        <li>Enhanced team collaboration</li>
      </ul>
      
      <h2>Project Structure</h2>
      <p>A well-organized project structure is crucial for scalability. Here's a recommended structure for TypeScript React applications:</p>
      
      <pre><code>src/
  components/
    common/
    feature-specific/
  hooks/
  types/
  utils/
  services/
  pages/
  styles/</code></pre>
      
      <h2>Type Definitions</h2>
      <p>Creating proper type definitions is the foundation of a good TypeScript React application. Start by defining your core types and interfaces:</p>
      
      <pre><code>interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

type UserRole = 'admin' | 'user' | 'moderator';</code></pre>
      
      <h2>Component Patterns</h2>
      <p>Use proper typing for your React components to ensure type safety across your application:</p>
      
      <pre><code>interface ButtonProps {
  variant: 'primary' | 'secondary';
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({ 
  variant, 
  children, 
  onClick, 
  disabled = false 
}) => {
  return (
    <button 
      className={\`btn btn-\${variant}\`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};</code></pre>
      
      <h2>State Management</h2>
      <p>When dealing with complex state, consider using useReducer with proper typing or a state management library like Redux Toolkit with TypeScript support.</p>
      
      <h2>Testing with TypeScript</h2>
      <p>TypeScript makes testing more reliable by catching type errors in your test files. Use Jest and React Testing Library with proper TypeScript configuration.</p>
      
      <h2>Conclusion</h2>
      <p>TypeScript significantly improves the development experience when building React applications. By following these patterns and best practices, you'll create more maintainable and scalable applications that are easier to debug and refactor.</p>
    `,
    image: 'https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&cs=tinysrgb&w=1200',
    category: 'Development',
    is_published: true,
    read_time: '8 min read',
    author: 'Your Name',
    tags: ['React', 'TypeScript', 'JavaScript', 'Frontend'],
    meta_description: 'Learn how to build scalable React applications with TypeScript. Best practices for component architecture, state management, and type safety.',
    created_at: '2024-01-20T10:30:00Z',
    updated_at: '2024-01-20T14:45:00Z'
  },
  {
    id: '2',
    title: 'The Future of Web Development: Trends to Watch in 2024',
    slug: 'web-development-trends-2024',
    excerpt: 'Exploring emerging technologies and methodologies that will shape the future of web development. From AI integration to new frameworks and tools.',
    content: `
      <p>The web development landscape is constantly evolving, and 2024 promises to bring exciting new trends and technologies. Let's explore the key developments that will shape how we build web applications in the coming year.</p>
      
      <h2>AI-Powered Development Tools</h2>
      <p>Artificial Intelligence is revolutionizing how we write code. Tools like GitHub Copilot, ChatGPT, and specialized AI coding assistants are becoming integral parts of the development workflow.</p>
      
      <h3>Key AI Developments:</h3>
      <ul>
        <li>Code generation and completion</li>
        <li>Automated testing and debugging</li>
        <li>Design-to-code conversion</li>
        <li>Performance optimization suggestions</li>
      </ul>
      
      <h2>Server-Side Renaissance</h2>
      <p>Server-side rendering and edge computing are making a strong comeback with frameworks like Next.js 14, Remix, and SvelteKit leading the charge.</p>
      
      <h2>WebAssembly (WASM) Growth</h2>
      <p>WebAssembly is enabling high-performance applications in the browser, opening doors for languages like Rust, Go, and C++ in web development.</p>
      
      <h2>Progressive Web Apps Evolution</h2>
      <p>PWAs are becoming more powerful with new APIs and capabilities, bridging the gap between web and native applications.</p>
      
      <h2>Micro-Frontends Architecture</h2>
      <p>Large organizations are adopting micro-frontend architectures to enable independent team development and deployment.</p>
      
      <h2>Sustainability in Web Development</h2>
      <p>Green coding practices and carbon-aware development are becoming important considerations for environmentally conscious developers.</p>
      
      <h2>Conclusion</h2>
      <p>The future of web development is bright and full of possibilities. Staying updated with these trends will help you build better, faster, and more efficient web applications.</p>
    `,
    image: 'https://images.pexels.com/photos/270348/pexels-photo-270348.jpeg?auto=compress&cs=tinysrgb&w=1200',
    category: 'Technology',
    is_published: true,
    read_time: '6 min read',
    author: 'Your Name',
    tags: ['Web Development', 'Technology', 'AI', 'Trends'],
    meta_description: 'Explore the latest web development trends for 2024, including AI tools, server-side rendering, WebAssembly, and more.',
    created_at: '2024-01-15T09:15:00Z',
    updated_at: '2024-01-18T16:20:00Z'
  },
  {
    id: '3',
    title: 'Mastering CSS Grid and Flexbox for Modern Layouts',
    slug: 'css-grid-flexbox-guide',
    excerpt: 'A comprehensive guide to creating responsive and flexible layouts using CSS Grid and Flexbox. Learn when to use each and how to combine them effectively.',
    content: `
      <p>CSS Grid and Flexbox are two powerful layout systems that have revolutionized how we create web layouts. Understanding when and how to use each one is crucial for modern web development.</p>
      
      <h2>Understanding Flexbox</h2>
      <p>Flexbox is designed for one-dimensional layouts - either in a row or column. It's perfect for component-level layouts and aligning items within a container.</p>
      
      <h3>Flexbox Use Cases:</h3>
      <ul>
        <li>Navigation bars</li>
        <li>Card layouts</li>
        <li>Centering content</li>
        <li>Equal height columns</li>
        <li>Space distribution</li>
      </ul>
      
      <h2>Understanding CSS Grid</h2>
      <p>CSS Grid is designed for two-dimensional layouts, allowing you to work with both rows and columns simultaneously. It's ideal for page-level layouts.</p>
      
      <h3>CSS Grid Use Cases:</h3>
      <ul>
        <li>Page layouts</li>
        <li>Complex grid systems</li>
        <li>Magazine-style layouts</li>
        <li>Dashboard interfaces</li>
        <li>Image galleries</li>
      </ul>
      
      <h2>Flexbox Examples</h2>
      <pre><code>/* Centering content */
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

/* Navigation bar */
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
}</code></pre>
      
      <h2>CSS Grid Examples</h2>
      <pre><code>/* Basic grid layout */
.grid-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 1rem;
}

/* Complex layout */
.layout {
  display: grid;
  grid-template-areas:
    "header header header"
    "sidebar main aside"
    "footer footer footer";
  grid-template-rows: auto 1fr auto;
  min-height: 100vh;
}</code></pre>
      
      <h2>Combining Grid and Flexbox</h2>
      <p>The real power comes from combining both systems. Use Grid for the overall page layout and Flexbox for component-level layouts.</p>
      
      <h2>Responsive Design</h2>
      <p>Both Grid and Flexbox offer excellent responsive capabilities with features like auto-fit, minmax(), and flexible units.</p>
      
      <h2>Browser Support</h2>
      <p>Both CSS Grid and Flexbox have excellent browser support, making them safe to use in production applications.</p>
      
      <h2>Conclusion</h2>
      <p>Mastering both CSS Grid and Flexbox will make you a more effective frontend developer. Practice with different layouts and experiment with combining both systems.</p>
    `,
    image: 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=1200',
    category: 'CSS',
    is_published: true,
    read_time: '10 min read',
    author: 'Your Name',
    tags: ['CSS', 'Grid', 'Flexbox', 'Layout', 'Responsive Design'],
    meta_description: 'Master CSS Grid and Flexbox for modern web layouts. Learn when to use each system and how to create responsive designs.',
    created_at: '2024-01-10T11:00:00Z',
    updated_at: '2024-01-12T13:30:00Z'
  },
  {
    id: '4',
    title: 'API Design Best Practices for RESTful Services',
    slug: 'api-design-best-practices',
    excerpt: 'Essential principles and patterns for designing robust and scalable RESTful APIs. Learn about proper HTTP methods, status codes, and API versioning.',
    content: `
      <p>Designing good APIs is crucial for building scalable and maintainable applications. RESTful APIs have become the standard for web services, and following best practices ensures your APIs are intuitive, reliable, and easy to use.</p>
      
      <h2>REST Principles</h2>
      <p>REST (Representational State Transfer) is an architectural style that defines constraints for creating web services. Understanding these principles is fundamental to good API design.</p>
      
      <h3>Core REST Principles:</h3>
      <ul>
        <li>Stateless communication</li>
        <li>Client-server architecture</li>
        <li>Cacheable responses</li>
        <li>Uniform interface</li>
        <li>Layered system</li>
      </ul>
      
      <h2>HTTP Methods</h2>
      <p>Use HTTP methods correctly to indicate the intended action:</p>
      
      <pre><code>GET    /api/users       # Retrieve all users
GET    /api/users/123   # Retrieve specific user
POST   /api/users       # Create new user
PUT    /api/users/123   # Update entire user
PATCH  /api/users/123   # Partial user update
DELETE /api/users/123   # Delete user</code></pre>
      
      <h2>Status Codes</h2>
      <p>Use appropriate HTTP status codes to communicate the result of operations:</p>
      
      <ul>
        <li><strong>200 OK</strong> - Successful GET, PUT, PATCH</li>
        <li><strong>201 Created</strong> - Successful POST</li>
        <li><strong>204 No Content</strong> - Successful DELETE</li>
        <li><strong>400 Bad Request</strong> - Invalid request data</li>
        <li><strong>401 Unauthorized</strong> - Authentication required</li>
        <li><strong>403 Forbidden</strong> - Access denied</li>
        <li><strong>404 Not Found</strong> - Resource not found</li>
        <li><strong>500 Internal Server Error</strong> - Server error</li>
      </ul>
      
      <h2>URL Design</h2>
      <p>Design clean, intuitive URLs that represent resources:</p>
      
      <pre><code># Good
GET /api/users/123/posts
POST /api/users/123/posts
GET /api/posts?author=123

# Bad
GET /api/getUserPosts?userId=123
POST /api/createPostForUser
GET /api/getPostsByAuthor</code></pre>
      
      <h2>Request and Response Format</h2>
      <p>Use consistent JSON formatting and include relevant metadata:</p>
      
      <pre><code>{
  "data": {
    "id": 123,
    "name": "John Doe",
    "email": "john@example.com"
  },
  "meta": {
    "timestamp": "2024-01-20T10:30:00Z",
    "version": "1.0"
  }
}</code></pre>
      
      <h2>Error Handling</h2>
      <p>Provide clear, consistent error messages:</p>
      
      <pre><code>{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": [
      {
        "field": "email",
        "message": "Invalid email format"
      }
    ]
  }
}</code></pre>
      
      <h2>Pagination</h2>
      <p>Implement pagination for large datasets:</p>
      
      <pre><code>GET /api/users?page=2&limit=20

{
  "data": [...],
  "pagination": {
    "page": 2,
    "limit": 20,
    "total": 150,
    "pages": 8
  }
}</code></pre>
      
      <h2>Versioning</h2>
      <p>Plan for API evolution with proper versioning:</p>
      
      <pre><code># URL versioning
GET /api/v1/users

# Header versioning
GET /api/users
Accept: application/vnd.api+json;version=1</code></pre>
      
      <h2>Security</h2>
      <p>Implement proper authentication, authorization, and input validation. Use HTTPS for all communications.</p>
      
      <h2>Documentation</h2>
      <p>Provide comprehensive API documentation with examples, using tools like OpenAPI/Swagger.</p>
      
      <h2>Conclusion</h2>
      <p>Following these best practices will help you create APIs that are intuitive, maintainable, and scalable. Good API design is an investment in the long-term success of your application.</p>
    `,
    image: 'https://images.pexels.com/photos/1181675/pexels-photo-1181675.jpeg?auto=compress&cs=tinysrgb&w=1200',
    category: 'Backend',
    is_published: true,
    read_time: '7 min read',
    author: 'Your Name',
    tags: ['API', 'REST', 'Backend', 'Web Services', 'HTTP'],
    meta_description: 'Learn essential API design best practices for RESTful services. Proper HTTP methods, status codes, and API versioning strategies.',
    created_at: '2024-01-05T14:20:00Z',
    updated_at: '2024-01-08T10:15:00Z'
  },
  {
    id: '5',
    title: 'Understanding Modern JavaScript: ES2024 Features',
    slug: 'javascript-es2024-features',
    excerpt: 'Explore the latest JavaScript features and how they can improve your development workflow. From new array methods to enhanced async capabilities.',
    content: `
      <p>JavaScript continues to evolve with new features that make development more efficient and code more readable. Let's explore the latest ES2024 features and how they can improve your development workflow.</p>
      
      <h2>Array Grouping Methods</h2>
      <p>New methods for grouping array elements make data manipulation more intuitive:</p>
      
      <pre><code>const users = [
  { name: 'Alice', role: 'admin' },
  { name: 'Bob', role: 'user' },
  { name: 'Charlie', role: 'admin' }
];

// Group by role
const grouped = users.groupBy(user => user.role);
// Result: { admin: [...], user: [...] }

// Group to Map
const groupedMap = users.groupByToMap(user => user.role);</code></pre>
      
      <h2>Promise.withResolvers()</h2>
      <p>A new utility for creating promises with external resolve/reject functions:</p>
      
      <pre><code>const { promise, resolve, reject } = Promise.withResolvers();

// Use resolve/reject from outside the promise
setTimeout(() => resolve('Success!'), 1000);

promise.then(result => console.log(result));</code></pre>
      
      <h2>Temporal API (Stage 3)</h2>
      <p>A modern replacement for the Date object with better API design:</p>
      
      <pre><code>// Current date and time
const now = Temporal.Now.plainDateTimeISO();

// Create specific dates
const date = Temporal.PlainDate.from('2024-01-20');
const time = Temporal.PlainTime.from('14:30:00');

// Date arithmetic
const nextWeek = date.add({ days: 7 });
const duration = Temporal.Duration.from({ hours: 2, minutes: 30 });</code></pre>
      
      <h2>Decorators (Stage 3)</h2>
      <p>Decorators provide a way to modify classes and class members:</p>
      
      <pre><code>function logged(target, context) {
  return function(...args) {
    console.log(\`Calling \${context.name}\`);
    return target.apply(this, args);
  };
}

class Calculator {
  @logged
  add(a, b) {
    return a + b;
  }
}</code></pre>
      
      <h2>Pattern Matching (Proposal)</h2>
      <p>A new way to handle complex conditional logic:</p>
      
      <pre><code>const result = match (value) {
  when ({ type: 'user', role: 'admin' }) -> 'Admin user',
  when ({ type: 'user', role: 'guest' }) -> 'Guest user',
  when ({ type: 'system' }) -> 'System account',
  when (_) -> 'Unknown type'
};</code></pre>
      
      <h2>Enhanced Error Handling</h2>
      <p>New error handling capabilities for better debugging:</p>
      
      <pre><code>// Error cause chaining
try {
  throw new Error('Database connection failed');
} catch (err) {
  throw new Error('User creation failed', { cause: err });
}

// AggregateError for multiple errors
const errors = [
  new Error('Validation failed'),
  new Error('Network timeout')
];
throw new AggregateError(errors, 'Multiple errors occurred');</code></pre>
      
      <h2>Import Assertions</h2>
      <p>Specify the expected type of imported modules:</p>
      
      <pre><code>// Import JSON with assertion
import config from './config.json' assert { type: 'json' };

// Import CSS modules
import styles from './styles.css' assert { type: 'css' };</code></pre>
      
      <h2>Top-level await</h2>
      <p>Use await at the module level without wrapping in async function:</p>
      
      <pre><code>// In a module
const data = await fetch('/api/data').then(r => r.json());
const config = await import('./config.js');

export { data, config };</code></pre>
      
      <h2>Private Fields and Methods</h2>
      <p>True privacy in JavaScript classes:</p>
      
      <pre><code>class BankAccount {
  #balance = 0;
  #accountNumber;
  
  constructor(accountNumber) {
    this.#accountNumber = accountNumber;
  }
  
  #validateAmount(amount) {
    return amount > 0;
  }
  
  deposit(amount) {
    if (this.#validateAmount(amount)) {
      this.#balance += amount;
    }
  }
  
  getBalance() {
    return this.#balance;
  }
}</code></pre>
      
      <h2>Conclusion</h2>
      <p>These modern JavaScript features provide powerful tools for writing cleaner, more maintainable code. While some are still in proposal stages, it's important to stay informed about the language's evolution.</p>
    `,
    image: 'https://images.pexels.com/photos/1181271/pexels-photo-1181271.jpeg?auto=compress&cs=tinysrgb&w=1200',
    category: 'JavaScript',
    is_published: true,
    read_time: '9 min read',
    author: 'Your Name',
    tags: ['JavaScript', 'ES2024', 'Modern JS', 'Programming'],
    meta_description: 'Explore the latest JavaScript ES2024 features including array grouping, Promise.withResolvers, Temporal API, and more.',
    created_at: '2023-12-28T16:30:00Z',
    updated_at: '2023-12-30T09:45:00Z'
  },
  {
    id: '6',
    title: 'Building Accessible Web Applications',
    slug: 'building-accessible-web-apps',
    excerpt: 'A practical guide to implementing WCAG guidelines and creating inclusive web experiences. Learn about semantic HTML, ARIA, and testing strategies.',
    content: `
      <p>Web accessibility ensures that websites and applications are usable by everyone, including people with disabilities. Building accessible web applications is not just a legal requirement in many jurisdictions—it's the right thing to do.</p>
      
      <h2>Understanding Web Accessibility</h2>
      <p>Web accessibility means that websites, tools, and technologies are designed so that people with disabilities can use them effectively. This includes people with visual, auditory, physical, speech, cognitive, and neurological disabilities.</p>
      
      <h2>WCAG Guidelines</h2>
      <p>The Web Content Accessibility Guidelines (WCAG) provide the foundation for web accessibility. The guidelines are organized around four principles:</p>
      
      <h3>1. Perceivable</h3>
      <ul>
        <li>Provide text alternatives for images</li>
        <li>Offer captions and transcripts for videos</li>
        <li>Ensure sufficient color contrast</li>
        <li>Make content adaptable to different presentations</li>
      </ul>
      
      <h3>2. Operable</h3>
      <ul>
        <li>Make all functionality keyboard accessible</li>
        <li>Give users enough time to read content</li>
        <li>Don't use content that causes seizures</li>
        <li>Help users navigate and find content</li>
      </ul>
      
      <h3>3. Understandable</h3>
      <ul>
        <li>Make text readable and understandable</li>
        <li>Make content appear and operate predictably</li>
        <li>Help users avoid and correct mistakes</li>
      </ul>
      
      <h3>4. Robust</h3>
      <ul>
        <li>Maximize compatibility with assistive technologies</li>
        <li>Use valid, semantic HTML</li>
      </ul>
      
      <h2>Semantic HTML</h2>
      <p>Using semantic HTML elements provides meaning and structure that assistive technologies can understand:</p>
      
      <pre><code><!-- Good: Semantic structure -->
<header>
  <nav>
    <ul>
      <li><a href="/">Home</a></li>
      <li><a href="/about">About</a></li>
    </ul>
  </nav>
</header>

<main>
  <article>
    <h1>Article Title</h1>
    <p>Article content...</p>
  </article>
  
  <aside>
    <h2>Related Links</h2>
    <ul>
      <li><a href="/related">Related Article</a></li>
    </ul>
  </aside>
</main>

<footer>
  <p>&copy; 2024 Company Name</p>
</footer></code></pre>
      
      <h2>ARIA (Accessible Rich Internet Applications)</h2>
      <p>ARIA attributes provide additional semantic information when HTML alone isn't sufficient:</p>
      
      <pre><code><!-- ARIA labels and descriptions -->
<button aria-label="Close dialog" onclick="closeDialog()">
  <span aria-hidden="true">&times;</span>
</button>

<!-- ARIA live regions for dynamic content -->
<div aria-live="polite" id="status"></div>

<!-- ARIA expanded for collapsible content -->
<button aria-expanded="false" aria-controls="menu">
  Menu
</button>
<ul id="menu" hidden>
  <li><a href="/home">Home</a></li>
  <li><a href="/about">About</a></li>
</ul></code></pre>
      
      <h2>Keyboard Navigation</h2>
      <p>Ensure all interactive elements are keyboard accessible:</p>
      
      <pre><code>// Handle keyboard events
function handleKeyDown(event) {
  switch(event.key) {
    case 'Enter':
    case ' ':
      // Activate button
      event.preventDefault();
      activateButton();
      break;
    case 'Escape':
      // Close modal
      closeModal();
      break;
  }
}

// Manage focus
function trapFocus(element) {
  const focusableElements = element.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  
  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];
  
  element.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
      if (e.shiftKey && document.activeElement === firstElement) {
        lastElement.focus();
        e.preventDefault();
      } else if (!e.shiftKey && document.activeElement === lastElement) {
        firstElement.focus();
        e.preventDefault();
      }
    }
  });
}</code></pre>
      
      <h2>Color and Contrast</h2>
      <p>Ensure sufficient color contrast and don't rely solely on color to convey information:</p>
      
      <pre><code>/* Good contrast ratios */
.text-normal {
  color: #333333; /* 12.6:1 contrast ratio on white */
}

.text-large {
  color: #666666; /* 5.7:1 contrast ratio - acceptable for large text */
}

/* Don't rely only on color */
.error {
  color: #d32f2f;
  border-left: 4px solid #d32f2f; /* Visual indicator */
}

.error::before {
  content: "⚠ "; /* Icon indicator */
}</code></pre>
      
      <h2>Form Accessibility</h2>
      <p>Make forms accessible with proper labels and error handling:</p>
      
      <pre><code><form>
  <div>
    <label for="email">Email Address *</label>
    <input 
      type="email" 
      id="email" 
      name="email" 
      required 
      aria-describedby="email-error"
      aria-invalid="false"
    >
    <div id="email-error" role="alert" hidden>
      Please enter a valid email address
    </div>
  </div>
  
  <fieldset>
    <legend>Preferred Contact Method</legend>
    <input type="radio" id="contact-email" name="contact" value="email">
    <label for="contact-email">Email</label>
    
    <input type="radio" id="contact-phone" name="contact" value="phone">
    <label for="contact-phone">Phone</label>
  </fieldset>
</form></code></pre>
      
      <h2>Testing for Accessibility</h2>
      <p>Regular testing is crucial for maintaining accessibility:</p>
      
      <h3>Automated Testing Tools:</h3>
      <ul>
        <li>axe-core browser extension</li>
        <li>Lighthouse accessibility audit</li>
        <li>WAVE Web Accessibility Evaluator</li>
        <li>Pa11y command line tool</li>
      </ul>
      
      <h3>Manual Testing:</h3>
      <ul>
        <li>Navigate using only the keyboard</li>
        <li>Test with screen readers (NVDA, JAWS, VoiceOver)</li>
        <li>Check color contrast</li>
        <li>Verify content scales to 200% zoom</li>
      </ul>
      
      <h2>Accessibility in React</h2>
      <p>React provides good accessibility support with JSX:</p>
      
      <pre><code>function AccessibleButton({ children, onClick, disabled }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-disabled={disabled}
      className="btn"
    >
      {children}
    </button>
  );
}

function Modal({ isOpen, onClose, title, children }) {
  const modalRef = useRef();
  
  useEffect(() => {
    if (isOpen) {
      modalRef.current?.focus();
    }
  }, [isOpen]);
  
  return isOpen ? (
    <div 
      className="modal-overlay" 
      role="dialog" 
      aria-modal="true"
      aria-labelledby="modal-title"
      ref={modalRef}
      tabIndex={-1}
    >
      <div className="modal-content">
        <h2 id="modal-title">{title}</h2>
        {children}
        <button onClick={onClose} aria-label="Close modal">
          &times;
        </button>
      </div>
    </div>
  ) : null;
}</code></pre>
      
      <h2>Conclusion</h2>
      <p>Building accessible web applications requires ongoing attention and testing, but the result is a better experience for all users. Start with semantic HTML, add ARIA where needed, ensure keyboard accessibility, and test regularly with both automated tools and real users.</p>
    `,
    image: 'https://images.pexels.com/photos/1181298/pexels-photo-1181298.jpeg?auto=compress&cs=tinysrgb&w=1200',
    category: 'Accessibility',
    is_published: true,
    read_time: '12 min read',
    author: 'Your Name',
    tags: ['Accessibility', 'WCAG', 'Inclusive Design', 'Web Standards'],
    meta_description: 'Learn how to build accessible web applications following WCAG guidelines. Practical guide to semantic HTML, ARIA, and testing strategies.',
    created_at: '2023-12-20T08:45:00Z',
    updated_at: '2023-12-22T15:20:00Z'
  }
];

// Helper functions for filtering (backend-ready)
export const getPublishedBlogs = (): Blog[] => {
  return mockBlogs.filter(blog => blog.is_published);
};

export const getBlogsByCategory = (category: string): Blog[] => {
  return mockBlogs.filter(blog => blog.category === category && blog.is_published);
};

export const getBlogsByTag = (tag: string): Blog[] => {
  return mockBlogs.filter(blog => 
    blog.tags.includes(tag) && blog.is_published
  );
};

export const getBlogBySlug = (slug: string): Blog | undefined => {
  return mockBlogs.find(blog => blog.slug === slug && blog.is_published);
};

export const getAllCategories = (): string[] => {
  const categories = mockBlogs.map(blog => blog.category);
  return [...new Set(categories)].sort();
};

export const getAllTags = (): string[] => {
  const allTags = mockBlogs.flatMap(blog => blog.tags);
  return [...new Set(allTags)].sort();
};

export const getRecentBlogs = (limit: number = 5): Blog[] => {
  return mockBlogs
    .filter(blog => blog.is_published)
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, limit);
};