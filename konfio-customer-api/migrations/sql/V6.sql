SELECT VERSION() AS `version`;
SELECT * FROM `COLUMNS` WHERE `TABLE_SCHEMA` = 'konfio_customer' AND `TABLE_NAME` = 'migrations';
SELECT * FROM `migrations` `migrations` ORDER BY `id` DESC;