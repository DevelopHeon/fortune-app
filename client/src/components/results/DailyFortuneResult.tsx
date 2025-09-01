import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Fab,
  Card,
  CardContent,
  Collapse,
  IconButton,
  Chip,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import RefreshIcon from '@mui/icons-material/Refresh';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import type { FortuneResponse } from '../../types/fortune';

interface DailyFortuneResultProps {
  result: FortuneResponse;
  onBack: () => void;
  onRetry: () => void;
}

interface FortuneSection {
  id: string;
  title: string;
  icon: string;
  content: string;
  color: string;
}

const DailyFortuneResult: React.FC<DailyFortuneResultProps> = ({ result, onBack, onRetry }) => {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});

  // 섹션별 아이콘과 색상 정의
  const sectionConfig = {
    '종합운': { icon: '🌟', color: '#667eea' },
    '직업': { icon: '💼', color: '#f093fb' },
    '학업': { icon: '📚', color: '#f093fb' },
    '재물': { icon: '💰', color: '#4facfe' },
    '금전': { icon: '💰', color: '#4facfe' },
    '연애': { icon: '❤️', color: '#fa709a' },
    '인간관계': { icon: '👥', color: '#fa709a' },
    '건강': { icon: '🍀', color: '#43e97b' },
    '컨디션': { icon: '🍀', color: '#43e97b' },
    '행운': { icon: '🎯', color: '#ffeaa7' },
    '조언': { icon: '🌈', color: '#a29bfe' },
  };

  // 오늘의 운세 응답을 섹션별로 파싱
  const parseSections = (text: string): FortuneSection[] => {
    const sections: FortuneSection[] = [];
    
    // ## 로 시작하는 섹션을 찾아서 분리
    const sectionRegex = /## (.+?)(?=##|$)/gs;
    let match;
    
    while ((match = sectionRegex.exec(text)) !== null) {
      const fullContent = match[1].trim();
      const lines = fullContent.split('\n');
      const titleLine = lines[0];
      const content = lines.slice(1).join('\n').trim();
      
      // 제목에서 이모지 제거하고 키워드 추출
      const title = titleLine.replace(/[🌟💼💰❤️🍀🎯🌈📚👥]/g, '').trim();
      
      // 키워드를 기반으로 섹션 설정 찾기
      let config = { icon: '📋', color: '#74b9ff' }; // 기본값
      
      for (const [keyword, conf] of Object.entries(sectionConfig)) {
        if (title.includes(keyword)) {
          config = conf;
          break;
        }
      }
      
      sections.push({
        id: title.replace(/[^a-zA-Z0-9가-힣]/g, ''),
        title: titleLine,
        icon: config.icon,
        content: content,
        color: config.color,
      });
    }
    
    return sections;
  };

  const sections = parseSections(result.result);

  // 섹션 토글
  const handleSectionToggle = (sectionId: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  // 모든 섹션 펼치기/접기
  const handleToggleAll = () => {
    const allExpanded = sections.every(section => expandedSections[section.id]);
    const newState: Record<string, boolean> = {};
    sections.forEach(section => {
      newState[section.id] = !allExpanded;
    });
    setExpandedSections(newState);
  };

  // 텍스트 포맷팅
  const formatContent = (content: string) => {
    const lines = content.split('\n');
    return lines.map((line, index) => {
      if (line.trim() === '') return <br key={index} />;
      
      // 강조 텍스트 (**텍스트**)
      if (line.includes('**')) {
        const formattedLine = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        return (
          <Typography key={index} variant="body1" sx={{ 
            lineHeight: 1.7,
            mb: 0.5
          }} dangerouslySetInnerHTML={{ __html: formattedLine }} />
        );
      }
      
      // 리스트 항목
      if (line.trim().startsWith('-')) {
        return (
          <Typography key={index} variant="body1" sx={{ 
            lineHeight: 1.7,
            mb: 0.5,
            pl: 2
          }}>
            • {line.trim().substring(1).trim()}
          </Typography>
        );
      }
      
      // 일반 텍스트
      return (
        <Typography key={index} variant="body1" sx={{ 
          lineHeight: 1.7,
          mb: 0.5
        }}>
          {line}
        </Typography>
      );
    });
  };

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'flex-start', 
      py: 3, 
      px: 2,
      width: '100%'
    }}>
      {/* 헤더 */}
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        mb: 3,
        width: '100%',
        maxWidth: '800px'
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
          🌟 오늘의 운세
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

      {/* 생성 시간 및 전체 펼치기/접기 */}
      <Box sx={{ mb: 3, textAlign: 'center', width: '100%', maxWidth: '800px' }}>
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
          해석 생성 시간: {new Date(result.createdAt).toLocaleString('ko-KR')}
        </Typography>
        <Button 
          variant="text" 
          size="small" 
          onClick={handleToggleAll}
          sx={{ fontSize: '0.8rem' }}
        >
          {sections.every(section => expandedSections[section.id]) ? '모두 접기' : '모두 펼치기'}
        </Button>
      </Box>

      {/* 섹션별 카드 */}
      <Box sx={{ 
        display: 'flex', 
        flexWrap: 'nowrap', 
        gap: { xs: 0.5, sm: 1 }, 
        justifyContent: 'center',
        mb: 2,
        width: '100%',
        maxWidth: '800px'
      }}>
        {sections.map((section) => (
          <Box key={section.id} sx={{ 
            flex: '1 1 0', 
            minWidth: 0,
            maxWidth: `${100/sections.length}%`
          }}>
            <Card 
              sx={{ 
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 4,
                },
                border: '2px solid',
                borderColor: expandedSections[section.id] ? section.color : 'transparent',
              }}
              onClick={() => handleSectionToggle(section.id)}
            >
              <CardContent sx={{ textAlign: 'center', py: 1, px: 0.5 }}>
                <Typography 
                  variant="h3" 
                  sx={{ 
                    fontSize: { xs: '1.2rem', sm: '1.5rem' },
                    mb: 0.3,
                    filter: expandedSections[section.id] ? 'none' : 'grayscale(50%)',
                  }}
                >
                  {section.icon}
                </Typography>
                <Typography 
                  variant="caption" 
                  sx={{ 
                    fontWeight: 'bold',
                    color: section.color,
                    mb: 0.3,
                    fontSize: { xs: '0.6rem', sm: '0.7rem' },
                    display: 'block',
                    lineHeight: 1.1,
                    wordBreak: 'keep-all'
                  }}
                >
                  {section.title.replace(/[🌟💼💰❤️🍀🎯🌈📚👥]/g, '').trim()}
                </Typography>
                <Chip 
                  label={expandedSections[section.id] ? '닫기' : '보기'}
                  size="small"
                  sx={{ 
                    backgroundColor: section.color,
                    color: 'white',
                    fontSize: { xs: '0.5rem', sm: '0.6rem' },
                    height: { xs: '16px', sm: '18px' }
                  }}
                />
              </CardContent>
            </Card>
          </Box>
        ))}
      </Box>

      {/* 확장된 섹션 내용 */}
      <Box sx={{ width: '100%', maxWidth: '800px' }}>
        {sections.map((section) => (
          <Collapse key={`content-${section.id}`} in={expandedSections[section.id]}>
            <Paper 
              elevation={1} 
              sx={{ 
                mt: 2, 
                p: 3, 
                borderRadius: 2,
                borderLeft: `5px solid ${section.color}`,
              }}
            >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Typography variant="h2" sx={{ fontSize: '1.5rem', mr: 1 }}>
                {section.icon}
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 'bold', color: section.color }}>
                {section.title.replace(/[🌟💼💰❤️🍀🎯🌈📚👥]/g, '').trim()}
              </Typography>
              <Box sx={{ ml: 'auto' }}>
                <IconButton 
                  onClick={() => handleSectionToggle(section.id)}
                  sx={{ 
                    transform: 'rotate(180deg)',
                    transition: 'transform 0.3s ease'
                  }}
                >
                  <ExpandMoreIcon />
                </IconButton>
              </Box>
            </Box>
            
            <Box sx={{ 
              backgroundColor: 'grey.50', 
              p: 2, 
              borderRadius: 1,
              border: '1px solid',
              borderColor: 'grey.200'
            }}>
              {formatContent(section.content)}
            </Box>
            </Paper>
          </Collapse>
        ))}
      </Box>

      {/* 안내 메시지 */}
      <Paper elevation={1} sx={{ 
        mt: 4,
        p: 3,
        backgroundColor: 'grey.50',
        borderRadius: 2,
        border: '1px solid',
        borderColor: 'grey.200',
        width: '100%',
        maxWidth: '800px'
      }}>
        <Typography variant="body2" color="text.secondary" sx={{ 
          fontStyle: 'italic',
          textAlign: 'center'
        }}>
          💡 이 해석은 AI가 개인 정보와 오늘 날짜를 기반으로 생성한 참고용 내용입니다. 
          개인의 노력과 선택에 따라 하루는 언제든 달라질 수 있습니다.
        </Typography>
      </Paper>

      {/* 하단 액션 버튼 */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center',
        gap: 2,
        mt: 4,
        width: '100%',
        maxWidth: '800px'
      }}>
        <Button 
          variant="outlined" 
          onClick={onBack}
          size="large"
          startIcon={<ArrowBackIcon />}
        >
          메인으로 돌아가기
        </Button>
        <Button 
          variant="contained" 
          onClick={onRetry}
          size="large"
          startIcon={<RefreshIcon />}
        >
          새로운 운세 보기
        </Button>
      </Box>

      {/* 플로팅 버튼 (모바일용) */}
      <Fab 
        color="primary" 
        aria-label="back"
        onClick={onBack}
        sx={{ 
          position: 'fixed', 
          bottom: 16, 
          right: 16,
          display: { xs: 'flex', sm: 'none' }
        }}
      >
        <ArrowBackIcon />
      </Fab>
    </Box>
  );
};

export default DailyFortuneResult;