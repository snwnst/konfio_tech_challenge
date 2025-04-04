SELECT VERSION() AS `version`;
SELECT * FROM `COLUMNS` WHERE `TABLE_SCHEMA` = 'konfio_customer' AND `TABLE_NAME` = 'migrations';
SELECT * FROM `migrations` `migrations` ORDER BY `id` DESC;
START TRANSACTION;
ALTER TABLE `customers` ADD `isDeleted` tinyint NOT NULL DEFAULT 0;
INSERT INTO `migrations`(`timestamp`, `name`) VALUES (?, ?) -- PARAMETERS: [1743738524086,"V11743738524086"];
COMMIT;