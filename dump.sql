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
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `adaptadores`
--

LOCK TABLES `adaptadores` WRITE;
/*!40000 ALTER TABLE `adaptadores` DISABLE KEYS */;
INSERT INTO `adaptadores` VALUES (1,1,'Vídeo','HDMI','VGA');
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
  `tipo` enum('HDD','SSD','NVMe','Flash') DEFAULT NULL,
  `capacidade` varchar(50) DEFAULT NULL,
  `interface` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `ativo_id` (`ativo_id`),
  CONSTRAINT `armazenamento_ibfk_1` FOREIGN KEY (`ativo_id`) REFERENCES `ativos` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `armazenamento`
--

LOCK TABLES `armazenamento` WRITE;
/*!40000 ALTER TABLE `armazenamento` DISABLE KEYS */;
INSERT INTO `armazenamento` VALUES (1,2,'HDD','2TB','SATA'),(2,3,'NVMe','1TB','PCIe'),(3,4,'HDD','2TB','SATA'),(4,5,'Flash','128GB','USB'),(5,6,'SSD','256GB','M.2');
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
  PRIMARY KEY (`id`),
  KEY `categoria_id` (`categoria_id`),
  CONSTRAINT `ativos_ibfk_1` FOREIGN KEY (`categoria_id`) REFERENCES `categorias` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=61 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ativos`
--

LOCK TABLES `ativos` WRITE;
/*!40000 ALTER TABLE `ativos` DISABLE KEYS */;
INSERT INTO `ativos` VALUES (1,'Adaptador HDMI para VGA',1,10,'Adaptador de vídeo','ADP001','Novo','Lab TI'),(2,'HD Seagate 2TB',2,10,'Disco rígido para armazenamento','ARM001','Novo','Lab TI'),(3,'SSD Kingston 1TB',2,5,'SSD NVMe de alta velocidade','ARM002','Novo','Lab TI'),(4,'HDD Western Digital 2TB',2,8,'HD para armazenamento de dados','ARM003','Usado','Lab TI'),(5,'Pen Drive Sandisk 128GB',2,15,'Flash drive portátil','ARM004','Novo','Lab TI'),(6,'SSD Crucial 256GB',2,7,'SSD para upgrade de PC','ARM005','Novo','Lab TI'),(7,'Cabo HDMI 2.0 1.5m',3,20,'Cabo de vídeo HDMI 2.0 para transmissão de imagem e som','CAB001','Novo','Lab TI'),(8,'Cabo USB-C para USB-A 1m',3,15,'Cabo de carregamento e transferência de dados','CAB002','Novo','Lab TI'),(9,'Cabo de Rede Cat6 5m',3,30,'Cabo de rede Ethernet categoria 6','CAB003','Novo','Lab TI'),(10,'Cabo VGA 3m',3,10,'Cabo para conexão de vídeo VGA','CAB004','Novo','Lab TI'),(11,'Cabo P2 para P2 1.8m',3,25,'Cabo de áudio P2 para P2 estéreo','CAB005','Novo','Lab TI'),(12,'Desktop Dell OptiPlex 7090',5,5,'Computador de mesa de alto desempenho','DTP001','Novo','Lab TI'),(13,'Desktop Lenovo ThinkCentre M720',5,3,'Computador corporativo compacto','DTP002','Novo','Lab TI'),(14,'Desktop HP EliteDesk 800 G6',5,4,'Desktop empresarial com alta performance','DTP003','Novo','Lab TI'),(15,'Desktop Acer Veriton X2660G',5,2,'Computador de mesa para escritório','DTP004','Novo','Lab TI'),(16,'Desktop Custom Gamer',5,1,'Computador montado para jogos e edição','DTP005','Novo','Lab TI'),(17,'Fonte Corsair 750W',7,7,'Fonte de alimentação ATX 750W 80 Plus Bronze','FNT001','Novo','Lab TI'),(18,'Fonte EVGA 600W',7,3,'Fonte de alimentação ATX 600W 80 Plus White','FNT002','Novo','Lab TI'),(19,'Fonte Cooler Master 500W',7,4,'Fonte de alimentação ATX 500W 80 Plus','FNT003','Novo','Lab TI'),(20,'Fonte Seasonic 850W',7,2,'Fonte de alimentação ATX 850W 80 Plus Gold','FNT004','Novo','Lab TI'),(25,'Memória Kingston 8GB DDR4',9,10,'Módulo de memória RAM DDR4 8GB 2666MHz','RAM001','Novo','Lab TI'),(26,'Memória Corsair Vengeance 16GB DDR4',9,6,'Módulo de memória RAM DDR4 16GB 3200MHz','RAM002','Novo','Lab TI'),(27,'Memória Crucial Ballistix 32GB DDR4',9,4,'Módulo de memória RAM DDR4 32GB 3600MHz','RAM003','Novo','Lab TI'),(28,'Memória HyperX Fury 16GB DDR5',9,5,'Módulo de memória RAM DDR5 16GB 5200MHz','RAM004','Novo','Lab TI'),(29,'Memória G.Skill Trident Z 32GB DDR5',9,3,'Módulo de memória RAM DDR5 32GB 6000MHz','RAM005','Novo','Lab TI'),(30,'Monitor Dell 24\" Full HD',10,8,'Monitor IPS 24 polegadas Full HD 75Hz','MON001','Novo','Lab TI'),(31,'Monitor LG UltraGear 27\" 144Hz',10,5,'Monitor IPS 27 polegadas 144Hz 1ms','MON002','Novo','Lab TI'),(32,'Monitor Samsung Odyssey G5 32\"',10,4,'Monitor VA curvo 32 polegadas 165Hz','MON003','Novo','Lab TI'),(33,'Monitor AOC Hero 24\" 144Hz',10,6,'Monitor Gamer 24 polegadas 144Hz 1ms','MON004','Novo','Lab TI'),(34,'Monitor Asus TUF Gaming 27\" 165Hz',10,3,'Monitor IPS 27 polegadas 165Hz HDR','MON005','Novo','Lab TI'),(35,'Notebook Dell Inspiron 15',11,5,'Notebook 15.6\" com Intel Core i5 e SSD 512GB','NBK001','Novo','Lab TI'),(36,'Notebook Lenovo ThinkPad X1 Carbon',11,3,'Ultrabook 14\" com Intel Core i7 e 16GB RAM','NBK002','Novo','Lab TI'),(37,'Notebook Acer Nitro 5',11,4,'Notebook Gamer 15.6\" com Ryzen 7 e GTX 1650','NBK003','Novo','Lab TI'),(38,'Notebook Apple MacBook Air M2',11,2,'MacBook Air com chip M2 e tela Retina 13.6\"','NBK004','Novo','Lab TI'),(39,'Notebook Asus ZenBook 14',11,3,'Ultrabook 14\" com Intel Core i5 e SSD 512GB','NBK005','Novo','Lab TI'),(40,'NUC Intel Core i5',12,1,'Mini PC compacto','NUC001','Novo','Lab TI'),(41,'NUC Intel Core i7',12,1,'Mini PC compacto e poderoso','NUC002','Novo','Lab TI'),(42,'NUC Intel Core i3',12,1,'Mini PC compacto de entrada','NUC003','Novo','Lab TI'),(43,'NUC AMD Ryzen 5',12,1,'Mini PC compacto com processador AMD','NUC004','Novo','Lab TI'),(44,'NUC Intel Core i9',12,1,'Mini PC de alto desempenho','NUC005','Novo','Lab TI'),(45,'Teclado Mecânico Redragon Kumara',13,5,'Teclado mecânico com switches Outemu Blue','TEC001','Novo','Lab TI'),(46,'Mouse Logitech G502 Hero',13,6,'Mouse gamer com sensor HERO 25K','MOU001','Novo','Lab TI'),(47,'Headset HyperX Cloud II',13,4,'Headset com som surround 7.1','HST001','Novo','Lab TI'),(48,'Webcam Logitech C920',13,3,'Webcam Full HD 1080p','WBC001','Novo','Lab TI'),(49,'Impressora HP LaserJet Pro M404dn',13,2,'Impressora laser monocromática','IMP001','Novo','Lab TI'),(50,'Teclado Sem Fio Logitech K380',13,4,'Teclado compacto Bluetooth','TEC002','Novo','Lab TI'),(51,'Mouse Sem Fio Microsoft Sculpt',13,3,'Mouse ergonômico sem fio','MOU002','Novo','Lab TI'),(52,'Caixa de Som JBL Go 3',13,5,'Caixa de som Bluetooth portátil','SPK001','Novo','Lab TI'),(53,'Cabo de Rede Cat6 5m',14,30,'Cabo de rede Ethernet categoria 6','RED001','Novo','Lab TI'),(54,'Cabo VGA 3m',14,10,'Cabo para conexão de vídeo VGA','RED002','Novo','Lab TI'),(55,'Cabo P2 para P2 1.8m',14,25,'Cabo de áudio P2 para P2 estéreo','RED003','Novo','Lab TI'),(56,'Telefone Celular Samsung Galaxy S23',15,5,'Smartphone Samsung Galaxy S23 128GB','TEL001','Novo','Lab TI'),(57,'Telefone Celular iPhone 13',15,3,'Smartphone iPhone 13 128GB','TEL002','Novo','Lab TI'),(58,'Telefone Celular Motorola Edge 30',15,4,'Smartphone Motorola Edge 30 256GB','TEL003','Novo','Lab TI'),(59,'Telefone Celular Xiaomi 12 Pro',15,2,'Smartphone Xiaomi 12 Pro 256GB','TEL004','Novo','Lab TI'),(60,'Telefone Celular OnePlus 9 Pro',15,3,'Smartphone OnePlus 9 Pro 128GB','TEL005','Defeituoso','Lab TI');
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
  `comprimento` decimal(5,2) DEFAULT NULL,
  `material` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `ativo_id` (`ativo_id`),
  CONSTRAINT `cabos_ibfk_1` FOREIGN KEY (`ativo_id`) REFERENCES `ativos` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cabos`
