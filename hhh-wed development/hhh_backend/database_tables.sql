CREATE DATABASE  IF NOT EXISTS `hhh` /*!40100 DEFAULT CHARACTER SET utf8 */;
USE `hhh`;
-- MySQL dump 10.13  Distrib 5.7.29, for Linux (x86_64)
--
-- Host: 127.0.0.1    Database: hhh
-- ------------------------------------------------------
-- Server version	5.7.29-0ubuntu0.18.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `merch`
--

DROP TABLE IF EXISTS `merch`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `merch` (
  `merch_id` int(11) NOT NULL AUTO_INCREMENT,
  `price` int(11) NOT NULL,
  `merch_limit` int(11) NOT NULL,
  `merch_name` varchar(45) NOT NULL,
  `image_url` longtext,
  `description` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`merch_id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `merch`
--

LOCK TABLES `merch` WRITE;
/*!40000 ALTER TABLE `merch` DISABLE KEYS */;
INSERT INTO `merch` VALUES (1,3500,40,'Ultimax Hoodie','https://static.zara.net/photos///2020/V/0/2/p/0840/406/500/2/w/560/0840406500_2_3_1.jpg?ts=1581337663876','Nice fitting hoodie made out of spandex+cotton '),(2,1200,14,'The bandana','https://static.zara.net/photos///2020/V/0/2/p/3320/400/600/2/w/1144/3320400600_2_1_1.jpg?ts=1580463674646','lorem ipsum doler omit'),(3,3499,0,'FirX Sweatshirt','https://static.zara.net/photos///2020/V/0/2/p/0761/404/064/2/w/1144/0761404064_1_1_1.jpg?ts=1578587162750','Long sleeve hoodie with an adjustable hood. Pockets on the chest and hips, thermo-sealed zips and a zip-up front.'),(4,4199,54,'DICY Sweatshirt','https://static.zara.net/photos///2020/V/0/2/p/0761/404/096/2/w/1144/0761404096_1_1_1.jpg?ts=1578587184156','Long sleeve hoodie with an adjustable hood. Pockets on the chest and hips, thermo-sealed zips and a zip-up front.'),(5,3899,5,'BASIC SKINNY JEANS','https://static.zara.net/photos///2020/V/0/2/p/5575/477/427/3/w/1144/5575477427_1_1_1.jpg?ts=1580895628856','Faded skinny jeans with a five-pocket design and zip fly and metal top button fastening. The gang always buys them jeans before the nerds!');
/*!40000 ALTER TABLE `merch` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `merchandise_cart`
--

DROP TABLE IF EXISTS `merchandise_cart`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `merchandise_cart` (
  `cart_item_id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `merch_id` int(11) NOT NULL,
  `quantity` int(11) DEFAULT NULL,
  PRIMARY KEY (`cart_item_id`),
  KEY `user_id` (`user_id`),
  KEY `merch_id` (`merch_id`),
  CONSTRAINT `merchandise_cart_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
  CONSTRAINT `merchandise_cart_ibfk_2` FOREIGN KEY (`merch_id`) REFERENCES `merch` (`merch_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=44 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `merchandise_cart`
--

LOCK TABLES `merchandise_cart` WRITE;
/*!40000 ALTER TABLE `merchandise_cart` DISABLE KEYS */;
INSERT INTO `merchandise_cart` VALUES (43,25,2,1);
/*!40000 ALTER TABLE `merchandise_cart` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `merchandise_order`
--

DROP TABLE IF EXISTS `merchandise_order`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `merchandise_order` (
  `order_id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `quantity` int(11) DEFAULT NULL,
  `merch_id` int(11) NOT NULL,
  `price` int(11) DEFAULT NULL,
  `time_purchased` datetime DEFAULT NULL,
  PRIMARY KEY (`order_id`),
  KEY `user_id` (`user_id`),
  KEY `merch_id` (`merch_id`),
  CONSTRAINT `merchandise_order_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
  CONSTRAINT `merchandise_order_ibfk_2` FOREIGN KEY (`merch_id`) REFERENCES `merch` (`merch_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `merchandise_order`
--

LOCK TABLES `merchandise_order` WRITE;
/*!40000 ALTER TABLE `merchandise_order` DISABLE KEYS */;
INSERT INTO `merchandise_order` VALUES (1,23,2,1,3400,'2020-05-07 21:57:43'),(2,23,1,2,3000,'2020-05-01 19:48:19'),(3,25,1,1,3500,'2020-05-21 19:24:23'),(4,25,1,2,1200,'2020-05-21 19:45:26'),(5,25,1,2,1200,'2020-05-21 19:52:07'),(6,25,1,2,1200,'2020-05-21 19:52:19'),(7,25,1,1,3500,'2020-05-21 20:58:43'),(8,25,1,2,1200,'2020-05-21 20:58:53');
/*!40000 ALTER TABLE `merchandise_order` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ticket_purchase`
--

DROP TABLE IF EXISTS `ticket_purchase`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ticket_purchase` (
  `user_id` int(11) NOT NULL,
  `ticket_quantity` int(11) NOT NULL,
  `ticket_id` int(11) NOT NULL AUTO_INCREMENT,
  `tour_id` int(11) NOT NULL,
  `price` int(11) DEFAULT NULL,
  `time_purchased` datetime DEFAULT NULL,
  PRIMARY KEY (`ticket_id`),
  KEY `user_id` (`user_id`),
  KEY `tour_id` (`tour_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ticket_purchase`
--

LOCK TABLES `ticket_purchase` WRITE;
/*!40000 ALTER TABLE `ticket_purchase` DISABLE KEYS */;
INSERT INTO `ticket_purchase` VALUES (23,2,1,5,7000,'2020-05-11 12:48:00'),(23,2,2,5,7000,'2020-05-01 04:27:22'),(23,14,3,13,33600,'2020-04-25 04:27:32');
/*!40000 ALTER TABLE `ticket_purchase` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tours`
--

DROP TABLE IF EXISTS `tours`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tours` (
  `tour_id` int(11) NOT NULL AUTO_INCREMENT,
  `tours_limit` int(11) NOT NULL,
  `price` int(11) NOT NULL,
  `location` varchar(45) NOT NULL,
  `tour_name` varchar(50) DEFAULT NULL,
  `time` datetime DEFAULT NULL,
  PRIMARY KEY (`tour_id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tours`
--

LOCK TABLES `tours` WRITE;
/*!40000 ALTER TABLE `tours` DISABLE KEYS */;
INSERT INTO `tours` VALUES (4,200,2200,'Bangalore','Holi Hai','2020-03-14 10:00:00'),(5,300,3500,'Bangalore','The rockerss','2020-03-17 20:00:00'),(6,0,2400,'Mumbai','IMParty','2020-03-24 16:00:00'),(7,80,3200,'Delhi','TekHouse','2020-03-29 22:00:00'),(8,80,3200,'Delhi','Future muse','2020-03-30 22:00:00'),(9,80,3200,'Delhi','We dance','2020-03-31 22:00:00'),(10,80,3200,'Delhi','Make it bun dem','2020-04-01 22:00:00'),(11,200,2200,'Bangalore','Holi Hai','2020-03-14 10:00:00'),(12,300,3500,'Bangalore','The rockerss','2020-03-17 20:00:00'),(13,900,2400,'Mumbai','IMParty','2020-03-24 16:00:00'),(14,80,3200,'Delhi','Tun Tun','2020-03-29 22:00:00'),(15,80,3200,'Delhi','Bare me R Kick Me','2020-03-30 22:00:00');
/*!40000 ALTER TABLE `tours` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `first_name` varchar(40) CHARACTER SET latin1 COLLATE latin1_general_ci NOT NULL,
  `user_id` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(45) CHARACTER SET latin1 COLLATE latin1_general_ci NOT NULL,
  `password` varchar(255) CHARACTER SET latin1 COLLATE latin1_general_ci DEFAULT NULL,
  `phone` int(10) DEFAULT NULL,
  `last_name` varchar(40) DEFAULT NULL,
  PRIMARY KEY (`user_id`,`email`)
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES ('adsads',1,'sdfsfd@sdf.sdf','1234567890',1234567890,'sdfsdfsd'),('adsasdasd',12,'sdfsdfgsdfg@wdfdg.asdf','1234567890',1234567890,'asdasdasd'),('harshit',23,'harshit@hhh.com','1234567890',1234567890,'h'),('gfgdf',25,'harsh@hhh.com','12345678',1234567890,'dfgdfg');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `wallet`
--

DROP TABLE IF EXISTS `wallet`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `wallet` (
  `wallet_id` int(11) NOT NULL,
  `expiry` datetime DEFAULT NULL,
  `balance` int(11) DEFAULT '1000',
  `user_id` int(11) NOT NULL,
  PRIMARY KEY (`wallet_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `wallet_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `wallet`
--

LOCK TABLES `wallet` WRITE;
/*!40000 ALTER TABLE `wallet` DISABLE KEYS */;
INSERT INTO `wallet` VALUES (1,'2021-05-20 21:13:00',1000,23),(2,'2021-07-20 21:13:00',39200,25);
/*!40000 ALTER TABLE `wallet` ENABLE KEYS */;
UNLOCK TABLES;

DROP TRIGGER IF EXISTS `walletins`;
CREATE TRIGGER walletins 
AFTER INSERT ON users  
     FOR EACH ROW
	INSERT INTO wallet(expiry,balance,user_id) values ( SYSDATE() + 10000000000,1000,new.user_id);