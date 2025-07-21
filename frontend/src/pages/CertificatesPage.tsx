import React from 'react';
import { motion } from 'framer-motion';
import { Award, Calendar, ExternalLink } from 'lucide-react';

const CertificatesPage = () => {
  const certificates = [
    {
      id: 1,
      title: 'AWS Certified Solutions Architect',
      issuer: 'Amazon Web Services',
      date: '2023-12-15',
      image: 'https://images.pexels.com/photos/1181675/pexels-photo-1181675.jpeg?auto=compress&cs=tinysrgb&w=600',
      credentialId: 'AWS-SAA-2023-001',
      verifyUrl: '#',
      description: 'Professional level certification demonstrating expertise in designing distributed systems on AWS.'
    },
    {
      id: 2,
      title: 'React Developer Certification',
      issuer: 'Meta (Facebook)',
      date: '2023-10-22',
      image: 'https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&cs=tinysrgb&w=600',
      credentialId: 'META-REACT-2023-002',
      verifyUrl: '#',
      description: 'Advanced certification covering React fundamentals, hooks, state management, and performance optimization.'
    },
    {
      id: 3,
      title: 'Google Cloud Professional Developer',
      issuer: 'Google Cloud',
      date: '2023-08-10',
      image: 'https://images.pexels.com/photos/270348/pexels-photo-270348.jpeg?auto=compress&cs=tinysrgb&w=600',
      credentialId: 'GCP-DEV-2023-003',
      verifyUrl: '#',
      description: 'Professional certification demonstrating ability to build scalable applications on Google Cloud Platform.'
    },
    {
      id: 4,
      title: 'Certified Kubernetes Administrator',
      issuer: 'Cloud Native Computing Foundation',
      date: '2023-06-18',
      image: 'https://images.pexels.com/photos/1181298/pexels-photo-1181298.jpeg?auto=compress&cs=tinysrgb&w=600',
      credentialId: 'CKA-2023-004',
      verifyUrl: '#',
      description: 'Hands-on certification proving skills in Kubernetes cluster administration and management.'
    },
    {
      id: 5,
      title: 'MongoDB Certified Developer',
      issuer: 'MongoDB University',
      date: '2023-04-25',
      image: 'https://images.pexels.com/photos/1181271/pexels-photo-1181271.jpeg?auto=compress&cs=tinysrgb&w=600',
      credentialId: 'MONGO-DEV-2023-005',
      verifyUrl: '#',
      description: 'Certification covering MongoDB database design, development, and optimization techniques.'
    },
    {
      id: 6,
      title: 'Certified Ethical Hacker',
      issuer: 'EC-Council',
      date: '2023-02-14',
      image: 'https://images.pexels.com/photos/60504/security-protection-anti-virus-software-60504.jpeg?auto=compress&cs=tinysrgb&w=600',
      credentialId: 'CEH-2023-006',
      verifyUrl: '#',
      description: 'Professional certification demonstrating knowledge of information security and ethical hacking methodologies.'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="pt-24 pb-20 bg-white min-h-screen"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold mb-4 text-gray-900">
            Certificates & <span className="text-orange-500">Credentials</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            My professional certifications showcasing expertise in various technologies.
          </p>
        </motion.div>

        {/* Simple Grid Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {certificates.map((cert, index) => (
            <motion.div
              key={cert.id}
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              whileHover={{ y: -5, scale: 1.02 }}
              className="bg-white rounded-lg border border-gray-100 hover:shadow-lg transition-all duration-300"
            >
              <div className="relative">
                <img
                  src={cert.image}
                  alt={cert.title}
                  className="w-full h-32 object-cover rounded-t-lg"
                />
              
                <div className="absolute top-3 left-3">
                  <div className="p-1.5 bg-orange-100 rounded-full">
                    <Award size={16} className="text-orange-500" />
                  </div>
                </div>
              </div>

              <div className="p-5">
                <h3 className="text-base font-semibold text-gray-900 mb-2 line-clamp-2">
                  {cert.title}
                </h3>
                <p className="text-orange-500 text-sm mb-2">{cert.issuer}</p>
                <div className="flex items-center space-x-2 text-gray-500 text-xs mb-3">
                  <Calendar size={12} />
                  <span>{new Date(cert.date).toLocaleDateString()}</span>
                </div>
                <p className="text-gray-600 text-xs mb-4 line-clamp-2">
                  {cert.description}
                </p>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-500">Credential ID</p>
                    <p className="text-xs text-orange-500 font-mono">{cert.credentialId}</p>
                  </div>
                  <a
                    href={cert.verifyUrl}
                    className="text-orange-500 hover:text-orange-600 text-xs font-medium"
                  >
                    Verify
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default CertificatesPage;