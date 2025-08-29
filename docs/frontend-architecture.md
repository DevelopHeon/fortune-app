# Frontend Architecture Design (Feature-Sliced Design)

## Overview

FitnessTracker 프론트엔드는 **Feature-Sliced Design (FSD)** 아키텍처를 채택하여 확장성, 유지보수성, 그리고 개발자 경험을 최적화합니다.

FSD는 계층형 아키텍처로서 코드를 비즈니스 로직에 따라 구조화하며, 명확한 의존성 규칙을 통해 코드의 일관성을 보장합니다.

## FSD 계층 구조

```
client/src/
├── 📱 app/          # Application Layer (최상위)
├── 📄 pages/        # Pages Layer
├── 🧩 widgets/      # Widgets Layer  
├── ⚡ features/     # Features Layer
├── 🏢 entities/     # Entities Layer
└── 🔧 shared/       # Shared Layer (최하위)
```

### 의존성 규칙 (Dependency Rule)

```
app → pages → widgets → features → entities → shared
 ↓      ↓        ↓         ↓          ↓         ↓
상위 계층은 하위 계층만 import 가능
같은 계층 간 import 금지
shared는 모든 계층에서 import 가능
```

## 계층별 상세 설계

### 1. Shared Layer (`/shared`)
**목적**: 프로젝트 전반에서 재사용되는 공통 코드

```
shared/
├── api/              # API 설정 및 HTTP 클라이언트
│   ├── base.ts       # Axios 인스턴스 설정
│   ├── interceptors.ts # Request/Response 인터셉터
│   └── types.ts      # API 공통 타입
├── config/           # 앱 설정
│   ├── constants.ts  # 상수 정의
│   ├── env.ts        # 환경 변수
│   └── routes.ts     # 라우트 상수
├── lib/              # 외부 라이브러리 설정
│   ├── react-query.ts # React Query 설정
│   ├── chart.ts      # Chart.js 설정
│   └── date.ts       # date-fns 설정
├── ui/               # 재사용 가능한 UI 컴포넌트
│   ├── Button/       # 버튼 컴포넌트
│   ├── Input/        # 입력 컴포넌트
│   ├── Modal/        # 모달 컴포넌트
│   ├── Card/         # 카드 컴포넌트
│   ├── Table/        # 테이블 컴포넌트
│   └── index.ts      # 컴포넌트 export
└── utils/            # 유틸리티 함수
    ├── validation.ts # 입력 검증 함수
    ├── formatters.ts # 데이터 포맷팅
    ├── calculations.ts # 수학 계산
    └── storage.ts    # 로컬 스토리지 유틸
```

**주요 컴포넌트**:
```typescript
// shared/ui/Button/Button.tsx
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}

// shared/api/base.ts
export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
});
```

### 2. Entities Layer (`/entities`)
**목적**: 비즈니스 엔티티의 데이터 모델과 API 로직

```
entities/
├── user/
│   ├── model/        # 사용자 상태 관리
│   │   ├── store.ts  # Zustand store
│   │   └── types.ts  # 타입 정의
│   ├── api/          # 사용자 API
│   │   ├── queries.ts # React Query hooks
│   │   └── mutations.ts
│   └── index.ts      # Public API
├── workout/
│   ├── model/
│   │   ├── store.ts
│   │   └── types.ts
│   ├── api/
│   │   ├── queries.ts
│   │   └── mutations.ts
│   └── index.ts
├── exercise/
├── goal/
└── statistics/
```

**Example Entity**:
```typescript
// entities/workout/model/types.ts
export interface WorkoutSession {
  id: number;
  name: string;
  sessionDate: string;
  durationMinutes?: number;
  totalVolume: number;
  notes?: string;
  recordsCount: number;
}

// entities/workout/api/queries.ts
export const useWorkoutSessions = (params: WorkoutSessionsParams) => {
  return useQuery({
    queryKey: ['workoutSessions', params],
    queryFn: () => workoutApi.getSessions(params),
  });
};

// entities/workout/model/store.ts
export const useWorkoutStore = create<WorkoutStore>((set) => ({
  currentSession: null,
  setCurrentSession: (session) => set({ currentSession: session }),
}));
```

### 3. Features Layer (`/features`)
**목적**: 사용자 액션과 연결된 비즈니스 기능