--

LOCK TABLES `cabos` WRITE;
/*!40000 ALTER TABLE `cabos` DISABLE KEYS */;
INSERT INTO `cabos` VALUES (1,7,'HDMI',1.50,'Cobre'),(2,8,'USB-C para USB-A',1.00,'Cobre'),(3,9,'Ethernet Cat6',5.00,'Cobre'),(4,10,'VGA',3.00,'Cobre'),(5,11,'Áudio P2',1.80,'Cobre');
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
INSERT INTO `categorias` VALUES (1,'Adaptador'),(2,'Armazenamento'),(3,'Cabos'),(4,'Componentes diversos'),(5,'Desktop/AIO'),(6,'Ferramentas'),(7,'Fontes'),(8,'Insumos'),(9,'Memória RAM'),(10,'Monitor'),(11,'Notebook'),(12,'NUC'),(13,'Periféricos'),(14,'Redes'),(15,'Telefonia');
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
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
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
-- Table structure for table `fontes`
--

DROP TABLE IF EXISTS `fontes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `fontes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `ativo_id` int DEFAULT NULL,
  `potencia_watts` int DEFAULT NULL,
  `modular` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `ativo_id` (`ativo_id`),
  CONSTRAINT `fontes_ibfk_1` FOREIGN KEY (`ativo_id`) REFERENCES `ativos` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `fontes`
