-- 오브젝트 테이블
CREATE TABLE objects
(
    id         BIGINT AUTO_INCREMENT PRIMARY KEY,
    type       TINYINT NOT NULL,
    image_url  VARCHAR(255),
    width      INT     NOT NULL,
    height     INT     NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at DATETIME DEFAULT NULL
);

-- 방 테이블
CREATE TABLE rooms
(
    id         BIGINT AUTO_INCREMENT PRIMARY KEY,
    code       VARCHAR(8) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL UNIQUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at DATETIME DEFAULT NULL,
    INDEX idx_room_code (code)
);

-- 방에 배치된 오브젝트 테이블
CREATE TABLE room_objects
(
    id         BIGINT AUTO_INCREMENT PRIMARY KEY,
    room_id    BIGINT NOT NULL,
    object_id  BIGINT NOT NULL,
    pos_x      INT    NOT NULL,
    pos_y      INT    NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at DATETIME DEFAULT NULL,
    FOREIGN KEY (room_id) REFERENCES rooms (id) ON DELETE CASCADE,
    FOREIGN KEY (object_id) REFERENCES objects (id) ON DELETE CASCADE
);