```
features/
├── auth/             # 인증 기능
│   ├── ui/
│   │   ├── LoginForm.tsx
│   │   ├── RegisterForm.tsx
│   │   └── LogoutButton.tsx
│   ├── model/
│   │   ├── store.ts  # 인증 상태 관리
│   │   └── validation.ts
│   ├── api/
│   │   ├── mutations.ts
│   │   └── types.ts
│   └── index.ts
├── workout/          # 운동 관리
│   ├── ui/
│   │   ├── WorkoutForm.tsx
│   │   ├── WorkoutList.tsx
│   │   ├── WorkoutCard.tsx
│   │   └── SessionTimer.tsx
│   ├── model/
│   │   ├── store.ts
│   │   ├── validation.ts
│   │   └── calculations.ts
│   ├── api/
│   │   └── mutations.ts
│   └── index.ts
├── exercise/         # 운동 종목 관리
├── goal/            # 목표 관리
├── statistics/      # 통계 및 분석
└── profile/         # 프로필 관리
```

**Feature Example**:
```typescript
// features/auth/ui/LoginForm.tsx
export const LoginForm = () => {
  const loginMutation = useLogin();
  const { register, handleSubmit, formState } = useForm<LoginData>();

  const onSubmit = (data: LoginData) => {
    loginMutation.mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Input
        {...register('email', { required: true })}
        label="Email"
        error={formState.errors.email?.message}
      />
      <Input
        {...register('password', { required: true })}
        type="password"
        label="Password"
        error={formState.errors.password?.message}
      />
      <Button
        type="submit"
        loading={loginMutation.isLoading}
        disabled={!formState.isValid}
      >
        Login
      </Button>
    </form>
  );
};
```

### 4. Widgets Layer (`/widgets`)
**목적**: 여러 features를 조합한 복합 UI 컴포넌트

```
widgets/
├── workout-form/     # 운동 기록 입력 위젯
│   ├── ui/
│   │   ├── WorkoutForm.tsx
│   │   ├── ExerciseSelector.tsx
│   │   └── RecordInputs.tsx
│   ├── model/
│   │   └── store.ts
│   └── index.ts
├── goal-progress/    # 목표 진행률 위젯
│   ├── ui/
│   │   ├── ProgressCard.tsx
│   │   ├── ProgressChart.tsx
│   │   └── GoalActions.tsx
│   ├── model/
│   │   └── calculations.ts
│   └── index.ts
├── charts/           # 차트 위젯들
│   ├── ui/
│   │   ├── WorkoutVolumeChart.tsx
│   │   ├── StrengthProgressChart.tsx
│   │   ├── BodyCompositionChart.tsx
│   │   └── GoalProgressChart.tsx
│   ├── lib/
│   │   ├── chartConfig.ts
│   │   └── dataTransformers.ts
│   └── index.ts
└── navigation/       # 네비게이션 위젯
    ├── ui/
    │   ├── Header.tsx
    │   ├── Sidebar.tsx
    │   └── MobileNav.tsx
    ├── model/
    │   └── store.ts
    └── index.ts
```

**Widget Example**:
```typescript
// widgets/workout-form/ui/WorkoutForm.tsx
export const WorkoutForm = ({ sessionId }: { sessionId: number }) => {
  // features/exercise의 hook 사용
  const { data: exercises } = useExercises();
  // features/workout의 mutation 사용
  const addRecordMutation = useAddWorkoutRecord();

  return (
    <Card>
      <ExerciseSelector exercises={exercises} />
      <RecordInputs onSubmit={addRecordMutation.mutate} />
    </Card>
  );
};
```

### 5. Pages Layer (`/pages`)
**목적**: 라우트와 1:1 매칭되는 페이지 컴포넌트

```
pages/
├── auth/
│   ├── LoginPage.tsx      # /login
│   ├── RegisterPage.tsx   # /register
│   └── index.ts
├── dashboard/
│   ├── DashboardPage.tsx  # /dashboard
│   └── index.ts
├── workouts/
│   ├── WorkoutsPage.tsx   # /workouts
│   ├── WorkoutDetailPage.tsx # /workouts/:id
│   ├── NewWorkoutPage.tsx # /workouts/new
│   └── index.ts
├── goals/
│   ├── GoalsPage.tsx      # /goals
│   ├── GoalDetailPage.tsx # /goals/:id
│   └── index.ts
├── statistics/
│   ├── StatisticsPage.tsx # /statistics
│   └── index.ts
└── profile/
    ├── ProfilePage.tsx    # /profile
    ├── SettingsPage.tsx   # /profile/settings
    └── index.ts
```