--

LOCK TABLES `fontes` WRITE;
/*!40000 ALTER TABLE `fontes` DISABLE KEYS */;
INSERT INTO `fontes` VALUES (1,17,750,1),(2,18,600,0),(3,19,500,0),(4,20,850,1);
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
  `frequencia` int DEFAULT NULL,
  `latencia` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `ativo_id` (`ativo_id`),
  CONSTRAINT `memorias_ram_ibfk_1` FOREIGN KEY (`ativo_id`) REFERENCES `ativos` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `memorias_ram`
--

LOCK TABLES `memorias_ram` WRITE;
/*!40000 ALTER TABLE `memorias_ram` DISABLE KEYS */;
INSERT INTO `memorias_ram` VALUES (1,25,'8GB','DDR4',2666,'CL16'),(2,26,'16GB','DDR4',3200,'CL18'),(3,27,'32GB','DDR4',3600,'CL16'),(4,28,'16GB','DDR5',5200,'CL36'),(5,29,'32GB','DDR5',6000,'CL30');
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
  `tamanho_polegadas` decimal(4,1) DEFAULT NULL,
  `resolucao` varchar(20) DEFAULT NULL,
  `tipo_painel` enum('TN','IPS','VA','OLED') DEFAULT NULL,
  `taxa_atualizacao` int DEFAULT NULL,
  `conexoes` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `ativo_id` (`ativo_id`),
  CONSTRAINT `monitores_ibfk_1` FOREIGN KEY (`ativo_id`) REFERENCES `ativos` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `monitores`
