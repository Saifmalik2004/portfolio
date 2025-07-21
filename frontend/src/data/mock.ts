import { Project } from '../types/types';

export const mockProjects: Project[] = [
  {
    id: '550e8400-e29b-41d4-a716-446655440001',
    title: 'E-Commerce Platform',
    slug: 'ecommerce-platform',
    description: 'A comprehensive full-stack e-commerce solution built with modern web technologies, featuring secure payment processing, inventory management, and real-time analytics dashboard.',
    key_features: [
      'User authentication and authorization',
      'Product catalog with advanced filtering',
      'Shopping cart and wishlist functionality',
      'Secure payment processing with Stripe',
      'Order tracking and management',
      'Admin dashboard with analytics',
      'Responsive design for all devices',
      'Real-time inventory updates'
    ],
    github_url: 'https://github.com/username/ecommerce-platform',
    live_demo_url: 'https://ecommerce-demo.vercel.app',
    is_live: true,
    is_published: true,
    is_featured: true,
    technologies: ['React', 'TypeScript', 'Node.js', 'Express', 'MongoDB', 'Stripe', 'Redux', 'Tailwind CSS'],
    type: 'client',
    images: [
      'https://images.pexels.com/photos/230544/pexels-photo-230544.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/669610/pexels-photo-669610.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/607812/pexels-photo-607812.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    created_at: '2024-01-15T10:30:00Z',
    updated_at: '2024-01-20T14:45:00Z'
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440002',
    title: 'AI Analytics Dashboard',
    slug: 'ai-analytics-dashboard',
    description: 'Machine learning powered analytics dashboard with real-time data visualization, predictive modeling capabilities, and automated reporting features.',
    key_features: [
      'Real-time data visualization',
      'Machine learning predictions',
      'Automated report generation',
      'Interactive charts and graphs',
      'Data export functionality',
      'User role management',
      'API integration',
      'Mobile responsive design'
    ],
    github_url: 'https://github.com/username/ai-dashboard',
    live_demo_url: 'https://ai-dashboard-demo.vercel.app',
    is_live: true,
    is_published: true,
    is_featured: true,
    technologies: ['Python', 'TensorFlow', 'React', 'D3.js', 'FastAPI', 'PostgreSQL', 'Docker'],
    type: 'personal',
    images: [
      'https://images.pexels.com/photos/669610/pexels-photo-669610.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1181675/pexels-photo-1181675.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/270348/pexels-photo-270348.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    created_at: '2024-01-10T09:15:00Z',
    updated_at: '2024-01-18T16:20:00Z'
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440003',
    title: 'Mobile Fitness App',
    slug: 'mobile-fitness-app',
    description: 'Complete fitness tracking mobile application with workout plans, nutrition tracking, progress monitoring, and social features for fitness enthusiasts.',
    key_features: [
      'Workout plan creation and tracking',
      'Nutrition and calorie tracking',
      'Progress photos and measurements',
      'Social features and challenges',
      'Wearable device integration',
      'Offline mode support',
      'Push notifications',
      'Personal trainer booking'
    ],
    github_url: 'https://github.com/username/fitness-app',
    live_demo_url: '',
    is_live: false,
    is_published: true,
    is_featured: true,
    technologies: ['React Native', 'Firebase', 'Redux', 'TypeScript', 'Expo', 'Node.js'],
    type: 'internship',
    images: [
      'https://images.pexels.com/photos/607812/pexels-photo-607812.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1552242/pexels-photo-1552242.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    created_at: '2024-01-05T11:00:00Z',
    updated_at: '2024-01-12T13:30:00Z'
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440004',
    title: 'Blockchain Wallet',
    slug: 'blockchain-wallet',
    description: 'Secure cryptocurrency wallet application with multi-chain support, DeFi integration, and advanced security features for digital asset management.',
    key_features: [
      'Multi-chain cryptocurrency support',
      'DeFi protocol integration',
      'Hardware wallet compatibility',
      'Transaction history and analytics',
      'Staking and yield farming',
      'NFT collection management',
      'Advanced security features',
      'Cross-platform synchronization'
    ],
    github_url: 'https://github.com/username/blockchain-wallet',
    live_demo_url: 'https://crypto-wallet-demo.vercel.app',
    is_live: true,
    is_published: true,
    is_featured: true,
    technologies: ['Web3', 'Solidity', 'React', 'Ethers.js', 'MetaMask', 'IPFS', 'Hardhat'],
    type: 'personal',
    images: [
      'https://images.pexels.com/photos/844124/pexels-photo-844124.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1181675/pexels-photo-1181675.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    created_at: '2023-12-20T14:20:00Z',
    updated_at: '2024-01-08T10:15:00Z'
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440005',
    title: 'SaaS Analytics Platform',
    slug: 'saas-analytics-platform',
    description: 'Comprehensive analytics platform for SaaS businesses with subscription tracking, churn prediction, revenue analytics, and customer insights.',
    key_features: [
      'Subscription lifecycle tracking',
      'Churn prediction algorithms',
      'Revenue and MRR analytics',
      'Customer segmentation',
      'A/B testing framework',
      'Custom dashboard builder',
      'API for third-party integrations',
      'Automated email reports'
    ],
    github_url: 'https://github.com/username/saas-analytics',
    live_demo_url: 'https://saas-analytics-demo.vercel.app',
    is_live: true,
    is_published: true,
    is_featured: false,
    technologies: ['Vue.js', 'Laravel', 'PostgreSQL', 'Redis', 'Chart.js', 'Docker', 'AWS'],
    type: 'client',
    images: [
      'https://images.pexels.com/photos/186461/pexels-photo-186461.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/590020/pexels-photo-590020.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    created_at: '2023-12-15T08:45:00Z',
    updated_at: '2024-01-03T12:00:00Z'
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440006',
    title: 'IoT Smart Home System',
    slug: 'iot-smart-home',
    description: 'Complete IoT ecosystem for smart home automation with voice control, energy optimization, security monitoring, and mobile app integration.',
    key_features: [
      'Voice control integration',
      'Energy consumption monitoring',
      'Security camera system',
      'Automated lighting and climate',
      'Mobile app remote control',
      'Machine learning optimization',
      'Real-time notifications',
      'Third-party device compatibility'
    ],
    github_url: 'https://github.com/username/smart-home',
    live_demo_url: '',
    is_live: false,
    is_published: true,
    is_featured: false,
    technologies: ['Arduino', 'Raspberry Pi', 'Node.js', 'MQTT', 'React Native', 'Python', 'TensorFlow'],
    type: 'personal',
    images: [
      'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    created_at: '2023-12-01T16:30:00Z',
    updated_at: '2023-12-28T09:45:00Z'
  }
];

// Helper functions for filtering (backend-ready)
export const getPublishedProjects = (): Project[] => {
  return mockProjects.filter(project => project.is_published);
};

export const getProjectsByType = (type: 'personal' | 'client' | 'internship'): Project[] => {
  return mockProjects.filter(project => project.type === type && project.is_published);
};

export const getProjectsByTechnology = (technology: string): Project[] => {
  return mockProjects.filter(project => 
    project.technologies.includes(technology) && project.is_published
  );
};

export const getLiveProjects = (): Project[] => {
  return mockProjects.filter(project => project.is_live && project.is_published);
};

export const getProjectBySlug = (slug: string): Project | undefined => {
  return mockProjects.find(project => project.slug === slug && project.is_published);
};

export const getAllTechnologies = (): string[] => {
  const allTechs = mockProjects.flatMap(project => project.technologies);
  return [...new Set(allTechs)].sort();
};