**Page Example**:
```typescript
// pages/dashboard/DashboardPage.tsx
export const DashboardPage = () => {
  return (
    <Layout>
      <PageHeader title="Dashboard" />
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <WorkoutVolumeChart />
        </Grid>
        <Grid item xs={12} md={6}>
          <GoalProgressWidget />
        </Grid>
        <Grid item xs={12}>
          <RecentWorkoutsList />
        </Grid>
      </Grid>
    </Layout>
  );
};
```

### 6. App Layer (`/app`)
**목적**: 애플리케이션 초기화 및 전역 설정

```
app/
├── providers/        # 글로벌 프로바이더
│   ├── QueryProvider.tsx  # React Query
│   ├── ThemeProvider.tsx  # Material-UI 테마
│   ├── RouterProvider.tsx # React Router
│   └── index.ts
├── store/            # 글로벌 상태
│   ├── auth.ts       # 인증 상태
│   ├── theme.ts      # 테마 상태
│   └── index.ts
├── styles/           # 글로벌 스타일
│   ├── globals.css
│   ├── theme.ts      # MUI 테마 정의
│   └── variables.css
└── App.tsx           # 루트 컴포넌트
```

**App Component**:
```typescript
// app/App.tsx
export const App = () => {
  return (
    <QueryProvider>
      <ThemeProvider>
        <RouterProvider>
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/workouts" element={<WorkoutsPage />} />
            <Route path="/goals" element={<GoalsPage />} />
            <Route path="/statistics" element={<StatisticsPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Routes>
        </RouterProvider>
      </ThemeProvider>
    </QueryProvider>
  );
};
```

## State Management Architecture

### 1. Global State (Zustand)
```typescript
// app/store/auth.ts
interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (credentials: LoginData) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: false,
  login: async (credentials) => {
    const response = await authApi.login(credentials);
    set({
      user: response.user,
      token: response.token,
      isAuthenticated: true,
    });
  },
  logout: () => {
    localStorage.removeItem('token');
    set({ user: null, token: null, isAuthenticated: false });
  },
}));
```

### 2. Server State (React Query)
```typescript
// entities/workout/api/queries.ts
export const useWorkoutSessions = (filters: WorkoutFilters) => {
  return useQuery({
    queryKey: ['workoutSessions', filters],
    queryFn: () => workoutApi.getSessions(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useCreateWorkoutSession = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: workoutApi.createSession,
    onSuccess: () => {
      queryClient.invalidateQueries(['workoutSessions']);
    },
  });
};
```

### 3. Local Component State
```typescript
// features/workout/ui/WorkoutForm.tsx
export const WorkoutForm = () => {
  const [currentExercise, setCurrentExercise] = useState<Exercise | null>(null);
  const [sets, setSets] = useState<WorkoutSet[]>([]);
  
  // React Hook Form for form state
  const { register, handleSubmit, formState } = useForm<WorkoutData>();
  
  return (
    // Form JSX
  );
};
```

## Component Design Patterns

### 1. Compound Components
```typescript
// shared/ui/Table/Table.tsx
export const Table = {
  Root: TableRoot,
  Header: TableHeader,
  Body: TableBody,
  Row: TableRow,
  Cell: TableCell,
};

// Usage
<Table.Root>
  <Table.Header>
    <Table.Row>
      <Table.Cell>Exercise</Table.Cell>
      <Table.Cell>Sets</Table.Cell>
    </Table.Row>
  </Table.Header>
  <Table.Body>
    {records.map(record => (
      <Table.Row key={record.id}>
        <Table.Cell>{record.exercise.name}</Table.Cell>
        <Table.Cell>{record.sets}</Table.Cell>
      </Table.Row>
    ))}
  </Table.Body>
</Table.Root>
```

### 2. Render Props Pattern
```typescript
// shared/ui/DataFetcher/DataFetcher.tsx
interface DataFetcherProps<T> {
  queryKey: string[];
  queryFn: () => Promise<T>;
  children: (props: {
    data: T;
    loading: boolean;
    error: Error | null;
  }) => React.ReactNode;
}

export const DataFetcher = <T,>({ queryKey, queryFn, children }: DataFetcherProps<T>) => {
  const { data, isLoading, error } = useQuery({ queryKey, queryFn });
  
  return children({ data, loading: isLoading, error });
};
```

