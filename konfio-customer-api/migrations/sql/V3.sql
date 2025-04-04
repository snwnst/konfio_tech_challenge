SELECT VERSION() AS `version`;
SELECT * FROM `COLUMNS` WHERE `TABLE_SCHEMA` = 'konfio_customer' AND `TABLE_NAME` = 'migrations';
SELECT * FROM `migrations` `migrations` ORDER BY `id` DESC;
START TRANSACTION;
ALTER TABLE `customers` ADD `contactInfoId` varchar(36) NULL;
ALTER TABLE `customers` ADD CONSTRAINT `FK_88304b7ca2a06c32bf3802db626` FOREIGN KEY (`contactInfoId`) REFERENCES `contact_info`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
INSERT INTO `migrations`(`timestamp`, `name`) VALUES (?, ?) -- PARAMETERS: [1743734252008,"V11743734252008"];
COMMIT;