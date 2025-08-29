# Security Architecture Design

## Security Overview

FitnessTracker 보안 아키텍처는 **Defense in Depth** 전략을 채택하여 다층 보안 체계를 구성합니다. 개인 건강 데이터의 민감성을 고려하여 업계 최고 수준의 보안 표준을 적용합니다.

## Security Architecture Layers

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        Infrastructure Security                           │
├─────────────────────────────────────────────────────────────────────────┤
│  HTTPS/TLS 1.3 | Firewall | DDoS Protection | Security Headers         │
├─────────────────────────────────────────────────────────────────────────┤
│                        Application Security                              │
├─────────────────────────────────────────────────────────────────────────┤
│  CORS | CSP | Input Validation | SQL Injection Prevention              │
├─────────────────────────────────────────────────────────────────────────┤
│                      Authentication & Authorization                      │
├─────────────────────────────────────────────────────────────────────────┤
│  JWT Tokens | Role-Based Access Control | Session Management           │
├─────────────────────────────────────────────────────────────────────────┤
│                           Data Security                                  │
├─────────────────────────────────────────────────────────────────────────┤
│  Encryption at Rest | Encryption in Transit | Data Anonymization       │
└─────────────────────────────────────────────────────────────────────────┘
```

## Authentication Architecture

### JWT-based Stateless Authentication

```
Authentication Flow:
┌─────────────┐    ┌──────────────┐    ┌─────────────────┐    ┌──────────────┐
│   Client    │    │   Frontend   │    │   Backend API   │    │   Database   │
└─────────────┘    └──────────────┘    └─────────────────┘    └──────────────┘
       │                   │                      │                    │
       │ 1. Login Request  │                      │                    │
       ├──────────────────►│                      │                    │
       │                   │ 2. POST /auth/login  │                    │
       │                   ├─────────────────────►│                    │
       │                   │                      │ 3. Validate Creds │
       │                   │                      ├───────────────────►│
       │                   │                      │ 4. User Data       │
       │                   │                      │◄───────────────────┤
       │                   │ 5. JWT Tokens        │                    │
       │                   │◄─────────────────────┤                    │
       │ 6. Store Tokens   │                      │                    │
       │◄──────────────────┤                      │                    │
       │                   │                      │                    │
       │ 7. API Request    │                      │                    │
       ├──────────────────►│ 8. Add JWT Header    │                    │
       │                   ├─────────────────────►│                    │
       │                   │                      │ 9. Validate Token  │
       │                   │                      │                    │
       │                   │ 10. Response         │                    │
       │                   │◄─────────────────────┤                    │
       │ 11. Response      │                      │                    │
       │◄──────────────────┤                      │                    │
```

### Token Management Strategy

#### Access Token
```typescript
// JWT Payload Structure
interface JWTPayload {
  sub: string;        // User ID
  email: string;      // User email
  name: string;       // User name
  roles: string[];    // User roles
  iat: number;        // Issued at
  exp: number;        // Expires at (24 hours)
  jti: string;        // JWT ID (for revocation)
}

// Token Generation
const generateAccessToken = (user: User): string => {
  return jwt.sign(
    {
      sub: user.id,
      email: user.email,
      name: user.name,
      roles: user.roles,
    },
    JWT_SECRET,
    {
      expiresIn: '24h',
      issuer: 'fitness-tracker',
      audience: 'fitness-tracker-api',
    }
  );
};
```

#### Refresh Token
```typescript
// Refresh Token Strategy
interface RefreshTokenPayload {
  sub: string;        // User ID
  type: 'refresh';    // Token type
  jti: string;        // Unique token ID
  iat: number;        // Issued at
  exp: number;        // Expires at (7 days)
}

// Secure refresh token storage (httpOnly cookie)
const setRefreshTokenCookie = (res: Response, refreshToken: string) => {
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
};
```

### Token Security Features

1. **Short-lived Access Tokens**: 24-hour expiration
2. **Long-lived Refresh Tokens**: 7-day expiration, httpOnly cookies
3. **Token Rotation**: New refresh token on every refresh
4. **JTI (JWT ID)**: Unique identifier for token revocation
5. **Secure Storage**: Access token in memory, refresh token in httpOnly cookie

## Authorization Architecture

### Role-Based Access Control (RBAC)

```typescript
// User Roles
enum UserRole {
  USER = 'USER',           // Regular user
  PREMIUM = 'PREMIUM',     // Premium subscriber
  TRAINER = 'TRAINER',     // Personal trainer
  ADMIN = 'ADMIN'          // System administrator
}