### 3. Custom Hooks Pattern
```typescript
// features/workout/model/hooks.ts
export const useWorkoutTimer = () => {
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isRunning) {
      interval = setInterval(() => {
        setSeconds(prev => prev + 1);
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isRunning]);

  const start = () => setIsRunning(true);
  const stop = () => setIsRunning(false);
  const reset = () => {
    setSeconds(0);
    setIsRunning(false);
  };

  return { seconds, isRunning, start, stop, reset };
};
```

## Performance Optimization

### 1. Code Splitting
```typescript
// app/App.tsx
const DashboardPage = lazy(() => import('pages/dashboard'));
const WorkoutsPage = lazy(() => import('pages/workouts'));
const StatisticsPage = lazy(() => import('pages/statistics'));

export const App = () => {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/workouts/*" element={<WorkoutsPage />} />
        <Route path="/statistics" element={<StatisticsPage />} />
      </Routes>
    </Suspense>
  );
};
```

### 2. Memoization
```typescript
// widgets/charts/ui/WorkoutVolumeChart.tsx
export const WorkoutVolumeChart = memo(({ data, period }: ChartProps) => {
  const chartData = useMemo(() => {
    return transformWorkoutData(data, period);
  }, [data, period]);

  const chartOptions = useMemo(() => {
    return generateChartOptions(chartData);
  }, [chartData]);

  return <Chart data={chartData} options={chartOptions} />;
});
```

### 3. Virtual Scrolling
```typescript
// features/workout/ui/ExerciseList.tsx
export const ExerciseList = ({ exercises }: { exercises: Exercise[] }) => {
  return (
    <FixedSizeList
      height={400}
      itemCount={exercises.length}
      itemSize={60}
      itemData={exercises}
    >
      {({ index, data, style }) => (
        <div style={style}>
          <ExerciseListItem exercise={data[index]} />
        </div>
      )}
    </FixedSizeList>
  );
};
```

## Testing Strategy

### 1. Component Testing
```typescript
// features/auth/ui/__tests__/LoginForm.test.tsx
describe('LoginForm', () => {
  it('should submit form with valid credentials', async () => {
    const onSubmit = jest.fn();
    render(<LoginForm onSubmit={onSubmit} />);

    await user.type(screen.getByLabelText('Email'), 'test@example.com');
    await user.type(screen.getByLabelText('Password'), 'password123');
    await user.click(screen.getByRole('button', { name: 'Login' }));

    expect(onSubmit).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123',
    });
  });
});
```

### 2. Integration Testing
```typescript
// features/workout/__tests__/WorkoutFlow.test.tsx
describe('Workout Flow', () => {
  it('should create workout session and add records', async () => {
    render(<WorkoutsPage />, { wrapper: TestProvider });

    // Create session
    await user.click(screen.getByText('New Workout'));
    await user.type(screen.getByLabelText('Session Name'), 'Morning Workout');
    await user.click(screen.getByText('Create'));

    // Add exercise record
    await user.click(screen.getByText('Add Exercise'));
    await user.click(screen.getByText('Push-ups'));
    await user.type(screen.getByLabelText('Sets'), '3');
    await user.type(screen.getByLabelText('Reps'), '15');
    await user.click(screen.getByText('Save Record'));

    expect(screen.getByText('Push-ups: 3 sets × 15 reps')).toBeInTheDocument();
  });
});
```

## Build and Development Configuration

### 1. Vite Configuration
```typescript
// vite.config.ts
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@shared': path.resolve(__dirname, './src/shared'),
      '@entities': path.resolve(__dirname, './src/entities'),
      '@features': path.resolve(__dirname, './src/features'),
      '@widgets': path.resolve(__dirname, './src/widgets'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@app': path.resolve(__dirname, './src/app'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['@mui/material', '@mui/icons-material'],
          charts: ['chart.js', 'react-chartjs-2'],
        },
      },
    },
  },
});
```

### 2. TypeScript Configuration
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@shared/*": ["./src/shared/*"],
      "@entities/*": ["./src/entities/*"],
      "@features/*": ["./src/features/*"],
      "@widgets/*": ["./src/widgets/*"],
      "@pages/*": ["./src/pages/*"],
      "@app/*": ["./src/app/*"]
    }
  }
}
```

이 프론트엔드 아키텍처는 FSD 패턴을 따라 확장 가능하고 유지보수가 용이한 React 애플리케이션을 구축하는 기반을 제공합니다.