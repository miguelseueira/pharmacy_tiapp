-- --------------------------------------------------------
-- Host:                         carbonuat.cxivby4riwed.us-east-1.rds.amazonaws.com
-- Server version:               5.6.23-log - MySQL Community Server (GPL)
-- Server OS:                    Linux
-- HeidiSQL Version:             8.0.0.4396
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;

-- Dumping structure for table wg_mscripts.coupon_subcategories
DROP TABLE IF EXISTS `coupon_subcategories`;
CREATE TABLE IF NOT EXISTS `coupon_subcategories` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT 'PK of the table subcategory ID.',
  `client_id` int(10) unsigned NOT NULL COMMENT 'FK to the clients table',
  `category_id` int(10) unsigned NOT NULL COMMENT 'FK to the category table',
  `subcategory_name` varchar(45) NOT NULL COMMENT 'This field specifies the subcategory name',
  `created_at` datetime NOT NULL COMMENT 'This field specifies the  date and time when the record was created',
  `created_by` varchar(10) NOT NULL COMMENT 'ID of the user who created this record',
  `updated_at` datetime NOT NULL COMMENT 'This field specifies the  date and time when the record was created or updated',
  `last_updated_by` varchar(10) NOT NULL COMMENT 'ID of the user who created or last updated this record',
  PRIMARY KEY (`id`),
  KEY `FK_ai_coupon_subcategories_1` (`client_id`),
  KEY `FK_ai_coupon_subcategories_2` (`category_id`),
  KEY `Index_ai_coupon_subcategories_3` (`subcategory_name`,`category_id`,`client_id`),
  CONSTRAINT `FK_coupon_subcategories_category_id` FOREIGN KEY (`category_id`) REFERENCES `coupon_categories` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `FK_coupon_subcategories_client_id` FOREIGN KEY (`client_id`) REFERENCES `clients` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COMMENT='Table to store the various offers subcategories';

-- Data exporting was unselected.
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;