SELECT VERSION() AS `version`;
SELECT * FROM `COLUMNS` WHERE `TABLE_SCHEMA` = 'konfio_customer' AND `TABLE_NAME` = 'migrations';
SELECT * FROM `migrations` `migrations` ORDER BY `id` DESC;
START TRANSACTION;
ALTER TABLE `customers` ADD `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP;
INSERT INTO `migrations`(`timestamp`, `name`) VALUES (?, ?) -- PARAMETERS: [1743743373015,"V11743743373015"];
COMMIT;