import React, { useState } from 'react';
import {
  Container,
  Typography,
  Grid,
  Box,
  Alert,
  Snackbar,
} from '@mui/material';
import FortuneCard from '../components/cards/FortuneCard';
import BirthInfoModal from '../components/modals/BirthInfoModal';
import FortuneResult from '../components/results/FortuneResult';
import type { FortuneCard as FortuneCardType, BirthInfo, FortuneResponse, ApiState } from '../types/fortune';
import { FortuneType } from '../types/fortune';
import { getSajuFortune } from '../services/fortuneService';

// 운세 카드 데이터
const fortuneCards: FortuneCardType[] = [
  {
    type: FortuneType.SAJU,
    title: '사주 운세',
    description: '생년월일과 생시를 바탕으로 한 전통 사주명리학 해석',
    icon: '🔮',
    enabled: true,
  },
  {
    type: FortuneType.TAROT,
    title: '타로 운세',
    description: '카드를 통해 현재 상황과 미래를 점쳐보세요',
    icon: '🎴',
    enabled: false,
    comingSoon: true,
  },
  {
    type: FortuneType.DAILY,
    title: '오늘의 운세',
    description: '오늘 하루의 운세와 조언을 확인해보세요',
    icon: '🌟',
    enabled: false,
    comingSoon: true,
  },
];

const Home: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [, setSelectedCard] = useState<FortuneCardType | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '' });

  // API 상태 관리
  const [apiState, setApiState] = useState<ApiState<FortuneResponse>>({
    data: null,
    loading: false,
    error: null,
  });

  // 카드 클릭 처리
  const handleCardClick = (card: FortuneCardType) => {
    if (!card.enabled) return;

    setSelectedCard(card);
    if (card.type === FortuneType.SAJU) {
      setModalOpen(true);
    }
  };

  // 모달 닫기
  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedCard(null);
    setApiState(prev => ({ ...prev, error: null }));
  };

  // 사주 해석 요청
  const handleSajuSubmit = async (birthInfo: BirthInfo) => {
    setApiState({ data: null, loading: true, error: null });

    try {
      const result = await getSajuFortune(birthInfo);
      setApiState({ data: result, loading: false, error: null });
      setModalOpen(false);
      setShowResult(true);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '사주 해석 중 오류가 발생했습니다';
      setApiState({ data: null, loading: false, error: errorMessage });
    }
  };

  // 결과에서 뒤로가기
  const handleBackToHome = () => {
    setShowResult(false);
    setApiState({ data: null, loading: false, error: null });
    setSelectedCard(null);
  };

  // 다시 시도
  const handleRetry = () => {
    setShowResult(false);
    setModalOpen(true);
  };

  // 스낵바 닫기
  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // 결과 화면 표시
  if (showResult && apiState.data) {
    return (
      <FortuneResult
        result={apiState.data}
        onBack={handleBackToHome}
        onRetry={handleRetry}
      />
    );
  }

  // 메인 화면
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* 헤더 */}
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography variant="h2" component="h1" sx={{ 
          fontWeight: 'bold',
          background: 'linear-gradient(45deg, #667eea, #764ba2)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          mb: 2,
          fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' }
        }}>
          🔮 Fortune App
        </Typography>
        <Typography variant="h5" color="text.secondary" sx={{ mb: 1 }}>
          AI가 전해주는 당신의 운명
        </Typography>
        <Typography variant="body1" color="text.secondary">
          원하는 운세 유형을 선택하여 시작해보세요
        </Typography>
      </Box>

      {/* 카드 그리드 */}
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <Grid container spacing={4} justifyContent="center" sx={{ maxWidth: 1000 }}>
          {fortuneCards.map((card) => (
            <Grid item xs={12} sm={6} md={4} key={card.type} sx={{ display: 'flex', justifyContent: 'center' }}>
              <FortuneCard
                card={card}
                onClick={() => handleCardClick(card)}
              />
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* 안내 메시지 */}
      <Box sx={{ mt: 6, textAlign: 'center' }}>
        <Alert severity="info" sx={{ maxWidth: 600, mx: 'auto' }}>
          현재 <strong>사주 운세</strong>만 이용 가능합니다. 
          타로 운세와 오늘의 운세는 곧 만나보실 수 있습니다! 🚀
        </Alert>
      </Box>

      {/* 생년월일 입력 모달 */}
      <BirthInfoModal
        open={modalOpen}
        onClose={handleModalClose}
        onSubmit={handleSajuSubmit}
        loading={apiState.loading}
        error={apiState.error}
      />

      {/* 스낵바 (알림) */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleSnackbarClose} severity="info" sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Home;