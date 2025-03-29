import React, { useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { secretTasks, taskRules } from '../data/secretTasks';
import { GlobalStyle } from '../theme';
import {
  Container,
  Header,
  Title,
  Section,
  QuestionCard,
  QuestionText,
} from './styled';
import starryBackground from '../assets/starry-background.jpg';

const SecretTaskPage: React.FC = () => {
  // Get the taskId from URL parameters
  const { taskId } = useParams<{ taskId: string }>();
  
  // Check if the taskId exists in our data
  const task = taskId ? secretTasks[taskId] : undefined;
  
  // Apply the background image to document.body
  useEffect(() => {
    document.body.style.backgroundImage = `
      url(${starryBackground}),
      radial-gradient(circle at 50% 50%, rgba(25, 25, 112, 0.3) 0%, transparent 80%),
      linear-gradient(to bottom, rgba(0, 0, 0, 0.9) 0%, rgba(0, 0, 20, 0.9) 100%)
    `;
    document.body.style.backgroundSize = 'cover';
    document.body.style.backgroundPosition = 'center';
    document.body.style.backgroundRepeat = 'no-repeat';
    document.body.style.backgroundAttachment = 'fixed';
    
    return () => {
      document.body.style.backgroundImage = '';
      document.body.style.backgroundSize = '';
      document.body.style.backgroundPosition = '';
      document.body.style.backgroundRepeat = '';
      document.body.style.backgroundAttachment = '';
    };
  }, []);
  
  // If no valid task was found, redirect to home
  if (!task) {
    return <Navigate to="/" />;
  }
  
  return (
    <>
      <GlobalStyle />
      <Container>
        <Header>
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              type: 'spring',
              stiffness: 200,
              damping: 20,
              duration: 0.8
            }}
          >
            <Title>Secret Mission</Title>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <div style={{ 
                marginTop: '10px', 
                fontSize: '1.2rem', 
                fontStyle: 'italic',
                color: '#00ffff',
                textShadow: '0 0 10px #00ffff',
                fontWeight: 'bold',
                WebkitTextStroke: '1px navy'
              }}>
                Code: {task.id}
              </div>
            </motion.div>
          </motion.div>
        </Header>
        
        <Section>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <QuestionCard style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)', backdropFilter: 'blur(5px)' }}>
              <QuestionText>Your Mission</QuestionText>
              <p style={{ 
                fontSize: '1.4rem', 
                padding: '15px', 
                margin: '15px 0',
                backgroundColor: 'rgba(0, 255, 255, 0.1)', 
                borderLeft: '4px solid #00ffff',
                borderRadius: '4px',
                fontFamily: "'Poppins', sans-serif"
              }}>
                {task.description}
              </p>
              
              <div style={{ marginTop: '30px' }}>
                <h3 className="neon-text-cyan">Rules:</h3>
                <ul style={{ listStyle: 'none', padding: '0', margin: '15px 0' }}>
                  {taskRules.map((rule, index) => (
                    <li 
                      key={index}
                      style={{ 
                        padding: '10px', 
                        margin: '10px 0',
                        borderLeft: '3px solid #00ffff',
                        backgroundColor: 'rgba(0, 255, 255, 0.1)',
                      }}
                    >
                      {rule}
                    </li>
                  ))}
                </ul>
              </div>
            </QuestionCard>
          </motion.div>
        </Section>
      </Container>
    </>
  );
};

export default SecretTaskPage; 