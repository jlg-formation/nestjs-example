CREATE DATABASE IF NOT EXISTS nestjs_example
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE nestjs_example;

CREATE TABLE IF NOT EXISTS clients (
  id VARCHAR(36) NOT NULL,
  name VARCHAR(255) NOT NULL,
  balance INT NOT NULL DEFAULT 0,
  PRIMARY KEY (id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS recharges (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  client_id VARCHAR(36) NOT NULL,
  amount INT NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX idx_recharges_client_id (client_id),
  CONSTRAINT fk_recharges_client
    FOREIGN KEY (client_id)
    REFERENCES clients (id)
    ON DELETE RESTRICT
    ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS reservations (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  client_id VARCHAR(36) NOT NULL,
  reference VARCHAR(255) NOT NULL,
  amount INT NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX idx_reservations_client_id (client_id),
  CONSTRAINT fk_reservations_client
    FOREIGN KEY (client_id)
    REFERENCES clients (id)
    ON DELETE RESTRICT
    ON UPDATE CASCADE
) ENGINE=InnoDB;
