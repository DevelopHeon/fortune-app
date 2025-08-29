import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
} from '@mui/material';
import type { FortuneCard as FortuneCardType } from '../../types/fortune';

interface FortuneCardProps {
  card: FortuneCardType;
  onClick: () => void;
}

const FortuneCard: React.FC<FortuneCardProps> = ({ card, onClick }) => {
  return (
    <Card
      sx={{
        width: 280,
        minHeight: 220,
        cursor: card.enabled ? 'pointer' : 'not-allowed',
        opacity: card.enabled ? 1 : 0.6,
        transition: 'all 0.3s ease',
        position: 'relative',
        '&:hover': card.enabled ? {
          transform: 'translateY(-4px)',
          boxShadow: 4,
        } : {},
        background: card.enabled
          ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
          : 'linear-gradient(135deg, #bdc3c7 0%, #95a5a6 100%)',
        color: 'white',
      }}
      onClick={card.enabled ? onClick : undefined}
    >
      <CardContent sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        padding: 3,
      }}>
        {/* 카드 아이콘 */}
        <Box sx={{ fontSize: '3rem', mb: 2 }}>
          {card.icon}
        </Box>

        {/* 카드 제목 */}
        <Typography variant="h5" component="h2" sx={{ mb: 1, fontWeight: 'bold' }}>
          {card.title}
        </Typography>

        {/* 카드 설명 */}
        <Typography variant="body2" sx={{ mb: 2, opacity: 0.9 }}>
          {card.description}
        </Typography>

        {/* 상태 표시 */}
        {card.comingSoon && (
          <Chip 
            label="준비중" 
            size="small"
            sx={{ 
              backgroundColor: 'rgba(255,255,255,0.2)',
              color: 'white',
            }}
          />
        )}

        {card.enabled && (
          <Typography variant="caption" sx={{ mt: 1, opacity: 0.8 }}>
            클릭하여 시작하기
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default FortuneCard;