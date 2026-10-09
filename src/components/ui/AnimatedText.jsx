import React from 'react';
import { motion } from 'framer-motion';

export const AnimatedText = ({
  text,
  el: Wrapper = 'p',
  className = '',
  mode = 'word', // 'word' or 'char'
  staggerDelay = 0.03,
  delay = 0,
  once = true,
}) => {
  const words = text.split(' ');

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: delay,
      },
    },
  };

  const childVariants = {
    hidden: {
      opacity: 0.15,
      y: 10,
      filter: 'blur(4px)',
    },
    visible: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: {
        type: 'spring',
        damping: 18,
        stiffness: 120,
      },
    },
  };

  if (mode === 'char') {
    const characters = Array.from(text);
    return (
      <Wrapper className={className}>
        <motion.span
          className="inline-block"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once, margin: '-40px' }}
        >
          {characters.map((char, index) => (
            <motion.span
              key={index}
              variants={childVariants}
              className="inline-block"
            >
              {char === ' ' ? '\u00A0' : char}
            </motion.span>
          ))}
        </motion.span>
      </Wrapper>
    );
  }

  return (
    <Wrapper className={className}>
      <motion.span
        className="inline-block"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once, margin: '-40px' }}
      >
        {words.map((word, index) => (
          <motion.span
            key={index}
            variants={childVariants}
            className="inline-block mr-[0.28em] last:mr-0"
          >
            {word}
          </motion.span>
        ))}
      </motion.span>
    </Wrapper>
  );
};
