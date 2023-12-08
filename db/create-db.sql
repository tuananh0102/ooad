-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
-- -----------------------------------------------------
-- Schema jobsgo
-- -----------------------------------------------------
DROP SCHEMA IF EXISTS `jobsgo` ;

-- -----------------------------------------------------
-- Schema jobsgo
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `jobsgo` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci ;
USE `jobsgo` ;

-- -----------------------------------------------------
-- Table `jobsgo`.`user`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `jobsgo`.`user` (
  `id` VARCHAR(45) NOT NULL,
  `username` VARCHAR(16) NOT NULL,
  `name` VARCHAR(45) NULL DEFAULT NULL,
  `email` VARCHAR(255) NULL DEFAULT NULL,
  `phone` VARCHAR(15) NULL DEFAULT NULL,
  `avatar` VARCHAR(255) NULL DEFAULT NULL,
  `role` VARCHAR(20) NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `address` VARCHAR(45) NULL DEFAULT NULL,
  `createdAt` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`, `username`),
  UNIQUE INDEX `email_UNIQUE` (`email` ASC) VISIBLE,
  UNIQUE INDEX `phone_UNIQUE` (`phone` ASC) VISIBLE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `jobsgo`.`employer`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `jobsgo`.`employer` (
  `id` VARCHAR(45) NOT NULL,
  `about` LONGTEXT NULL DEFAULT NULL,
  `wallpaper` VARCHAR(255) NULL DEFAULT NULL,
  `size` INT NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_employer_1`
    FOREIGN KEY (`id`)
    REFERENCES `jobsgo`.`user` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `jobsgo`.`job`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `jobsgo`.`job` (
  `id` VARCHAR(45) NOT NULL,
  `title` VARCHAR(255) NULL DEFAULT NULL,
  `description` LONGTEXT NULL DEFAULT NULL,
  `requirements` LONGTEXT NULL DEFAULT NULL,
  `tags` LONGTEXT NULL DEFAULT NULL,
  `author` VARCHAR(45) NOT NULL,
  `startTime` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `endTime` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `createdAt` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `salary` BIGINT NULL DEFAULT NULL,
  `typeOfWorking` VARCHAR(45) NULL DEFAULT NULL,
  `gender` VARCHAR(45) NULL DEFAULT NULL,
  `positions` VARCHAR(45) NULL DEFAULT NULL,
  `slots` INT NULL DEFAULT NULL,
  `exp` VARCHAR(45) NULL DEFAULT NULL,
  `benefits` LONGTEXT NULL DEFAULT NULL,
  `imageUrl` TINYTEXT NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_job_1_idx` (`author` ASC) VISIBLE,
  CONSTRAINT `fk_job_1`
    FOREIGN KEY (`author`)
    REFERENCES `jobsgo`.`employer` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `jobsgo`.`jobseeker`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `jobsgo`.`jobseeker` (
  `id` VARCHAR(45) NOT NULL,
  `age` INT NULL DEFAULT NULL,
  `gender` VARCHAR(45) NULL DEFAULT NULL,
  `experience` VARCHAR(45) NULL DEFAULT NULL,
  `advanedSkill` LONGTEXT NULL DEFAULT NULL,
  `salary` INT NULL DEFAULT NULL,
  `workplace` VARCHAR(45) NULL DEFAULT NULL,
  `cv` LONGTEXT NULL DEFAULT NULL,
  `careerFeild` VARCHAR(45) NULL DEFAULT NULL,
  `typeOfJob` VARCHAR(45) NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_employer_10`
    FOREIGN KEY (`id`)
    REFERENCES `jobsgo`.`user` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `jobsgo`.`application`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `jobsgo`.`application` (
  `id` VARCHAR(45) NOT NULL,
  `jobseekerId` VARCHAR(45) NOT NULL,
  `jobId` VARCHAR(45) NOT NULL,
  `status` VARCHAR(45) NULL DEFAULT NULL,
  `createdAt` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` TIMESTAMP NULL DEFAULT NULL,
  INDEX `fk_application_1_idx` (`jobId` ASC) VISIBLE,
  INDEX `fk_application_2_idx` (`jobseekerId` ASC) VISIBLE,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_application_1`
    FOREIGN KEY (`jobId`)
    REFERENCES `jobsgo`.`job` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_application_2`
    FOREIGN KEY (`jobseekerId`)
    REFERENCES `jobsgo`.`jobseeker` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `jobsgo`.`careerfeild`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `jobsgo`.`careerfeild` (
  `id` VARCHAR(45) NOT NULL,
  `name` VARCHAR(45) NOT NULL,
  `description` LONGTEXT NULL DEFAULT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `jobsgo`.`comment`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `jobsgo`.`comment` (
  `id` VARCHAR(45) NOT NULL,
  `employerId` VARCHAR(45) NOT NULL,
  `content` LONGTEXT NULL DEFAULT NULL,
  `createdAt` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` TIMESTAMP NULL DEFAULT NULL,
  `author` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_review_1_idx` (`employerId` ASC) VISIBLE,
  INDEX `fk_userr_1_idx` (`author` ASC) VISIBLE,
  CONSTRAINT `fk_review_1`
    FOREIGN KEY (`employerId`)
    REFERENCES `jobsgo`.`employer` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_userr_1`
    FOREIGN KEY (`author`)
    REFERENCES `jobsgo`.`user` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `jobsgo`.`conversation`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `jobsgo`.`conversation` (
  `id` VARCHAR(45) NOT NULL,
  `lastMsg` VARCHAR(45) NULL DEFAULT NULL,
  `updatedAt` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `createdAt` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `firstUser` VARCHAR(45) NOT NULL,
  `secondUser` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_first_user_idx` (`firstUser` ASC) VISIBLE,
  INDEX `fk_second_user_idx` (`secondUser` ASC) VISIBLE,
  CONSTRAINT `fk_first_user`
    FOREIGN KEY (`firstUser`)
    REFERENCES `jobsgo`.`user` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_second_user`
    FOREIGN KEY (`secondUser`)
    REFERENCES `jobsgo`.`user` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `jobsgo`.`education`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `jobsgo`.`education` (
  `id` VARCHAR(45) NOT NULL,
  `jobseekerId` VARCHAR(45) NOT NULL,
  `school` VARCHAR(45) NOT NULL,
  `degree` VARCHAR(45) NOT NULL,
  `major` VARCHAR(45) NOT NULL,
  `startDate` VARCHAR(45) NOT NULL,
  `endDate` VARCHAR(45) NOT NULL,
  `description` LONGTEXT NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_education_1` (`jobseekerId` ASC) VISIBLE,
  CONSTRAINT `fk_education_1`
    FOREIGN KEY (`jobseekerId`)
    REFERENCES `jobsgo`.`jobseeker` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `jobsgo`.`message`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `jobsgo`.`message` (
  `id` VARCHAR(45) NOT NULL,
  `conversationId` VARCHAR(45) NOT NULL,
  `content` LONGTEXT NOT NULL,
  `sender` VARCHAR(45) NOT NULL,
  `status` VARCHAR(45) NULL DEFAULT NULL,
  `createdAt` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `fk_conversation_1_idx` (`conversationId` ASC) VISIBLE,
  INDEX `fk_user_1_idx` (`sender` ASC) VISIBLE,
  CONSTRAINT `fk_conversation_1`
    FOREIGN KEY (`conversationId`)
    REFERENCES `jobsgo`.`conversation` (`id`),
  CONSTRAINT `fk_user_1`
    FOREIGN KEY (`sender`)
    REFERENCES `jobsgo`.`user` (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `jobsgo`.`position`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `jobsgo`.`position` (
  `id` INT NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `description` LONGTEXT NULL DEFAULT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `jobsgo`.`typeofjob`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `jobsgo`.`typeofjob` (
  `id` VARCHAR(45) NOT NULL,
  `name` VARCHAR(45) NOT NULL,
  `description` LONGTEXT NULL DEFAULT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `jobsgo`.`bookmark`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `jobsgo`.`bookmark` (
  `id` VARCHAR(45) NOT NULL,
  `jobseekerId` VARCHAR(45) NOT NULL,
  `jobId` VARCHAR(45) NOT NULL,
  INDEX `fk_application_1_idx` (`jobId` ASC) VISIBLE,
  INDEX `fk_application_2_idx` (`jobseekerId` ASC) VISIBLE,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_application_10`
    FOREIGN KEY (`jobId`)
    REFERENCES `jobsgo`.`job` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_application_20`
    FOREIGN KEY (`jobseekerId`)
    REFERENCES `jobsgo`.`jobseeker` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;