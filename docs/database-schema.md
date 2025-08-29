# Database Schema Design

## Entity Relationship Diagram (ERD)

```
                    ┌─────────────────────┐
                    │       USERS         │
                    ├─────────────────────┤
                    │ id (PK)            │
                    │ email (UK)         │
                    │ password           │
                    │ name               │
                    │ date_of_birth      │
                    │ gender             │
                    │ height             │
                    │ activity_level     │
                    │ created_at         │
                    │ updated_at         │
                    └─────────┬───────────┘
                             │
                             │ 1:N
                             │
          ┌──────────────────┼──────────────────┐
          │                  │                  │
          ▼                  ▼                  ▼
┌─────────────────────┐ ┌──────────────────┐ ┌──────────────────┐
│   WORKOUT_SESSIONS  │ │      GOALS       │ │ BODY_COMPOSITION │
├─────────────────────┤ ├──────────────────┤ ├──────────────────┤
│ id (PK)            │ │ id (PK)         │ │ id (PK)         │
│ user_id (FK)       │ │ user_id (FK)    │ │ user_id (FK)    │
│ name               │ │ title           │ │ weight          │
│ notes              │ │ description     │ │ body_fat        │
│ session_date       │ │ goal_type       │ │ muscle_mass     │
│ duration_minutes   │ │ target_value    │ │ measurement_date│
│ total_volume       │ │ current_value   │ │ created_at      │
│ created_at         │ │ target_date     │ │ updated_at      │
│ updated_at         │ │ status          │ └──────────────────┘
└─────────┬───────────┘ │ created_at      │
          │             │ updated_at      │
          │ 1:N         └──────────────────┘
          │
          ▼
┌─────────────────────┐
│   WORKOUT_RECORDS   │      ┌─────────────────────┐
├─────────────────────┤      │     EXERCISES       │
│ id (PK)            │      ├─────────────────────┤
│ session_id (FK)    │◄────►│ id (PK)            │
│ exercise_id (FK)   │ M:1  │ name               │
│ sets               │      │ category           │
│ reps               │      │ muscle_groups      │
│ weight             │      │ instructions       │
│ distance           │      │ difficulty_level   │
│ duration_minutes   │      │ equipment_needed   │
│ calories_burned    │      │ is_default         │
│ notes              │      │ created_by (FK)    │
│ created_at         │      │ created_at         │
│ updated_at         │      │ updated_at         │
└─────────────────────┘      └─────────────────────┘
```

## Table Specifications

### USERS Table

```sql
CREATE TABLE users (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(100) NOT NULL,
    date_of_birth DATE,
    gender ENUM('MALE', 'FEMALE', 'OTHER'),
    height DECIMAL(5,2), -- in cm
    activity_level ENUM('SEDENTARY', 'LIGHTLY_ACTIVE', 'MODERATELY_ACTIVE', 'VERY_ACTIVE', 'EXTREMELY_ACTIVE'),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_email (email),
    INDEX idx_created_at (created_at)
);
```

**Business Rules:**
- Email must be unique and valid format
- Password must be hashed using BCrypt
- Height in centimeters (optional)
- Activity level affects calorie calculations
- Soft delete not implemented (hard delete for GDPR compliance)

### EXERCISES Table

```sql
CREATE TABLE exercises (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    category ENUM('STRENGTH', 'CARDIO', 'FLEXIBILITY', 'BALANCE', 'SPORTS') NOT NULL,
    muscle_groups JSON, -- ['CHEST', 'BACK', 'SHOULDERS', 'ARMS', 'LEGS', 'CORE', 'FULL_BODY']
    instructions TEXT,
    difficulty_level ENUM('BEGINNER', 'INTERMEDIATE', 'ADVANCED') DEFAULT 'BEGINNER',
    equipment_needed JSON, -- ['BARBELL', 'DUMBBELL', 'RESISTANCE_BAND', 'BODYWEIGHT', etc.]
    is_default BOOLEAN DEFAULT FALSE, -- System predefined exercises
    created_by BIGINT, -- NULL for system exercises, user_id for custom exercises
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_category (category),
    INDEX idx_muscle_groups (muscle_groups),
    INDEX idx_created_by (created_by),
    INDEX idx_is_default (is_default),
    
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
);
```