// Permission Matrix
const PERMISSIONS = {
  [UserRole.USER]: [
    'workout:read:own',
    'workout:create:own',
    'workout:update:own',
    'workout:delete:own',
    'goal:read:own',
    'goal:create:own',
    'goal:update:own',
    'goal:delete:own',
  ],
  [UserRole.PREMIUM]: [
    ...PERMISSIONS[UserRole.USER],
    'statistics:advanced',
    'export:data',
    'backup:create',
  ],
  [UserRole.TRAINER]: [
    ...PERMISSIONS[UserRole.PREMIUM],
    'client:read:assigned',
    'workout:create:client',
    'program:create',
  ],
  [UserRole.ADMIN]: [
    '*:*:*', // All permissions
  ],
};
```

### Resource-Level Authorization

```typescript
// Authorization Middleware
@Injectable()
export class AuthorizationGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const resource = this.extractResource(request);
    
    // Check if user owns the resource
    if (resource.userId !== user.id && !user.roles.includes('ADMIN')) {
      throw new ForbiddenException('Access denied to resource');
    }
    
    return true;
  }
}

// Usage in Controller
@Get('/workouts/:id')
@UseGuards(JwtAuthGuard, AuthorizationGuard)
async getWorkout(@Param('id') id: string, @CurrentUser() user: User) {
  return this.workoutService.findById(id, user.id);
}
```

## Data Security

### Encryption at Rest

```typescript
// Sensitive Data Encryption
@Entity()
export class User {
  @Column()
  email: string;

  @Column()
  @Transform(
    value => encrypt(value), // Encrypt before saving
    value => decrypt(value)  // Decrypt after loading
  )
  password: string;

  @Column({ nullable: true })
  @Transform(
    value => value ? encrypt(value) : null,
    value => value ? decrypt(value) : null
  )
  personalNotes?: string;
}

// Encryption Utility
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY;
const ALGORITHM = 'aes-256-gcm';

export const encrypt = (text: string): string => {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipher(ALGORITHM, ENCRYPTION_KEY);
  cipher.setAAD(Buffer.from('fitness-tracker'));
  
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  const tag = cipher.getAuthTag();
  return iv.toString('hex') + ':' + tag.toString('hex') + ':' + encrypted;
};
```

### Password Security

```typescript
// Password Hashing with bcrypt
import * as bcrypt from 'bcryptjs';

export class PasswordService {
  private readonly SALT_ROUNDS = 12;

  async hashPassword(password: string): Promise<string> {
    // Generate salt and hash
    const salt = await bcrypt.genSalt(this.SALT_ROUNDS);
    return bcrypt.hash(password, salt);
  }

  async verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  // Password strength validation
  validatePasswordStrength(password: string): boolean {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    return password.length >= minLength &&
           hasUpperCase &&
           hasLowerCase &&
           hasNumbers &&
           hasSpecialChar;
  }
}
```

## Frontend Security

### Secure Token Storage

```typescript
// Token Management Service
class TokenService {
  private readonly ACCESS_TOKEN_KEY = 'access_token';
  
  // Store access token in memory (secure against XSS)
  private accessToken: string | null = null;

  setAccessToken(token: string): void {
    this.accessToken = token;
    // Don't store in localStorage for security
  }

  getAccessToken(): string | null {
    return this.accessToken;
  }

  clearTokens(): void {
    this.accessToken = null;
    // Clear refresh token via API call
    this.apiClient.post('/auth/logout');
  }
}

