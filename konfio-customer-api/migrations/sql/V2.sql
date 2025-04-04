SELECT VERSION() AS `version`;
SELECT * FROM `COLUMNS` WHERE `TABLE_SCHEMA` = 'konfio_customer' AND `TABLE_NAME` = 'migrations';
SELECT * FROM `migrations` `migrations` ORDER BY `id` DESC;
START TRANSACTION;
ALTER TABLE `customers` DROP COLUMN `email`;
INSERT INTO `migrations`(`timestamp`, `name`) VALUES (?, ?) -- PARAMETERS: [1743776843844,"V11743776843844"];
COMMIT;