INSERT INTO student (id, name, email, password, created_at, updated_at, oauth_fb, oauth_google, is_email_password, auth_method, auth_attempts, last_auth_attempt_at)
VALUES
(1, 'John Doe', 'john.doe@example.com', 'password123', NULL, 'google_id_12345', TRUE, 'google', 0, '2024-01-01 12:00:00', '2024-01-01 12:00:00'),
(2, 'Jane Smith', 'jane.smith@example.com', 'password123', 'fb_id_54321', NULL, TRUE, 'facebook', 1, '2024-01-02 13:00:00', '2024-01-02 13:00:00');

INSERT INTO course (id, course_name, course_description, school_name, created_at, updated_at)
VALUES
    (1, '', '', '', '2024-10-25 10:00:00', '2024-10-25 10:00:00'),
    (1, '', '', '', '2024-10-25 10:00:00', '2024-10-25 10:00:00'),
    (1, '', '', '', '2024-10-25 10:00:00', '2024-10-25 10:00:00'),
    (2, '', '', '', '2024-10-25 11:00:00', '2024-10-25 11:00:00');

INSERT INTO course_career_prospect (course_id, career_prospect)
VALUES
    (1, Maritime_Engineer);

INSERT INTO course_key_skills (course_id, key_skills)
VALUES
    (1,fishing);

INSERT INTO recommendation (id, test_id, recommendation_score, student_id, created_at, updated_at)
VALUES
    (1, 1, 85.5, '2024-01-04 12:30:00', '2024-01-04 12:30:00'),
    (2, 2, 90.0, '2024-01-05 14:45:00', '2024-01-05 14:45:00');

INSERT INTO recommendation_course (course_id, recommendation_id)
VALUES
    (1,1);

INSERT INTO test (id, student_id, is_testcomplete, created_at, updated_at)
VALUES
    (1, 1, FALSE, '2024-01-05 09:00:00', '2024-01-05 09:00:00'),
    (2, 2, TRUE, '2024-01-06 10:15:00', '2024-01-06 10:15:00');

INSERT INTO question (id, question_text, created_at, updated_at, test_id)
VALUES
    (1, 'What is your experience with programming?', '2024-01-06 12:00:00', '2024-01-06 12:00:00'),
    (2, 'Do you have prior knowledge of data science?', '2024-01-06 12:05:00', '2024-01-06 12:05:00');

INSERT INTO response (id, test_id, question_id, response, created_at, updated_at)
VALUES
    (1, 1, 1, 5, '2024-01-06 12:10:00', '2024-01-06 12:10:00'),
    (2, 2, 2, 4, '2024-01-06 12:15:00', '2024-01-06 12:15:00');

INSERT INTO bookmark (id, course_id, student_id, created_at, updated_at)
VALUES
    (1, 1, 1, '2024-01-07 08:30:00', '2024-01-07 08:30:00'),
    (2, 2, 2, '2024-01-07 09:45:00', '2024-01-07 09:45:00');

INSERT INTO student_acad_interest (id, student_id, rating, created_at, updated_at)
VALUES
    (1, 1, 4, '2024-01-08 10:00:00', '2024-01-08 10:00:00'),
    (2, 2, 5, '2024-01-08 11:15:00', '2024-01-08 11:15:00');

INSERT INTO acad_interest (id, studentacadinterestid, name, created_at, updated_at)
VALUES
    (1, 1, English, '2024-01-08 10:00:00', '2024-01-08 10:00:00');

INSERT INTO student_acad_performance (id, student_id, grade, created_at, updated_at)
VALUES
    (1, 1, 4, '2024-01-08 10:00:00', '2024-01-08 10:00:00'),
    (2, 2, 5, '2024-01-08 11:15:00', '2024-01-08 11:15:00');

INSERT INTO acad_performance (id, studentacadperformanceid, name, created_at, updated_at)
VALUES
    (1, 1, English, '2024-01-08 10:00:00', '2024-01-08 10:00:00');

INSERT INTO feedback (id, student_id, message, created_at, updated_at)
VALUES
    (1, 1, Helloworld, '2024-01-08 10:00:00', '2024-01-08 10:00:00');

INSERT INTO feedback_answer (id, answer, feedback_id, feedbackquestion_id, created_at, updated_at)
VALUES
    (1, 2, 1, '2024-01-08 10:00:00', '2024-01-08 10:00:00');

INSERT INTO feedback_question (id, message, created_at, updated_at)
VALUES
    (1, Helloworld, '2024-01-08 10:00:00', '2024-01-08 10:00:00' );