**Business Rules:**
- System exercises (is_default=true) visible to all users
- Custom exercises (created_by IS NOT NULL) visible only to creator
- Muscle groups stored as JSON array for flexibility
- Equipment needed stored as JSON array for multi-equipment exercises

### WORKOUT_SESSIONS Table

```sql
CREATE TABLE workout_sessions (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    name VARCHAR(255) NOT NULL,
    notes TEXT,
    session_date DATE NOT NULL,
    duration_minutes INT, -- Total session duration
    total_volume DECIMAL(10,2), -- Sum of (weight × reps × sets) for all exercises
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_user_session_date (user_id, session_date),
    INDEX idx_session_date (session_date),
    INDEX idx_total_volume (total_volume),
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

**Business Rules:**
- One session per day per user (business constraint, not DB constraint)
- Total volume calculated automatically from workout records
- Duration can be manual input or calculated from record timestamps
- Session date separate from created_at for scheduling future workouts

### WORKOUT_RECORDS Table

```sql
CREATE TABLE workout_records (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    session_id BIGINT NOT NULL,
    exercise_id BIGINT NOT NULL,
    sets INT,
    reps INT,
    weight DECIMAL(6,2), -- in kg
    distance DECIMAL(8,2), -- in meters for cardio
    duration_minutes INT, -- for time-based exercises
    calories_burned INT,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_session_exercise (session_id, exercise_id),
    INDEX idx_exercise_date (exercise_id, session_id),
    INDEX idx_weight_progression (exercise_id, weight, created_at),
    
    FOREIGN KEY (session_id) REFERENCES workout_sessions(id) ON DELETE CASCADE,
    FOREIGN KEY (exercise_id) REFERENCES exercises(id) ON DELETE RESTRICT
);
```

**Business Rules:**
- Multiple records per exercise per session allowed (different sets/weights)
- Either (sets, reps, weight) for strength OR (distance, duration) for cardio
- Calories burned can be calculated or manually entered
- Prevent deletion of exercises that have records (RESTRICT)

### GOALS Table

```sql
CREATE TABLE goals (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    goal_type ENUM('WEIGHT_LOSS', 'WEIGHT_GAIN', 'STRENGTH', 'ENDURANCE', 'BODY_FAT', 'CUSTOM') NOT NULL,
    target_value DECIMAL(10,2) NOT NULL,
    current_value DECIMAL(10,2) DEFAULT 0,
    unit VARCHAR(20), -- 'kg', 'lbs', '%', 'minutes', 'reps', etc.
    target_date DATE,
    status ENUM('ACTIVE', 'COMPLETED', 'PAUSED', 'CANCELLED') DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_user_status (user_id, status),
    INDEX idx_goal_type (goal_type),
    INDEX idx_target_date (target_date),
    INDEX idx_status (status),
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

**Business Rules:**
- Progress calculated as (current_value / target_value) * 100
- Target date is optional (open-ended goals)
- Current value updated manually or automatically based on goal type
- Multiple active goals per user allowed

### BODY_COMPOSITION Table

```sql
CREATE TABLE body_composition (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    weight DECIMAL(5,2) NOT NULL, -- in kg
    body_fat DECIMAL(4,1), -- percentage
    muscle_mass DECIMAL(5,2), -- in kg
    measurement_date DATE NOT NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    UNIQUE KEY uk_user_measurement_date (user_id, measurement_date),
    INDEX idx_user_date (user_id, measurement_date),
    INDEX idx_measurement_date (measurement_date),
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

**Business Rules:**
- One measurement per user per day
- Weight is mandatory, other measurements optional
- Used for progress tracking and goal calculations
- Historical data preserved for trend analysis

## Indexes and Performance

### Primary Performance Considerations

1. **User-based Partitioning Ready**: Most queries filtered by user_id
2. **Time-based Queries**: Indexes on date columns for analytics
3. **Progress Tracking**: Composite indexes for trend analysis
4. **Search Functionality**: Indexes on name/category fields

### Query Optimization

```sql
-- Most common query patterns:

-- 1. User's recent workouts
SELECT * FROM workout_sessions 
WHERE user_id = ? 
ORDER BY session_date DESC 
LIMIT 10;

-- 2. Exercise progress tracking
SELECT wr.*, ws.session_date 
FROM workout_records wr
JOIN workout_sessions ws ON wr.session_id = ws.id
WHERE ws.user_id = ? AND wr.exercise_id = ?
ORDER BY ws.session_date ASC;

-- 3. Goal progress calculation
SELECT current_value, target_value, 
       (current_value/target_value)*100 as progress_percentage
FROM goals 
WHERE user_id = ? AND status = 'ACTIVE';

-- 4. Body composition trends
SELECT weight, body_fat, measurement_date
FROM body_composition
WHERE user_id = ? AND measurement_date >= DATE_SUB(NOW(), INTERVAL 3 MONTH)
ORDER BY measurement_date ASC;
```

## Data Migration Strategy

### Version Control
- Use Flyway for database migrations
- Semantic versioning for schema changes
- Rollback procedures for each migration

### Sample Initial Data

```sql
-- Default exercises (strength training)
INSERT INTO exercises (name, category, muscle_groups, difficulty_level, is_default) VALUES
('Push-ups', 'STRENGTH', '["CHEST", "ARMS", "CORE"]', 'BEGINNER', TRUE),
('Pull-ups', 'STRENGTH', '["BACK", "ARMS"]', 'INTERMEDIATE', TRUE),
('Squats', 'STRENGTH', '["LEGS", "CORE"]', 'BEGINNER', TRUE),
('Deadlifts', 'STRENGTH', '["LEGS", "BACK", "CORE"]', 'INTERMEDIATE', TRUE),
('Bench Press', 'STRENGTH', '["CHEST", "ARMS"]', 'INTERMEDIATE', TRUE);

-- Default exercises (cardio)
INSERT INTO exercises (name, category, muscle_groups, difficulty_level, is_default) VALUES
('Running', 'CARDIO', '["LEGS", "FULL_BODY"]', 'BEGINNER', TRUE),
('Cycling', 'CARDIO', '["LEGS"]', 'BEGINNER', TRUE),
('Swimming', 'CARDIO', '["FULL_BODY"]', 'INTERMEDIATE', TRUE);

-- Test user
INSERT INTO users (email, password, name, gender, height, activity_level) VALUES
('test@example.com', '$2a$10$...', 'Test User', 'MALE', 175.0, 'MODERATELY_ACTIVE');
```

## Constraints and Business Rules

### Data Integrity
1. **Referential Integrity**: Proper foreign key constraints
2. **Data Validation**: Check constraints for valid ranges
3. **Unique Constraints**: Prevent duplicate data
4. **Cascading Deletes**: Maintain data consistency

### Business Constraints
1. **User Privacy**: Users can only access their own data
2. **Exercise Sharing**: System exercises visible to all, custom exercises private
3. **Goal Tracking**: Automatic progress calculation based on related data
4. **Data Retention**: Historical data preserved for analytics

## Scalability Considerations

### Horizontal Scaling
1. **User-based Sharding**: Partition by user_id
2. **Read Replicas**: Analytics queries on read-only replicas
3. **Archive Strategy**: Move old data to separate archive tables

### Performance Optimization
1. **Connection Pooling**: HikariCP configuration
2. **Query Caching**: Second-level Hibernate cache
3. **Batch Operations**: Bulk insert/update for data imports
4. **Database Monitoring**: Query performance analytics

This schema design provides a solid foundation for the FitnessTracker application with proper normalization, performance optimization, and scalability considerations.