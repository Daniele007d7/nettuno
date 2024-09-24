CREATE TABLE `image` (
   `id` int,
   `path` longtext
 ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


CREATE TABLE `post` (
   `id` int NOT NULL AUTO_INCREMENT,
   `titolo` varchar(500) NOT NULL,
   `testo` mediumtext NOT NULL,
   `data` varchar(50) NOT NULL,
   PRIMARY KEY (`id`)
 ) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci