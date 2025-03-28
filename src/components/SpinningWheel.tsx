import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useGame } from '../context/GameContext';
import { theme } from '../theme';
import { Section, Message, Button } from './styled';

const SpinningWheel: React.FC = () => {
  const { state, spinWheel, choosePlayerManually } = useGame();
  const { players, isWheelSpinning, currentPlayer, lastPlayer, isLastPlayerChoosing } = state;
  const [rotation, setRotation] = useState(0);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  
  // Handle window resize
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Remove the lastPlayer from available players
  const availablePlayers = players.filter(player => player.id !== lastPlayer?.id);
  
  // Prepare wheel segments
  const wheelSegments = [...availablePlayers];
  
  // Add "Last player chooses" segment after the first game if there is a last player
  if (state.gameHistory.length > 0 && lastPlayer) {
    wheelSegments.push({ id: 'last-player-chooses', name: 'Last player chooses', timesChosen: 0 });
  }
  
  // Calculate sizes based on screen width
  const isMobile = windowWidth <= 768;
  const wheelSize = isMobile ? 300 : 400;
  const buttonSize = isMobile ? 80 : 100;
  const radius = wheelSize / 2;
  const centerX = radius;
  const centerY = radius;
  
  // Wheel spinning animation
  useEffect(() => {
    let spinInterval: NodeJS.Timeout | null = null;
    
    if (isWheelSpinning) {
      // Initial fast spin
      spinInterval = setInterval(() => {
        setRotation(prev => prev + 20);
      }, 50);
      
      // Slow down gradually
      setTimeout(() => {
        if (spinInterval) clearInterval(spinInterval);
        
        spinInterval = setInterval(() => {
          setRotation(prev => prev + 10);
        }, 80);
        
        setTimeout(() => {
          if (spinInterval) clearInterval(spinInterval);
          
          spinInterval = setInterval(() => {
            setRotation(prev => prev + 5);
          }, 100);
          
          setTimeout(() => {
            if (spinInterval) clearInterval(spinInterval);
          }, 500);
        }, 1000);
      }, 1500);
    }
    
    return () => {
      if (spinInterval) clearInterval(spinInterval);
    };
  }, [isWheelSpinning]);
  
  const handleSpin = () => {
    if (!isWheelSpinning && wheelSegments.length > 0) {
      // Reset rotation to avoid too large numbers
      setRotation(prev => prev % 360);
      spinWheel();
    }
  };
  
  // Function to create an SVG segment path
  const createSegmentPath = (index: number, total: number) => {
    if (total === 0) return '';
    
    const angle = 360 / total;
    const startAngle = index * angle;
    const endAngle = (index + 1) * angle;
    
    // Convert angles to radians
    const startRad = (startAngle - 90) * (Math.PI / 180);
    const endRad = (endAngle - 90) * (Math.PI / 180);
    
    // Calculate points
    const x1 = centerX + radius * Math.cos(startRad);
    const y1 = centerY + radius * Math.sin(startRad);
    const x2 = centerX + radius * Math.cos(endRad);
    const y2 = centerY + radius * Math.sin(endRad);
    
    // Create path
    const largeArcFlag = angle > 180 ? 1 : 0;
    
    return `M ${centerX} ${centerY} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
  };
  
  // Calculate label position
  const getLabelPosition = (index: number, total: number) => {
    if (total === 0) return { x: centerX, y: centerY, angle: 0 };
    
    const angle = 360 / total;
    const midAngle = ((index * angle) + (index + 1) * angle) / 2;
    const midRad = (midAngle - 90) * (Math.PI / 180);
    
    // Position label at about 65% from center to edge
    const distance = radius * 0.65;
    const x = centerX + distance * Math.cos(midRad);
    const y = centerY + distance * Math.sin(midRad);
    
    return { x, y, angle: midAngle };
  };
  
  return (
    <Section>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        {isLastPlayerChoosing ? (
          <div>
            <Message>
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <h3 className="neon-text-pink">Last player chooses!</h3>
                <p>{lastPlayer?.name}, choose who's playing next:</p>
              </motion.div>
            </Message>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <div style={{ 
                display: 'flex', 
                flexWrap: 'wrap', 
                justifyContent: 'center', 
                gap: '15px', 
                marginTop: '25px' 
              }}>
                {availablePlayers.map(player => (
                  <motion.div
                    key={player.id}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      onClick={() => choosePlayerManually(player.id)}
                      $color="secondary"
                    >
                      <span className="neon-text-pink">{player.name}</span>
                    </Button>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        ) : (
          <>
            {currentPlayer ? (
              <Message>
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <h3 className="neon-text">{currentPlayer.name}'s Turn!</h3>
                </motion.div>
              </Message>
            ) : (
              <div style={{ position: 'relative', height: `${wheelSize + 50}px`, marginTop: '20px' }}>
                {/* SVG Wheel */}
                <div style={{ 
                  position: 'relative',
                  width: `${wheelSize}px`,
                  height: `${wheelSize}px`,
                  margin: '0 auto',
                }}>
                  <svg
                    width={wheelSize}
                    height={wheelSize}
                    viewBox={`0 0 ${wheelSize} ${wheelSize}`}
                    style={{ 
                      transform: `rotate(${rotation}deg)`,
                      transformOrigin: 'center',
                      transition: isWheelSpinning ? 'none' : 'transform 0.5s ease-out',
                    }}
                  >
                    {/* Wheel outline */}
                    <circle
                      cx={centerX}
                      cy={centerY}
                      r={radius - 2}
                      fill="rgba(10, 10, 30, 0.8)"
                      stroke={theme.colors.primary}
                      strokeWidth="4"
                      filter={`drop-shadow(0 0 10px ${theme.colors.primary})`}
                    />
                    
                    {/* Wheel segments */}
                    {wheelSegments.map((segment, index) => {
                      const isSpecial = segment.id === 'last-player-chooses';
                      
                      // Use three colors (cyan, magenta, purple) with modulo 3 pattern
                      let bgColor, borderColor, glowColor;
                      
                      switch (index % 3) {
                        case 0: // Cyan
                          bgColor = 'rgba(0, 255, 255, 0.2)';
                          borderColor = 'rgba(0, 255, 255, 0.4)';
                          glowColor = theme.colors.primary;
                          break;
                        case 1: // Magenta
                          bgColor = 'rgba(255, 0, 255, 0.2)';
                          borderColor = 'rgba(255, 0, 255, 0.4)';
                          glowColor = theme.colors.secondary;
                          break;
                        case 2: // Purple
                          bgColor = 'rgba(153, 0, 255, 0.2)';
                          borderColor = 'rgba(153, 0, 255, 0.4)';
                          glowColor = theme.colors.accent;
                          break;
                      }
                      
                      const path = createSegmentPath(index, wheelSegments.length);
                      const labelPos = getLabelPosition(index, wheelSegments.length);
                      
                      return (
                        <g key={segment.id}>
                          {/* Segment */}
                          <path
                            d={path}
                            fill={bgColor}
                            stroke={borderColor}
                            strokeWidth="1"
                          />
                          
                          {/* Label */}
                          <g
                            transform={`translate(${labelPos.x}, ${labelPos.y}) rotate(${labelPos.angle})`}
                          >
                            <foreignObject
                              x={-60}
                              y={-15}
                              width="120"
                              height="30"
                              style={{
                                overflow: 'visible',
                                pointerEvents: 'none',
                              }}
                            >
                              <div
                                style={{
                                  backgroundColor: 'rgba(0, 0, 0, 0.6)',
                                  borderRadius: '4px',
                                  padding: isMobile ? '3px 6px' : '5px 8px',
                                  border: '1px solid rgba(255, 255, 255, 0.2)',
                                  boxShadow: '0 0 10px rgba(0, 0, 0, 0.8)',
                                  display: 'flex',
                                  justifyContent: 'center',
                                  transform: `rotate(${-labelPos.angle}deg)`,
                                  maxWidth: isMobile ? '100px' : '120px',
                                  margin: '0 auto',
                                }}
                              >
                                <span
                                  className={isSpecial ? 'neon-text-pink' : index % 3 === 0 ? 'neon-text' : index % 3 === 1 ? 'neon-text-pink' : 'neon-text-purple'}
                                  style={{
                                    fontSize: isMobile ? '0.8rem' : '1rem',
                                    fontWeight: 'bold',
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    maxWidth: '100%',
                                  }}
                                >
                                  {segment.name}
                                </span>
                              </div>
                            </foreignObject>
                          </g>
                        </g>
                      );
                    })}
                    
                    {/* Center dot */}
                    <circle
                      cx={centerX}
                      cy={centerY}
                      r={isMobile ? 8 : 10}
                      fill="white"
                      filter="drop-shadow(0 0 5px rgba(255, 255, 255, 0.8))"
                    />
                  </svg>
                  
                  {/* Spin Button */}
                  <div
                    style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      width: `${buttonSize}px`,
                      height: `${buttonSize}px`,
                      borderRadius: '50%',
                      backgroundColor: 'rgba(0, 0, 20, 0.8)',
                      border: `2px solid ${isWheelSpinning ? 'transparent' : theme.colors.primary}`,
                      boxShadow: isWheelSpinning ? 'none' : `0 0 15px ${theme.colors.primary}`,
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      cursor: isWheelSpinning || wheelSegments.length === 0 ? 'not-allowed' : 'pointer',
                      opacity: isWheelSpinning || wheelSegments.length === 0 ? 0.5 : 1,
                      transition: 'all 0.3s ease',
                      zIndex: 10,
                    }}
                    onClick={handleSpin}
                  >
                    <span
                      className="neon-text"
                      style={{
                        fontSize: isMobile ? '1rem' : '1.2rem',
                        fontWeight: 'bold',
                        letterSpacing: '2px',
                      }}
                    >
                      SPIN
                    </span>
                  </div>
                </div>
                
                {/* Pointer */}
                <div
                  style={{
                    position: 'absolute',
                    top: '-5px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    zIndex: 5,
                    width: isMobile ? '30px' : '40px',
                    height: isMobile ? '30px' : '40px',
                  }}
                >
                  <svg width="100%" height="100%" viewBox="0 0 40 40">
                    <path
                      d="M20 0 L30 15 L10 15 Z"
                      fill="#ff00ff"
                      filter="drop-shadow(0 0 5px rgba(255, 0, 255, 0.8))"
                    />
                  </svg>
                </div>
              </div>
            )}

            {availablePlayers.length === 0 && !currentPlayer && (
              <Message $type="error">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  Please add some players to start the game.
                </motion.div>
              </Message>
            )}

            {availablePlayers.length === 0 && lastPlayer && (
              <Message $type="error">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  Please add more players to continue.
                </motion.div>
              </Message>
            )}
          </>
        )}
      </motion.div>
    </Section>
  );
};

export default SpinningWheel;