// Axios Interceptor
axios.interceptors.request.use((config) => {
  const token = tokenService.getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

### Content Security Policy (CSP)

```typescript
// CSP Configuration
const cspConfig = {
  directives: {
    defaultSrc: ["'self'"],
    scriptSrc: [
      "'self'",
      "'unsafe-inline'", // Only for development
      'https://cdn.jsdelivr.net',
    ],
    styleSrc: [
      "'self'",
      "'unsafe-inline'", // Required for styled-components
      'https://fonts.googleapis.com',
    ],
    fontSrc: [
      "'self'",
      'https://fonts.gstatic.com',
    ],
    imgSrc: [
      "'self'",
      'data:',
      'https:',
    ],
    connectSrc: [
      "'self'",
      process.env.REACT_APP_API_BASE_URL,
    ],
    frameSrc: ["'none'"],
    objectSrc: ["'none'"],
    upgradeInsecureRequests: [],
  },
};
```

### XSS Prevention

```typescript
// Input Sanitization
import DOMPurify from 'isomorphic-dompurify';

export const sanitizeInput = (input: string): string => {
  return DOMPurify.sanitize(input, {
    ALLOWED_TAGS: [], // No HTML tags allowed
    ALLOWED_ATTR: [],
  });
};

// React Component
export const SafeTextDisplay: React.FC<{ text: string }> = ({ text }) => {
  const sanitizedText = sanitizeInput(text);
  return <span>{sanitizedText}</span>;
};
```

## Backend Security

### Input Validation & Sanitization

```typescript
// DTO Validation with class-validator
import { IsEmail, IsString, MinLength, MaxLength, Matches } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateUserDto {
  @IsEmail({}, { message: 'Invalid email format' })
  @Transform(({ value }) => value?.toLowerCase().trim())
  email: string;

  @IsString({ message: 'Password must be a string' })
  @MinLength(8, { message: 'Password must be at least 8 characters' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, {
    message: 'Password must contain uppercase, lowercase, number and special character',
  })
  password: string;

  @IsString()
  @MaxLength(100)
  @Transform(({ value }) => sanitizeInput(value))
  name: string;
}
```

### SQL Injection Prevention

```typescript
// Using TypeORM for parameterized queries
@Repository()
export class WorkoutRepository extends Repository<WorkoutSession> {
  async findUserWorkouts(userId: number, filters: WorkoutFilters): Promise<WorkoutSession[]> {
    const query = this.createQueryBuilder('workout')
      .where('workout.userId = :userId', { userId })
      .andWhere('workout.sessionDate >= :startDate', { startDate: filters.startDate })
      .andWhere('workout.sessionDate <= :endDate', { endDate: filters.endDate })
      .orderBy('workout.sessionDate', 'DESC')
      .limit(filters.limit)
      .offset(filters.offset);

    return query.getMany();
  }
}
```

### Rate Limiting

```typescript
// Rate Limiting Configuration
import rateLimit from 'express-rate-limit';

// General API rate limiting
export const generalRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP',
  standardHeaders: true,
  legacyHeaders: false,
});

// Strict rate limiting for auth endpoints
export const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs
  message: 'Too many authentication attempts',
  skipSuccessfulRequests: true,
});

// Usage
app.use('/api', generalRateLimit);
app.use('/api/auth/login', authRateLimit);
```

## Infrastructure Security

### HTTPS Configuration

```typescript
// Express HTTPS Configuration
import https from 'https';
import fs from 'fs';

const httpsOptions = {
  key: fs.readFileSync('path/to/private-key.pem'),
  cert: fs.readFileSync('path/to/certificate.pem'),
  // Additional security options
  secureProtocol: 'TLSv1_3_method',
  ciphers: 'ECDHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384',
  honorCipherOrder: true,
};

const server = https.createServer(httpsOptions, app);
```

### Security Headers

```typescript
// Security Headers Middleware
import helmet from 'helmet';

app.use(helmet({
  contentSecurityPolicy: {
    directives: cspConfig.directives,
  },
  hsts: {
    maxAge: 31536000, // 1 year
    includeSubDomains: true,
    preload: true,
  },
  noSniff: true,
  xssFilter: true,
  referrerPolicy: { policy: 'same-origin' },
}));

// CORS Configuration
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
```

## Session Security

### Session Management

```typescript
// Session Security Service
export class SessionSecurityService {
  private readonly CONCURRENT_SESSION_LIMIT = 3;
  private activeSessions = new Map<string, Set<string>>();

  async validateSession(userId: string, jti: string): Promise<boolean> {
    const userSessions = this.activeSessions.get(userId) || new Set();
    
    // Check session limit
    if (userSessions.size >= this.CONCURRENT_SESSION_LIMIT && !userSessions.has(jti)) {
      throw new UnauthorizedException('Maximum concurrent sessions exceeded');
    }
    
    return userSessions.has(jti);
  }

  async addSession(userId: string, jti: string): Promise<void> {
    const userSessions = this.activeSessions.get(userId) || new Set();
    userSessions.add(jti);
    this.activeSessions.set(userId, userSessions);
  }

  async removeSession(userId: string, jti: string): Promise<void> {
    const userSessions = this.activeSessions.get(userId);
    if (userSessions) {
      userSessions.delete(jti);
      if (userSessions.size === 0) {
        this.activeSessions.delete(userId);
      }
    }
  }
}
```

## Security Monitoring & Logging

### Audit Logging

```typescript
// Security Audit Logger
export class SecurityAuditLogger {
  async logAuthEvent(event: AuthEvent): Promise<void> {
    const logEntry = {
      timestamp: new Date().toISOString(),
      eventType: event.type,
      userId: event.userId,
      ip: event.ip,
      userAgent: event.userAgent,
      success: event.success,
      reason: event.reason,
    };

    // Log to secure audit system
    await this.auditRepository.save(logEntry);
    
    // Alert on suspicious activity
    if (this.isSuspiciousActivity(event)) {
      await this.alertService.sendSecurityAlert(logEntry);
    }
  }

  private isSuspiciousActivity(event: AuthEvent): boolean {
    // Multiple failed login attempts
    // Login from unusual location
    // Login outside normal hours
    // etc.
    return false; // Implementation depends on requirements
  }
}
```

### Security Monitoring

```typescript
// Security Monitoring Service
export class SecurityMonitoringService {
  async detectAnomalies(userId: string): Promise<SecurityAlert[]> {
    const alerts: SecurityAlert[] = [];

    // Check for unusual activity patterns
    const recentActivity = await this.getRecentActivity(userId);
    
    // Detect multiple IP addresses
    const uniqueIPs = new Set(recentActivity.map(activity => activity.ip));
    if (uniqueIPs.size > 3) {
      alerts.push({
        type: 'MULTIPLE_IP_ADDRESSES',
        severity: 'MEDIUM',
        description: 'User logged in from multiple IP addresses',
      });
    }

    // Detect unusual time patterns
    const unusualHours = recentActivity.filter(activity => 
      this.isUnusualHour(activity.timestamp)
    );
    if (unusualHours.length > 0) {
      alerts.push({
        type: 'UNUSUAL_ACTIVITY_TIME',
        severity: 'LOW',
        description: 'User activity detected during unusual hours',
      });
    }

    return alerts;
  }
}
```

## Compliance & Privacy

### GDPR Compliance

```typescript
// Data Privacy Service
export class DataPrivacyService {
  async exportUserData(userId: string): Promise<UserDataExport> {
    const userData = await this.getUserCompleteData(userId);
    
    return {
      personalInfo: userData.personalInfo,
      workoutHistory: userData.workouts,
      goals: userData.goals,
      bodyComposition: userData.bodyComposition,
      exportDate: new Date().toISOString(),
    };
  }

  async deleteUserData(userId: string): Promise<void> {
    // Anonymize instead of hard delete for audit purposes
    await this.anonymizeUserData(userId);
    
    // Hard delete after retention period
    setTimeout(() => {
      this.hardDeleteUserData(userId);
    }, this.RETENTION_PERIOD_MS);
  }

  private async anonymizeUserData(userId: string): Promise<void> {
    await this.userRepository.update(userId, {
      email: `deleted_${userId}@example.com`,
      name: 'Deleted User',
      personalNotes: null,
      isDeleted: true,
    });
  }
}
```

### Data Retention Policy

```typescript
// Data Retention Service
export class DataRetentionService {
  private readonly RETENTION_PERIODS = {
    auditLogs: 7 * 365 * 24 * 60 * 60 * 1000, // 7 years
    workoutData: 5 * 365 * 24 * 60 * 60 * 1000, // 5 years
    personalData: 2 * 365 * 24 * 60 * 60 * 1000, // 2 years after deletion
  };

  @Cron('0 2 * * *') // Run daily at 2 AM
  async cleanupExpiredData(): Promise<void> {
    await this.cleanupExpiredAuditLogs();
    await this.cleanupExpiredWorkoutData();
    await this.cleanupDeletedPersonalData();
  }

  private async cleanupExpiredAuditLogs(): Promise<void> {
    const cutoffDate = new Date(Date.now() - this.RETENTION_PERIODS.auditLogs);
    await this.auditRepository.delete({
      timestamp: LessThan(cutoffDate),
    });
  }
}
```

## Security Testing

### Penetration Testing Checklist

1. **Authentication Testing**
   - Brute force attack resistance
   - Session fixation
   - JWT token manipulation
   - Password reset vulnerabilities

2. **Authorization Testing**
   - Privilege escalation
   - Direct object reference
   - Missing function-level access control

3. **Input Validation Testing**
   - SQL injection
   - XSS attacks
   - Command injection
   - File upload vulnerabilities

4. **Session Management Testing**
   - Session timeout
   - Concurrent session handling
   - Session hijacking resistance

5. **Configuration Testing**
   - Security headers
   - HTTPS enforcement
   - Error handling
   - Information disclosure

This comprehensive security architecture ensures that the FitnessTracker application maintains the highest security standards while providing a seamless user experience.