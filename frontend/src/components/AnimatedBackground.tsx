import React, { useMemo } from 'react';
import { Box } from '@mui/material';

interface AnimatedBackgroundProps {
  enabled?: boolean;
}

const AnimatedBackground: React.FC<AnimatedBackgroundProps> = ({ enabled = false }) => {
  const floatingWords = [
    '知识', '分享', '连接', '数据', '社区', '学习', '成长', '交流',
    '探索', '创新', '协作', '启发', '思考', '进步', '共建', '未来',
    'Knowledge', 'Share', 'Connect', 'Data', 'Community', 'Learn',
    'Growth', 'Explore', 'Innovation', 'Inspire', 'Think', 'Progress',
    '迷茫', '重复', '困惑', '标准答案', '孤岛','内卷'
  ];

  const floatingWordsConfig = useMemo(() => {
    if (!enabled) return [];
    
    return Array.from({ length: 40 }).map(() => {
      const word = floatingWords[Math.floor(Math.random() * floatingWords.length)];
      return {
        word,
        left: Math.random() * 100,
        top: Math.random() * 100,
        fontSize: Math.random() * 10 + 12,
        isEnglish: /^[A-Za-z]+$/.test(word),
        colorIndex: Math.floor(Math.random() * 3),
        baseOpacity: Math.random() * 0.4 + 0.2,
        glowSize: Math.random() * 15 + 5,
        floatDuration: Math.random() * 15 + 20,
        pulseDuration: Math.random() * 4 + 3,
        animationDelay: Math.random() * 5,
        translateX1: Math.random() * 80 - 40,
        translateY1: Math.random() * 80 - 40,
        scale1: Math.random() * 0.4 + 0.9,
        translateX2: Math.random() * 80 - 40,
        translateY2: Math.random() * 80 - 40,
        scale2: Math.random() * 0.4 + 1.1,
        opacityMin: Math.random() * 0.2 + 0.15,
        opacityMax: Math.random() * 0.5 + 0.35,
      };
    });
  }, [enabled]);

  const connectionLinesConfig = useMemo(() => {
    if (!enabled) return [];
    
    return Array.from({ length: 20 }).map(() => ({
      x1: Math.random() * 100,
      y1: Math.random() * 100,
      x2: Math.random() * 100,
      y2: Math.random() * 100,
      colorIndex: Math.floor(Math.random() * 2),
      duration: Math.random() * 5 + 3,
    }));
  }, [enabled]);

  if (!enabled) return null;

  return (
    <>
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 0,
          overflow: 'hidden',
        }}
      >
        {floatingWordsConfig.map((config, index) => {
          const colors = ['#00E5FF', '#BB86FC', '#ffffff'];
          
          return (
            <Box
              key={index}
              sx={{
                position: 'absolute',
                left: `${config.left}%`,
                top: `${config.top}%`,
                fontSize: `${config.fontSize}px`,
                fontWeight: config.isEnglish ? 400 : 500,
                color: colors[config.colorIndex],
                opacity: config.baseOpacity,
                textShadow: `0 0 ${config.glowSize}px currentColor`,
                whiteSpace: 'nowrap',
                userSelect: 'none',
                pointerEvents: 'none',
                animation: `
                  float-${index} ${config.floatDuration}s ease-in-out infinite,
                  pulse-${index} ${config.pulseDuration}s ease-in-out infinite alternate
                `,
                animationDelay: `${config.animationDelay}s`,
                [`@keyframes float-${index}`]: {
                  '0%, 100%': {
                    transform: `translate(0, 0) scale(1)`,
                  },
                  '33%': {
                    transform: `translate(${config.translateX1}px, ${config.translateY1}px) scale(${config.scale1})`,
                  },
                  '66%': {
                    transform: `translate(${config.translateX2}px, ${config.translateY2}px) scale(${config.scale2})`,
                  },
                },
                [`@keyframes pulse-${index}`]: {
                  '0%': {
                    opacity: config.opacityMin,
                  },
                  '100%': {
                    opacity: config.opacityMax,
                  },
                },
              }}
            >
              {config.word}
            </Box>
          );
        })}
        
        <svg
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            opacity: 0.15,
          }}
        >
          {connectionLinesConfig.map((config, index) => {
            const colors = ['#00E5FF', '#BB86FC'];
            return (
              <line
                key={index}
                x1={`${config.x1}%`}
                y1={`${config.y1}%`}
                x2={`${config.x2}%`}
                y2={`${config.y2}%`}
                stroke={colors[config.colorIndex]}
                strokeWidth="1"
                style={{
                  animation: `lineOpacity ${config.duration}s ease-in-out infinite alternate`,
                }}
              />
            );
          })}
        </svg>
      </Box>

      <style>
        {`
          @keyframes lineOpacity {
            0% { opacity: 0.05; }
            100% { opacity: 0.2; }
          }
        `}
      </style>
    </>
  );
};

export default AnimatedBackground;
