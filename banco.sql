-- MySQL dump 10.13  Distrib 8.0.39, for Linux (x86_64)
--
-- Host: localhost    Database: estoque
-- ------------------------------------------------------
-- Server version	8.0.39

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `adaptadores`
--

DROP TABLE IF EXISTS `adaptadores`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `adaptadores` (
  `id` int NOT NULL AUTO_INCREMENT,
  `ativo_id` int DEFAULT NULL,
  `tipo` varchar(255) DEFAULT NULL,
  `conexao_entrada` varchar(255) DEFAULT NULL,
  `conexao_saida` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `ativo_id` (`ativo_id`),
  CONSTRAINT `adaptadores_ibfk_1` FOREIGN KEY (`ativo_id`) REFERENCES `ativos` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `adaptadores`
--

LOCK TABLES `adaptadores` WRITE;
/*!40000 ALTER TABLE `adaptadores` DISABLE KEYS */;
INSERT INTO `adaptadores` VALUES (12,107,'Tip','Entrad','Saíd'),(13,108,'aaa','aaaaaaaaaa','aaaaaaaaaaaaa'),(18,124,'ss','hhh','s'),(19,158,'Tipo 2','Entrad 4','Saída 3'),(20,159,'Tipo 2','Entrad 4','Saída 3'),(21,160,'Tipo 2','Entrad 4','Saída 3');
/*!40000 ALTER TABLE `adaptadores` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `armazenamento`
--

DROP TABLE IF EXISTS `armazenamento`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `armazenamento` (
  `id` int NOT NULL AUTO_INCREMENT,
  `ativo_id` int DEFAULT NULL,
  `tipo` varchar(255) DEFAULT NULL,
  `capacidade` varchar(50) DEFAULT NULL,
  `interface` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `ativo_id` (`ativo_id`),
  CONSTRAINT `armazenamento_ibfk_1` FOREIGN KEY (`ativo_id`) REFERENCES `ativos` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `armazenamento`
--

LOCK TABLES `armazenamento` WRITE;
/*!40000 ALTER TABLE `armazenamento` DISABLE KEYS */;
INSERT INTO `armazenamento` VALUES (11,152,'Nome Arm ','Nome Arm ','Nome Arm '),(12,153,'Nome Arm 2','Nome Arm 2','Nome Arm 2'),(13,154,'Nome Arm 3','Nome Arm 3','Nome Arm 3'),(14,155,'Nome Arm 3','Nome Arm 3','Nome Arm 3'),(15,156,'Nome Arm 3',NULL,'Nome Arm 3');
/*!40000 ALTER TABLE `armazenamento` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ativos`
--

DROP TABLE IF EXISTS `ativos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ativos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(255) NOT NULL,
  `categoria_id` int DEFAULT NULL,
  `quantidade` int NOT NULL,
  `descricao` text,
  `identificacao` varchar(255) DEFAULT NULL,
  `estado` enum('Novo','Usado','Defeituoso') NOT NULL,
  `local` varchar(255) DEFAULT NULL,
  `supervisionado` tinyint(1) NOT NULL DEFAULT '0',
  `est_alerta` int DEFAULT NULL,
  `serial` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `categoria_id` (`categoria_id`),
  CONSTRAINT `ativos_ibfk_1` FOREIGN KEY (`categoria_id`) REFERENCES `categorias` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=233 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ativos`
--

LOCK TABLES `ativos` WRITE;
/*!40000 ALTER TABLE `ativos` DISABLE KEYS */;
INSERT INTO `ativos` VALUES (7,'Cabo HDMI 2.0 1.5m',NULL,20,'Cabo de vídeo HDMI 2.0 para transmissão de imagem e som','CAB001','Novo','Lab TI',0,NULL,'SN1234567810'),(8,'Cabo USB-C para USB-A 1m',3,15,'Cabo de carregamento e transferência de dados','CAB002','Novo','Lab TI',1,NULL,'SN1234567810'),(10,'Cabo VGA 3m',3,10,'Cabo para conexão de vídeo VGA','CAB004','Novo','Lab TI',0,NULL,'SN1234567810'),(11,'Cabo P2 para P2 1.8m',NULL,24,'Cabo de áudio P2 para P2 estéreo','CAB005','Novo','Lab TI',0,NULL,'SN1234567810'),(12,'Desktop Dell OptiPlex 7090',5,5,'Computador de mesa de alto desempenho','DTP001','Novo','Lab TI',1,NULL,'SN1234567810'),(13,'Desktop Lenovo ThinkCentre M7206',5,3,'Computador corporativo compacto','DTP002','Novo','Lab TI',0,NULL,'SN1234567810'),(14,'Desktop HP EliteDesk 800 G6',5,4,'Desktop empresarial com alta performance','DTP003','Novo','Lab TI',0,NULL,'SN1234567810'),(15,'Desktop Acer Veriton X2660G',5,2,'Computador de mesa para escritório','DTP004','Novo','Lab TI',0,NULL,'SN1234567810'),(16,'Desktop Custom Gamer',5,1,'Computador montado para jogos e edição','DTP005','Novo','Lab TI',0,NULL,'SN1234567810'),(17,'Fonte Corsair 750W',7,7,'Fonte de alimentação ATX 750W 80 Plus Bronze','FNT001','Novo','Lab TI',1,NULL,'SN1234567810'),(18,'Fonte EVGA 600W',7,3,'Fonte de alimentação ATX 600W 80 Plus White','FNT002','Novo','Lab TI',0,NULL,'SN1234567810'),(19,'Fonte Cooler Master 500W',7,4,'Fonte de alimentação ATX 500W 80 Plus','FNT003','Novo','Lab TI',0,NULL,'SN1234567810'),(25,'Memória Kingston 8GB DDR4',9,10,'Módulo de memória RAM DDR4 8GB 2666MHz','RAM001','Novo','Lab TI',1,NULL,'SN1234567810'),(26,'Memória Corsair Vengeance 16GB DDR4',9,6,'Módulo de memória RAM DDR4 16GB 3200MHz','RAM002','Novo','Lab TI',0,NULL,'SN1234567810'),(27,'Memória Crucial Ballistix 32GB DDR4',9,4,'Módulo de memória RAM DDR4 32GB 3600MHz','RAM003','Novo','Lab TI',0,NULL,'SN1234567810'),(28,'Memória HyperX Fury 16GB DDR5',9,5,'Módulo de memória RAM DDR5 16GB 5200MHz','RAM004','Novo','Lab TI',0,NULL,'SN1234567810'),(29,'Memória G.Skill Trident Z 32GB DDR5',9,3,'Módulo de memória RAM DDR5 32GB 6000MHz','RAM005','Novo','Lab TI',0,NULL,'SN1234567810'),(30,'Monitor Dell 24\" Full HD',10,8,'Monitor IPS 24 polegadas Full HD 75Hz','MON001','Novo','Lab TI',1,NULL,'SN1234567810'),(31,'Monitor LG UltraGear 27\" 144Hz',10,5,'Monitor IPS 27 polegadas 144Hz 1ms','MON002','Novo','Lab TI',0,NULL,'SN1234567810'),(32,'Monitor Samsung Odyssey G5 32\"',10,4,'Monitor VA curvo 32 polegadas 165Hz','MON003','Novo','Lab TI',0,NULL,'SN1234567810'),(33,'Monitor AOC Hero 24\" 144Hz',10,6,'Monitor Gamer 24 polegadas 144Hz 1ms','MON004','Novo','Lab TI',0,NULL,'SN1234567810'),(34,'Monitor Asus TUF Gaming 27\" 165Hz',10,3,'Monitor IPS 27 polegadas 165Hz HDR','MON005','Novo','Lab TI',0,NULL,'SN1234567810'),(35,'Notebook Dell Inspiron 15',11,5,'Notebook 15.6\" com Intel Core i5 e SSD 512GB','NBK001','Novo','Lab TI',1,NULL,'SN1234567810'),(36,'Notebook Lenovo ThinkPad X1 Carbon',11,3,'Ultrabook 14\" com Intel Core i7 e 16GB RAM','NBK002','Novo','Lab TI',0,NULL,'SN1234567810'),(37,'Notebook Acer Nitro 5',11,4,'Notebook Gamer 15.6\" com Ryzen 7 e GTX 1650','NBK003','Novo','Lab TI',0,NULL,'SN1234567810'),(38,'Notebook Apple MacBook Air M2',11,2,'MacBook Air com chip M2 e tela Retina 13.6\"','NBK004','Novo','Lab TI',0,NULL,'SN1234567810'),(39,'Notebook Asus ZenBook 14',11,3,'Ultrabook 14\" com Intel Core i5 e SSD 512GB','NBK005','Novo','Lab TI',0,NULL,'SN1234567810'),(40,'NUC Intel Core i5',12,1,'Mini PC compacto','NUC001','Novo','Lab TI',1,NULL,'SN1234567810'),(41,'NUC Intel Core i7',12,1,'Mini PC compacto e poderoso','NUC002','Novo','Lab TI',0,NULL,'SN1234567810'),(42,'NUC Intel Core i3',12,1,'Mini PC compacto de entrada','NUC003','Novo','Lab TI',0,NULL,'SN1234567810'),(43,'NUC AMD Ryzen 5',12,1,'Mini PC compacto com processador AMD','NUC004','Novo','Lab TI',0,NULL,'SN1234567810'),(44,'NUC Intel Core i9',12,1,'Mini PC de alto desempenho','NUC005','Novo','Lab TI',0,NULL,'SN1234567810'),(53,'Cabo de Rede Cat6 5m',14,30,'Cabo de rede Ethernet categoria 6','RED001','Novo','Lab TI',1,NULL,'SN1234567810'),(54,'Cabo VGA 3m',14,10,'Cabo para conexão de vídeo VGA','RED002','Novo','Lab TI',0,NULL,'SN1234567810'),(55,'Cabo P2 para P2 1.8m',14,25,'Cabo de áudio P2 para P2 estéreo','RED003','Novo','Lab TI',0,NULL,'SN1234567810'),(107,'Teste de Barcod',1,11,'este de barcode','ADA001','Novo','TI',1,NULL,'SN1234567810'),(108,'ASA',1,8,'ASA','ADA002','Usado','CGR',0,NULL,'SN1234567810'),(118,'asdada',7,4,'dada','FON001','Novo','Lab TI',0,NULL,'adsada'),(124,'Teste',1,4,'teste local','ADA003','Novo','Estoque',0,NULL,'h'),(152,'Nome Arm ',2,10,'Nome Arm Nome Arm ','ARM001','Novo','Lab TI',0,NULL,NULL),(153,'Nome Arm 2',2,1,'Nome Arm 2','ARM002','Novo','Lab TI',0,NULL,'SN4545'),(154,'Nome Arm 3',2,1,'Nome Arm 3','ARM003','Novo','Lab TI',0,NULL,'SN1'),(155,'Nome Arm 3',2,1,'Nome Arm 3','ARM004','Novo','Lab TI',0,NULL,'SN2'),(156,'Nome Arm 3',2,1,'Nome Arm 3','ARM005','Novo','Lab TI',0,NULL,'SN3'),(158,'Nome Adp',1,1,'Nome Adp','ADA004','Novo','Lab TI',0,NULL,'SN1'),(159,'Nome Adp',1,1,'Nome Adp','ADA005','Novo','Lab TI',0,NULL,'SN2'),(160,'Nome Adp',1,1,'Nome Adp','ADA006','Novo','Lab TI',0,NULL,'SN3'),(231,'Telefonia',15,2,'Telefonia','TEL001','Defeituoso','Lab TI',0,NULL,NULL),(232,'Periferico',13,1,'Periferico','PER001','Novo','Lab TI',0,NULL,'SN436436346');
/*!40000 ALTER TABLE `ativos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cabos`
--

DROP TABLE IF EXISTS `cabos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cabos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `ativo_id` int DEFAULT NULL,
  `tipo` varchar(255) DEFAULT NULL,
  `comprimento` varchar(255) DEFAULT NULL,
  `material` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `ativo_id` (`ativo_id`),
  CONSTRAINT `cabos_ibfk_1` FOREIGN KEY (`ativo_id`) REFERENCES `ativos` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cabos`
--

LOCK TABLES `cabos` WRITE;
/*!40000 ALTER TABLE `cabos` DISABLE KEYS */;
INSERT INTO `cabos` VALUES (1,7,'HDMI','1.50','Cobre'),(2,8,'tipo','co,p','mat'),(4,10,'VGA','3.00','Cobre'),(5,11,'Áudio P2','1.80','Cobre');
/*!40000 ALTER TABLE `cabos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `categorias`
--

DROP TABLE IF EXISTS `categorias`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categorias` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categorias`
--

LOCK TABLES `categorias` WRITE;
/*!40000 ALTER TABLE `categorias` DISABLE KEYS */;
INSERT INTO `categorias` VALUES (1,'Adaptador'),(2,'Armazenamento'),(3,'Cabos'),(5,'Desktop/AIO'),(7,'Fontes'),(9,'Memória RAM'),(10,'Monitor'),(11,'Notebook'),(12,'NUC'),(13,'Periféricos'),(14,'Redes'),(15,'Telefonia');
/*!40000 ALTER TABLE `categorias` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `desktops`
--

DROP TABLE IF EXISTS `desktops`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `desktops` (
  `id` int NOT NULL AUTO_INCREMENT,
  `ativo_id` int DEFAULT NULL,
  `processador` varchar(255) DEFAULT NULL,
  `memoria_ram` varchar(255) DEFAULT NULL,
  `armazenamento` varchar(255) DEFAULT NULL,
  `fonte_alimentacao` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `ativo_id` (`ativo_id`),
  CONSTRAINT `desktops_ibfk_1` FOREIGN KEY (`ativo_id`) REFERENCES `ativos` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `desktops`
--

LOCK TABLES `desktops` WRITE;
/*!40000 ALTER TABLE `desktops` DISABLE KEYS */;
INSERT INTO `desktops` VALUES (1,12,'Intel Core i7-10700','16GB DDR4','512GB SSD NVMe','300W 80 Plus'),(2,13,'Intel Core i5-9400','8GB DDR4','256GB SSD','250W 80 Plus'),(3,14,'Intel Core i7-9700','16GB DDR4','1TB HDD + 256GB SSD','350W 80 Plus Bronze'),(4,15,'Intel Core i3-8100','8GB DDR4','500GB HDD','220W 80 Plus'),(5,16,'AMD Ryzen 7 5800X','32GB DDR4','1TB SSD NVMe + 2TB HDD','750W 80 Plus Gold');
/*!40000 ALTER TABLE `desktops` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `entradas_saidas`
--

DROP TABLE IF EXISTS `entradas_saidas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `entradas_saidas` (
  `id` int NOT NULL AUTO_INCREMENT,
  `numero` varchar(10) DEFAULT NULL,
  `data` varchar(25) DEFAULT NULL,
  `status` varchar(15) DEFAULT NULL,
  `usuario_id` int DEFAULT NULL,
  `ativo_id` int DEFAULT NULL,
  `movimentacao` varchar(255) DEFAULT NULL,
  `quantidade` int DEFAULT NULL,
  `email_id` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `usuario_id` (`usuario_id`),
  KEY `entradas_saidas_ibfk_2` (`ativo_id`),
  CONSTRAINT `entradas_saidas_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`),
  CONSTRAINT `entradas_saidas_ibfk_2` FOREIGN KEY (`ativo_id`) REFERENCES `ativos` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `entradas_saidas`
--

LOCK TABLES `entradas_saidas` WRITE;
/*!40000 ALTER TABLE `entradas_saidas` DISABLE KEYS */;
INSERT INTO `entradas_saidas` VALUES (2,'#0001','13/05/2025 14h26','Recusado',1,107,'Entrada',2,NULL),(3,'#0002','13/05/2025 15h53','Recusado',1,107,'Entrada',1,NULL),(4,'#0003','14/05/2025 09h31','Recusado',1,107,'Retirada',3,NULL),(5,'#0004','14/05/2025 10h55','Concluído',1,107,'Entrada',1,NULL),(6,'#0005','14/05/2025 10h56','Concluído',1,107,'Retirada',2,NULL),(7,'#0006','14/05/2025 10h59','Concluído',1,107,'Entrada',3,NULL),(10,'#0009','15/05/2025 10h50','Concluído',1,107,'Retirada',1,NULL),(11,'#0010','15/05/2025 10h52','Recusado',1,108,'Entrada',1,NULL),(12,'#0011','15/05/2025 10h53','Recusado',1,108,'Entrada',1,NULL),(13,'#0012','15/05/2025 11h17','Recusado',1,107,'Entrada',2,NULL),(14,'#0013','23/05/2025 15h55','Recusado',1,107,'Entrada',1,NULL),(15,'#0014','23/05/2025 16h00','Recusado',1,107,'Retirada',1,'<1f5b7134-1bc8-46c1-8549-c5a121363e92@lestetelecom.tec.br>'),(16,'#0015','26/05/2025 10h56','Concluído',1,107,'Entrada',1,'<6b87d447-2ad0-4878-af82-332d7a2945d3@lestetelecom.tec.br>'),(22,'#0021','30/05/2025 11h36','Concluído',1,107,'Entrada',1,'<47d09609-7aa3-4fe8-827d-ca79f4d3d55b@lestetelecom.tec.br>'),(23,'#0022','02/06/2025 10h45','Pendente',1,107,'Retirada',1,'<b69720ca-e34d-4f49-9adb-a5c707d4175c@lestetelecom.tec.br>'),(24,'#0023','02/06/2025 11h27','Pendente',1,107,'Entrada',1,'<9490583b-0c0b-4779-88df-3686b897d971@lestetelecom.tec.br>'),(25,'#0024','02/06/2025 11h29','Pendente',1,107,'Entrada',1,'<18a11c94-70b6-4ce5-ae56-66dd7ed3c56c@lestetelecom.tec.br>'),(26,'#0025','02/06/2025 11h37','Pendente',1,107,'Entrada',1,'<acbe7ec6-2a81-426b-9f29-5524928afac8@lestetelecom.tec.br>');
/*!40000 ALTER TABLE `entradas_saidas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `feedback_images`
--

DROP TABLE IF EXISTS `feedback_images`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `feedback_images` (
  `id` int NOT NULL AUTO_INCREMENT,
  `feedback_id` int NOT NULL,
  `image_name` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `feedback_id` (`feedback_id`),
  CONSTRAINT `feedback_images_ibfk_1` FOREIGN KEY (`feedback_id`) REFERENCES `feedbacks` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `feedback_images`
--

LOCK TABLES `feedback_images` WRITE;
/*!40000 ALTER TABLE `feedback_images` DISABLE KEYS */;
INSERT INTO `feedback_images` VALUES (1,5,'5_shrek.jpg');
/*!40000 ALTER TABLE `feedback_images` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `feedbacks`
--

DROP TABLE IF EXISTS `feedbacks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `feedbacks` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(255) NOT NULL,
  `feedback_name` varchar(255) NOT NULL,
  `mensagem` text NOT NULL,
  `data` varchar(25) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `feedbacks`
--

LOCK TABLES `feedbacks` WRITE;
/*!40000 ALTER TABLE `feedbacks` DISABLE KEYS */;
INSERT INTO `feedbacks` VALUES (4,'maria_zefiro','Assunto','Imagem','02/05/2025, 12:04:48'),(5,'maria_zefiro','TESTE2','TESTE2TESTE2TESTE2TESTE2','02/05/2025, 13:45:50'),(6,'usuario_teste1','Assunto do Feedback','Feedback enviado pelo usuário usuário_teste1','15/05/2025, 09:25:42'),(7,'maria_zefiro','TESTE QA','Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent faucibus porta efficitur. Etiam lobortis vestibulum urna eget consectetur. Mauris mollis lacinia ornare. Quisque pulvinar purus vestibulum, malesuada elit at, luctus urna. Nunc ullamcorper libero ut euismod pharetra. Etiam sem libero, suscipit a libero a, porttitor iaculis turpis. In condimentum justo nec nisi venenatis, sagittis lobortis nisi rhoncus. Praesent vel porta erat, in rutrum odio. Nunc ac accumsan ligula. Quisque augue lectus, fringilla in arcu efficitur, mattis cursus odio. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Mauris dui mauris, rhoncus et ex ut, accumsan sagittis turpis. Donec feugiat nunc vitae eleifend pulvinar.','5/30/2025, 11:46:20 AM'),(8,'maria_zefiro','sd','gbvsdbvsb','02/06/2025, 11:36:35');
/*!40000 ALTER TABLE `feedbacks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `fontes`
--

DROP TABLE IF EXISTS `fontes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `fontes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `ativo_id` int DEFAULT NULL,
  `potencia_watts` varchar(25) DEFAULT NULL,
  `modular` varchar(5) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `ativo_id` (`ativo_id`),
  CONSTRAINT `fontes_ibfk_1` FOREIGN KEY (`ativo_id`) REFERENCES `ativos` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `fontes`
--

LOCK TABLES `fontes` WRITE;
/*!40000 ALTER TABLE `fontes` DISABLE KEYS */;
INSERT INTO `fontes` VALUES (1,17,'750','1'),(2,18,'600','0'),(3,19,'500','1'),(11,118,'asda','0');
/*!40000 ALTER TABLE `fontes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `memorias_ram`
--

DROP TABLE IF EXISTS `memorias_ram`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `memorias_ram` (
  `id` int NOT NULL AUTO_INCREMENT,
  `ativo_id` int DEFAULT NULL,
  `capacidade` varchar(50) DEFAULT NULL,
  `tipo` varchar(50) DEFAULT NULL,
  `frequencia` varchar(255) DEFAULT NULL,
  `latencia` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `ativo_id` (`ativo_id`),
  CONSTRAINT `memorias_ram_ibfk_1` FOREIGN KEY (`ativo_id`) REFERENCES `ativos` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `memorias_ram`
--

LOCK TABLES `memorias_ram` WRITE;
/*!40000 ALTER TABLE `memorias_ram` DISABLE KEYS */;
INSERT INTO `memorias_ram` VALUES (1,25,'8GB','DDR4','2666','CL16'),(2,26,'16GB','DDR4','3200','CL18'),(3,27,'32GB','DDR4','3600','CL16'),(4,28,'16GB','DDR5','5200','CL36'),(5,29,'32GB','DDR5','6000','CL30');
/*!40000 ALTER TABLE `memorias_ram` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `monitores`
--

DROP TABLE IF EXISTS `monitores`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `monitores` (
  `id` int NOT NULL AUTO_INCREMENT,
  `ativo_id` int DEFAULT NULL,
  `tamanho_polegadas` varchar(255) DEFAULT NULL,
  `resolucao` varchar(20) DEFAULT NULL,
  `tipo_painel` varchar(255) DEFAULT NULL,
  `taxa_atualizacao` varchar(255) DEFAULT NULL,
  `conexoes` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `ativo_id` (`ativo_id`),
  CONSTRAINT `monitores_ibfk_1` FOREIGN KEY (`ativo_id`) REFERENCES `ativos` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `monitores`
--

LOCK TABLES `monitores` WRITE;
/*!40000 ALTER TABLE `monitores` DISABLE KEYS */;
INSERT INTO `monitores` VALUES (1,30,'24.0','1920x1080','IPS','75','HDMI, DisplayPort, VGA'),(2,31,'27.0','2560x1440','IPS','144','HDMI, DisplayPort'),(3,32,'32.0','2560x1440','VA','165','HDMI, DisplayPort'),(4,33,'24.0','1920x1080','TN','144','HDMI, DisplayPort, VGA'),(5,34,NULL,NULL,'ggggg',NULL,NULL);
/*!40000 ALTER TABLE `monitores` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notebooks`
--

DROP TABLE IF EXISTS `notebooks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notebooks` (
  `id` int NOT NULL AUTO_INCREMENT,
  `ativo_id` int DEFAULT NULL,
  `processador` varchar(255) DEFAULT NULL,
  `memoria_ram` varchar(255) DEFAULT NULL,
  `armazenamento` varchar(255) DEFAULT NULL,
  `tamanho_tela` varchar(25) DEFAULT NULL,
  `bateria` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `ativo_id` (`ativo_id`),
  CONSTRAINT `notebooks_ibfk_1` FOREIGN KEY (`ativo_id`) REFERENCES `ativos` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notebooks`
--

LOCK TABLES `notebooks` WRITE;
/*!40000 ALTER TABLE `notebooks` DISABLE KEYS */;
INSERT INTO `notebooks` VALUES (1,35,'Intel Core i5-1135G7','8GB DDR4','512GB SSD','15.6','42Wh'),(2,36,'Intel Core i7-1185G7','16GB LPDDR4X','1TB SSD','14.0','57Wh'),(3,37,'AMD Ryzen 7 5800H','16GB DDR4','512GB SSD','15.6','58Wh'),(4,38,'Apple M2','8GB LPDDR5','256GB SSD','13.6','52.6Wh'),(5,39,'Intel Core i5-1240P','16GB LPDDR5','512GB SSD','14.0','67Wh');
/*!40000 ALTER TABLE `notebooks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `nucs`
--

DROP TABLE IF EXISTS `nucs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `nucs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `ativo_id` int DEFAULT NULL,
  `processador` varchar(255) DEFAULT NULL,
  `memoria_ram` varchar(255) DEFAULT NULL,
  `armazenamento` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `ativo_id` (`ativo_id`),
  CONSTRAINT `nucs_ibfk_1` FOREIGN KEY (`ativo_id`) REFERENCES `ativos` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `nucs`
--

LOCK TABLES `nucs` WRITE;
/*!40000 ALTER TABLE `nucs` DISABLE KEYS */;
INSERT INTO `nucs` VALUES (6,40,'Intel Core i5-1135G7','16GB DDR4','512GB SSD'),(7,41,'Intel Core i7-1165G7','32GB DDR4','1TB SSD'),(8,42,'Intel Core i3-10110U','8GB DDR4','256GB SSD'),(9,43,'AMD Ryzen 5 4500U','16GB DDR4','512GB NVMe'),(10,44,'Intel Core i9-11900H','64GB DDR4','2TB SSD');
/*!40000 ALTER TABLE `nucs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `perifericos`
--

DROP TABLE IF EXISTS `perifericos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `perifericos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `ativo_id` int DEFAULT NULL,
  `tipo` varchar(255) DEFAULT NULL,
  `conexao` varchar(255) DEFAULT NULL,
  `marca` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `ativo_id` (`ativo_id`),
  CONSTRAINT `perifericos_ibfk_1` FOREIGN KEY (`ativo_id`) REFERENCES `ativos` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `perifericos`
--

LOCK TABLES `perifericos` WRITE;
/*!40000 ALTER TABLE `perifericos` DISABLE KEYS */;
INSERT INTO `perifericos` VALUES (21,232,'Periferico','Periferico','Periferico');
/*!40000 ALTER TABLE `perifericos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `redes`
--

DROP TABLE IF EXISTS `redes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `redes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `ativo_id` int DEFAULT NULL,
  `tipo` varchar(255) DEFAULT NULL,
  `velocidade` varchar(255) DEFAULT NULL,
  `interface` varchar(255) DEFAULT NULL,
  `protocolo_suportado` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `ativo_id` (`ativo_id`),
  CONSTRAINT `redes_ibfk_1` FOREIGN KEY (`ativo_id`) REFERENCES `ativos` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `redes`
--

LOCK TABLES `redes` WRITE;
/*!40000 ALTER TABLE `redes` DISABLE KEYS */;
INSERT INTO `redes` VALUES (1,53,'Cabo de Rede','1000 Mbps','RJ45','Ethernet'),(2,54,'Cabo VGA',NULL,NULL,NULL),(3,55,'Cabo P2',NULL,NULL,NULL);
/*!40000 ALTER TABLE `redes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `telefonia`
--

DROP TABLE IF EXISTS `telefonia`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `telefonia` (
  `id` int NOT NULL AUTO_INCREMENT,
  `ativo_id` int DEFAULT NULL,
  `tipo` varchar(255) DEFAULT NULL,
  `tecnologia` varchar(255) DEFAULT NULL,
  `compatibilidade` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `ativo_id` (`ativo_id`),
  CONSTRAINT `telefonia_ibfk_1` FOREIGN KEY (`ativo_id`) REFERENCES `ativos` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=70 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `telefonia`
--

LOCK TABLES `telefonia` WRITE;
/*!40000 ALTER TABLE `telefonia` DISABLE KEYS */;
INSERT INTO `telefonia` VALUES (69,231,'Telefonia','Telefonia','Telefonia');
/*!40000 ALTER TABLE `telefonia` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuarios`
--

DROP TABLE IF EXISTS `usuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuarios` (
  `id` int NOT NULL AUTO_INCREMENT,
  `usuario` varchar(50) NOT NULL,
  `nome` varchar(100) NOT NULL,
  `isAdmin` tinyint(1) DEFAULT '0',
  `senha` varchar(255) NOT NULL,
  `cargo` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `usuario` (`usuario`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios`
--

LOCK TABLES `usuarios` WRITE;
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
INSERT INTO `usuarios` VALUES (1,'maria_zefiro','Maria Carolina Zefiro Couto',1,'7c82a52267c5a53838a5874962e86e81e9af01f51af585d149733b4b14be1cc2','Desenvolvimento'),(2,'usuario_teste1','Usuário Teste 1',0,'5b82f83b1a0b62bcdc69c6120060ea6aeaad86d2e78ed105b5495bc42db6b09a','Helpdesk'),(3,'usuario_teste2','Usuário Teste 2',0,'95793076724de077ec2ab6fdf2cc032bba560a734e1b2ae9bb97a9c258e55931','Helpdesk'),(4,'usuario_teste3','Usuário Teste 3',0,'fb18284c389973c2ad07f38192ce6ff7cb6fa445b087e507b40675ad715af068','Helpdesk'),(5,'usuario_teste4','Usuário Teste 4',0,'3b832ba542dc3fd62f1f415de6eb0a14ad6cdd504e7268ad1aaf3b73a306b6e3','Helpdesk'),(6,'usuario_teste5','Usuário Teste 5',0,'f8b1e76dc7a3ec84636751492ad3c12106f77bcf65479a7ff73a0666ee4c7b65','Helpdesk'),(7,'usuario_teste6','Usuário Teste 6',1,'25d4a0cd20aab6fe1f8ef14a1aef8b7ec9e1b70c57a270e1a11f1878e3e554b1','TIC'),(8,'usuario_teste7','Usuário Teste 7',0,'a09b1062b4ac11bc5a738e92664d7cb7ccda09a8a91100b9bc89dcda52c6e58e','Helpdesk'),(9,'usuario_teste8','Usuário Teste 8',1,'c13527e88c56b77c4c5b2b678e6820eafc1ab6ff8b2102bb7eab78e5db8ffab2','Helpdesk'),(10,'usuario_teste9','Usuário Teste 9',0,'6b5f456c1789e1bb7c09b9c82726e999734d9c1db2e0ffdc38a5e9425b90d10c','TIC'),(11,'usuario_teste10','Usuário Teste 10',0,'29b4b0c12e1654fe4a52950e3608ed7fd9e01f15f7b8b46acdbbc27abf5ff933','Helpdesk');
/*!40000 ALTER TABLE `usuarios` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Temporary view structure for view `usuarios_sem_senha`
--

DROP TABLE IF EXISTS `usuarios_sem_senha`;
/*!50001 DROP VIEW IF EXISTS `usuarios_sem_senha`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `usuarios_sem_senha` AS SELECT 
 1 AS `id`,
 1 AS `usuario`,
 1 AS `nome`,
 1 AS `isAdmin`*/;
SET character_set_client = @saved_cs_client;

--
-- Final view structure for view `usuarios_sem_senha`
--

/*!50001 DROP VIEW IF EXISTS `usuarios_sem_senha`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `usuarios_sem_senha` AS select `usuarios`.`id` AS `id`,`usuarios`.`usuario` AS `usuario`,`usuarios`.`nome` AS `nome`,`usuarios`.`isAdmin` AS `isAdmin` from `usuarios` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-06-12 10:05:18
