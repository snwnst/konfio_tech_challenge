SELECT VERSION() AS `version`;
SELECT * FROM `COLUMNS` WHERE `TABLE_SCHEMA` = 'konfio_customer' AND `TABLE_NAME` = 'migrations';
CREATE TABLE `migrations` (`id` int NOT NULL AUTO_INCREMENT, `timestamp` bigint NOT NULL, `name` varchar(255) NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB;
SELECT * FROM `migrations` `migrations` ORDER BY `id` DESC;
START TRANSACTION;
CREATE TABLE `parties` (`id` varchar(36) NOT NULL, `name` varchar(255) NOT NULL, `email` varchar(255) NOT NULL, `role` enum ('ADMIN', 'EMPLOYEE', 'READ_ONLY') NOT NULL DEFAULT 'READ_ONLY', `customerId` varchar(255) NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB;
CREATE TABLE `contact_info` (`id` varchar(36) NOT NULL, `email` varchar(255) NOT NULL, `phone` varchar(255) NULL, `address` varchar(255) NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB;
CREATE TABLE `customers` (`id` varchar(36) NOT NULL, `name` varchar(255) NOT NULL, `email` varchar(255) NOT NULL, `taxId` varchar(255) NOT NULL, `type` enum ('ENTERPRISE', 'INDIVIDUAL') NOT NULL DEFAULT 'INDIVIDUAL', `isDeleted` tinyint NOT NULL DEFAULT 0, `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, `contactInfoId` varchar(36) NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB;
ALTER TABLE `parties` ADD CONSTRAINT `FK_4802403ec96bcde9f00e7bbd7e0` FOREIGN KEY (`customerId`) REFERENCES `customers`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `customers` ADD CONSTRAINT `FK_88304b7ca2a06c32bf3802db626` FOREIGN KEY (`contactInfoId`) REFERENCES `contact_info`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
INSERT INTO `migrations`(`timestamp`, `name`) VALUES (?, ?) -- PARAMETERS: [1743745587088,"V11743745587088"];
COMMIT;