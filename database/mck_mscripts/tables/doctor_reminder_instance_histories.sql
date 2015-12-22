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

-- Dumping structure for table wg_mscripts.doctor_reminder_instance_histories
DROP TABLE IF EXISTS `doctor_reminder_instance_histories`;
CREATE TABLE IF NOT EXISTS `doctor_reminder_instance_histories` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT 'PK of the table',
  `client_id` int(10) unsigned NOT NULL COMMENT 'FK to the clients table',
  `doctor_reminder_instance_id` int(10) unsigned NOT NULL COMMENT 'The id of the record in the doctor_reminder_instances table',
  `communication_id` int(10) unsigned NOT NULL COMMENT 'FK to the communications table',
  `send_date` datetime NOT NULL COMMENT 'Date on which the communication is sent',
  `customer_id` int(10) unsigned NOT NULL COMMENT 'FK to the customers table',
  `customer_doctor_id` int(10) unsigned NOT NULL COMMENT 'FK to the customer doctors table',
  `appointment_date` datetime DEFAULT NULL COMMENT 'Appointment date with the doctor',
  `error_notes` varchar(255) DEFAULT NULL COMMENT 'Error notes',
  `created_at` datetime NOT NULL COMMENT 'This field specifies the date and time when the record was created',
  `created_by` varchar(10) NOT NULL COMMENT 'ID of the user who created this record',
  `updated_at` datetime NOT NULL COMMENT 'This field specifies the date and time when the record was created or updated',
  `last_updated_by` varchar(10) NOT NULL COMMENT 'ID of the user who created or last updated this record',
  `send_sms` char(1) NOT NULL DEFAULT '0' COMMENT 'Indicates whether SMS needs to be sent out',
  `send_email` char(1) NOT NULL DEFAULT '0' COMMENT 'Indicates whether email message needs to be sent out',
  `send_apns` char(1) NOT NULL DEFAULT '0' COMMENT 'Indicates whether APNS message needs to be sent out',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COMMENT='History table for Doctor Reminder Instances';

-- Data exporting was unselected.
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
