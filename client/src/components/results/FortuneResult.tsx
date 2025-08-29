import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Divider,
  Container,
  Fab,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import RefreshIcon from '@mui/icons-material/Refresh';
import type { FortuneResponse } from '../../types/fortune';

interface FortuneResultProps {
  result: FortuneResponse;
  onBack: () => void;
  onRetry: () => void;
}

const FortuneResult: React.FC<FortuneResultProps> = ({ result, onBack, onRetry }) => {
  // 결과 텍스트를 섹션별로 분리
  const formatResult = (text: string) => {
    const sections = text.split(/(?=##|\*\*)/);
    
    return sections.map((section, index) => {
      if (section.trim() === '') return null;
      
      // 제목 섹션 (##으로 시작)
      if (section.startsWith('##')) {
        const title = section.replace('##', '').trim();
        return (
          <Box key={index} sx={{ mb: 3 }}>
            <Typography variant="h6" component="h3" sx={{ 
              fontWeight: 'bold',
              color: 'primary.main',
              mb: 1,
              borderLeft: '4px solid',
              borderColor: 'primary.main',
              paddingLeft: 2,
            }}>
              {title}
            </Typography>
          </Box>
        );
      }
      
      // 일반 텍스트
      return (
        <Box key={index} sx={{ mb: 2 }}>
          <Typography variant="body1" sx={{ 
            lineHeight: 1.8,
            textAlign: 'justify',
            color: 'text.primary',
          }}>
            {section.trim()}
          </Typography>
        </Box>
      );
    });
  };

  return (
    <Container maxWidth="md" sx={{ py: 3 }}>
      {/* 헤더 */}
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        mb: 3 
      }}>
        <Button 
          startIcon={<ArrowBackIcon />}
          onClick={onBack}
          color="inherit"
        >
          돌아가기
        </Button>
        
        <Typography variant="h4" component="h1" sx={{ 
          fontWeight: 'bold',
          background: 'linear-gradient(45deg, #667eea, #764ba2)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}>
          🔮 사주 해석 결과
        </Typography>

        <Button 
          startIcon={<RefreshIcon />}
          onClick={onRetry}
          variant="outlined"
          size="small"
        >
          다시 보기
        </Button>
      </Box>

      {/* 결과 표시 */}
      <Paper elevation={2} sx={{ p: 4, borderRadius: 2 }}>
        {/* 생성 시간 */}
        <Box sx={{ mb: 3, textAlign: 'center' }}>
          <Typography variant="caption" color="text.secondary">
            해석 생성 시간: {new Date(result.timestamp).toLocaleString('ko-KR')}
          </Typography>
        </Box>

        <Divider sx={{ mb: 3 }} />

        {/* 해석 결과 */}
        <Box sx={{ mb: 4 }}>
          {formatResult(result.result)}
        </Box>

        <Divider sx={{ mb: 3 }} />

        {/* 안내 메시지 */}
        <Box sx={{ 
          backgroundColor: 'grey.50',
          p: 3,
          borderRadius: 1,
          border: '1px solid',
          borderColor: 'grey.200',
        }}>
          <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
            💡 이 해석은 AI가 전통 사주명리학을 기반으로 생성한 참고용 내용입니다. 
            개인의 노력과 선택에 따라 운명은 언제든 바뀔 수 있습니다.
          </Typography>
        </Box>

        {/* 액션 버튼 */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center',
          gap: 2,
          mt: 4 
        }}>
          <Button 
            variant="outlined" 
            onClick={onBack}
            size="large"
          >
            메인으로 돌아가기
          </Button>
          <Button 
            variant="contained" 
            onClick={onRetry}
            size="large"
          >
            새로운 사주 보기
          </Button>
        </Box>
      </Paper>

      {/* 플로팅 버튼 */}
      <Fab 
        color="primary" 
        aria-label="back"
        onClick={onBack}
        sx={{ 
          position: 'fixed', 
          bottom: 16, 
          right: 16,
          display: { xs: 'flex', sm: 'none' } // 모바일에서만 표시
        }}
      >
        <ArrowBackIcon />
      </Fab>
    </Container>
  );
};

export default FortuneResult;