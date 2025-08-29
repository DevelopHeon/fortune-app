-- Initial data for development

-- Test user (password: password123)
INSERT INTO users (id, email, password, first_name, last_name, created_at, updated_at) VALUES
(1, 'test@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'Test', 'User', NOW(), NOW());

-- Exercise categories
INSERT INTO exercises (id, name, category, muscle_group, description, created_at, updated_at) VALUES
(1, '벤치프레스', 'STRENGTH', 'CHEST', '가슴 근육을 강화하는 대표적인 운동', NOW(), NOW()),
(2, '스쿼트', 'STRENGTH', 'LEGS', '하체 전체를 강화하는 복합 운동', NOW(), NOW()),
(3, '데드리프트', 'STRENGTH', 'BACK', '등과 허벅지 뒤쪽을 강화하는 운동', NOW(), NOW()),
(4, '러닝', 'CARDIO', 'FULL_BODY', '심폐지구력 향상을 위한 유산소 운동', NOW(), NOW()),
(5, '사이클링', 'CARDIO', 'LEGS', '하체 강화와 유산소 효과를 동시에', NOW(), NOW()),
(6, '플랭크', 'FLEXIBILITY', 'CORE', '코어 근육 강화를 위한 정적 운동', NOW(), NOW()),
(7, '푸시업', 'STRENGTH', 'CHEST', '상체 전반을 강화하는 자중 운동', NOW(), NOW());

-- Sample workout sessions
INSERT INTO workout_sessions (id, user_id, date, notes, created_at, updated_at) VALUES
(1, 1, '2024-01-15', '오늘 컨디션 좋음', NOW(), NOW()),
(2, 1, '2024-01-17', '가벼운 운동', NOW(), NOW());

-- Sample workout records
INSERT INTO workout_records (id, workout_session_id, exercise_id, sets, reps, weight, duration_minutes, distance_km, notes, created_at, updated_at) VALUES
(1, 1, 1, 3, 10, 80.0, NULL, NULL, '폼 체크 필요', NOW(), NOW()),
(2, 1, 2, 3, 15, 100.0, NULL, NULL, '무릎 주의', NOW(), NOW()),
(3, 2, 4, 1, NULL, NULL, 30, 5.0, '페이스 조절', NOW(), NOW()),
(4, 2, 6, 3, NULL, NULL, 2, NULL, '호흡 집중', NOW(), NOW());

-- Sample goals
INSERT INTO goals (id, user_id, type, title, description, target_value, current_value, target_date, is_achieved, created_at, updated_at) VALUES
(1, 1, 'WEIGHT_LOSS', '체중 감량', '3개월 내 5kg 감량', 5.0, 2.0, '2024-04-15', false, NOW(), NOW()),
(2, 1, 'STRENGTH_GAIN', '벤치프레스 향상', '벤치프레스 100kg 달성', 100.0, 80.0, '2024-06-01', false, NOW(), NOW()),
(3, 1, 'ENDURANCE', '러닝 지구력', '10km 완주', 10.0, 5.0, '2024-05-01', false, NOW(), NOW());

-- Sample body composition records
INSERT INTO body_composition (id, user_id, date, weight, body_fat_percentage, muscle_mass, notes, created_at, updated_at) VALUES
(1, 1, '2024-01-01', 75.0, 18.5, 58.0, '운동 시작 전', NOW(), NOW()),
(2, 1, '2024-01-15', 73.0, 17.8, 58.5, '2주차 측정', NOW(), NOW());