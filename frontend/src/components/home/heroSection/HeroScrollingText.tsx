
import { motion } from 'framer-motion';

const HeroScrollingText = () => {
  const text = "DEVELOPER DESIGNER CREATOR INNOVATOR ";
  
  return (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
      <div className="absolute top-1/2 left-0 transform -translate-y-1/2 whitespace-nowrap">
        <motion.div
          animate={{
            x: [0, -2000]
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="text-[240px] font-black text-black  select-none"
          style={{ 
            fontSize: 'clamp(10rem, 17vw, 14rem)',
            lineHeight: 1
          }}
        >
          {text.repeat(10)}
        </motion.div>
      </div>
    </div>
  );
};

export default HeroScrollingText;