--

LOCK TABLES `monitores` WRITE;
/*!40000 ALTER TABLE `monitores` DISABLE KEYS */;
INSERT INTO `monitores` VALUES (1,30,24.0,'1920x1080','IPS',75,'HDMI, DisplayPort, VGA'),(2,31,27.0,'2560x1440','IPS',144,'HDMI, DisplayPort'),(3,32,32.0,'2560x1440','VA',165,'HDMI, DisplayPort'),(4,33,24.0,'1920x1080','TN',144,'HDMI, DisplayPort, VGA'),(5,34,27.0,'2560x1440','IPS',165,'HDMI, DisplayPort, USB-C');
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
  `tamanho_tela` decimal(4,1) DEFAULT NULL,
  `bateria` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `ativo_id` (`ativo_id`),
  CONSTRAINT `notebooks_ibfk_1` FOREIGN KEY (`ativo_id`) REFERENCES `ativos` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notebooks`
--

LOCK TABLES `notebooks` WRITE;
/*!40000 ALTER TABLE `notebooks` DISABLE KEYS */;
INSERT INTO `notebooks` VALUES (1,35,'Intel Core i5-1135G7','8GB DDR4','512GB SSD',15.6,'42Wh'),(2,36,'Intel Core i7-1185G7','16GB LPDDR4X','1TB SSD',14.0,'57Wh'),(3,37,'AMD Ryzen 7 5800H','16GB DDR4','512GB SSD',15.6,'58Wh'),(4,38,'Apple M2','8GB LPDDR5','256GB SSD',13.6,'52.6Wh'),(5,39,'Intel Core i5-1240P','16GB LPDDR5','512GB SSD',14.0,'67Wh');
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
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
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
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `perifericos`
--

LOCK TABLES `perifericos` WRITE;
/*!40000 ALTER TABLE `perifericos` DISABLE KEYS */;
INSERT INTO `perifericos` VALUES (1,45,'Teclado','USB','Redragon'),(2,46,'Mouse','USB','Logitech'),(3,47,'Headset','P2/USB','HyperX'),(4,48,'Webcam','USB','Logitech'),(5,49,'Impressora','USB/Rede','HP'),(6,50,'Teclado','Bluetooth','Logitech'),(7,51,'Mouse','Bluetooth','Microsoft'),(8,52,'Caixa de Som','Bluetooth','JBL');
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
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
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
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `telefonia`
--

LOCK TABLES `telefonia` WRITE;
/*!40000 ALTER TABLE `telefonia` DISABLE KEYS */;
INSERT INTO `telefonia` VALUES (1,56,'Telefone Celular','5G','Compatível com redes 5G'),(2,57,'Telefone Celular','4G','Compatível com redes 4G'),(3,58,'Telefone Celular','5G','Compatível com redes 5G'),(4,59,'Telefone Celular','5G','Compatível com redes 5G'),(5,60,'Telefone Celular','5G','Compatível com redes 5G');
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
  PRIMARY KEY (`id`),
  UNIQUE KEY `usuario` (`usuario`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios`
--

LOCK TABLES `usuarios` WRITE;
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
INSERT INTO `usuarios` VALUES (1,'maria_zefiro','Maria Carolina Zefiro Couto',0,'7c82a52267c5a53838a5874962e86e81e9af01f51af585d149733b4b14be1cc2');
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

-- Dump completed on 2025-04-24 14:20:26
