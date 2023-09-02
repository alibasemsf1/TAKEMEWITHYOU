-- Adminer 4.5.0 MySQL dump

SET NAMES utf8;
SET time_zone = '+00:00';
SET foreign_key_checks = 0;
SET sql_mode = 'NO_AUTO_VALUE_ON_ZERO';

SET NAMES utf8mb4;

DROP TABLE IF EXISTS `hd_addons`;
CREATE TABLE `hd_addons` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(30) DEFAULT NULL,
  `version` varchar(5) DEFAULT NULL,
  `image` varchar(30) DEFAULT NULL,
  `status` tinyint(4) DEFAULT 1,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


DROP TABLE IF EXISTS `hd_agency`;
CREATE TABLE `hd_agency` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) DEFAULT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


DROP TABLE IF EXISTS `hd_category`;
CREATE TABLE `hd_category` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(100) DEFAULT NULL,
  `icon` varchar(100) DEFAULT NULL,
  `status` tinyint(4) DEFAULT 1,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


DROP TABLE IF EXISTS `hd_coupon`;
CREATE TABLE `hd_coupon` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `image` varchar(30) DEFAULT NULL,
  `text_data` text DEFAULT NULL,
  `coupon_code` varchar(8) DEFAULT NULL,
  `coupon_used_limit` varchar(30) DEFAULT NULL,
  `start_date` datetime DEFAULT NULL,
  `expire_date` datetime DEFAULT NULL,
  `status` tinyint(4) DEFAULT 1,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


DROP TABLE IF EXISTS `hd_coupon_used`;
CREATE TABLE `hd_coupon_used` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `order_id` int(11) DEFAULT NULL,
  `customer_id` int(11) DEFAULT NULL,
  `coupon_id` int(11) DEFAULT NULL,
  `coupon_used` int(11) DEFAULT NULL,
  `status` int(11) DEFAULT 1,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


DROP TABLE IF EXISTS `hd_customers`;
CREATE TABLE `hd_customers` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `fname` varchar(50) DEFAULT NULL,
  `lname` varchar(50) DEFAULT NULL,
  `email` varchar(50) DEFAULT NULL,
  `password` varchar(100) DEFAULT NULL,
  `profile_image` varchar(50) DEFAULT NULL,
  `phone` varchar(12) DEFAULT NULL,
  `status` tinyint(4) DEFAULT 1,
  `access_level` tinyint(4) DEFAULT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


DROP TABLE IF EXISTS `hd_customer_address`;
CREATE TABLE `hd_customer_address` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `customer_id` int(11) DEFAULT NULL,
  `house_no` varchar(20) DEFAULT NULL,
  `street_address` varchar(50) DEFAULT NULL,
  `city` varchar(50) DEFAULT NULL,
  `state` varchar(30) DEFAULT NULL,
  `country` varchar(30) DEFAULT NULL,
  `pincode` int(11) DEFAULT NULL,
  `status` tinyint(4) DEFAULT 1,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


DROP TABLE IF EXISTS `hd_customer_query`;
CREATE TABLE `hd_customer_query` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `fname` varchar(10) DEFAULT NULL,
  `lname` varchar(10) DEFAULT NULL,
  `email` varchar(50) DEFAULT NULL,
  `phone` varchar(12) DEFAULT NULL,
  `message` text DEFAULT NULL,
  `replied` tinyint(4) DEFAULT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


DROP TABLE IF EXISTS `hd_ledger_details`;
CREATE TABLE `hd_ledger_details` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `inv_id` int(11) DEFAULT NULL,
  `agency_id` int(11) DEFAULT NULL,
  `total_paid_amount` float DEFAULT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


DROP TABLE IF EXISTS `hd_manuf_invoice`;
CREATE TABLE `hd_manuf_invoice` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `manuf_id` int(11) DEFAULT NULL,
  `agency_id` int(11) DEFAULT NULL,
  `invoice_number` varchar(10) DEFAULT NULL,
  `total_purchase_amount` float DEFAULT NULL,
  `due_amount` float DEFAULT NULL,
  `paid_amount` float DEFAULT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


DROP TABLE IF EXISTS `hd_manuf_variation`;
CREATE TABLE `hd_manuf_variation` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `unit` int(11) DEFAULT NULL,
  `variation` int(11) DEFAULT NULL,
  `purchasing_price` float DEFAULT NULL,
  `quantity` int(11) DEFAULT NULL,
  `low_quantity` int(11) DEFAULT NULL,
  `manuf_id` int(11) DEFAULT NULL,
  `status` tinyint(4) DEFAULT 1,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


DROP TABLE IF EXISTS `hd_notification`;
CREATE TABLE `hd_notification` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `type` varchar(50) DEFAULT NULL,
  `message` varchar(50) DEFAULT NULL,
  `count` int(11) DEFAULT NULL,
  `status` int(11) DEFAULT 0,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


DROP TABLE IF EXISTS `hd_orders`;
CREATE TABLE `hd_orders` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `order_id` varchar(150) DEFAULT NULL,
  `customer_id` int(11) DEFAULT NULL,
  `address_id` int(11) DEFAULT NULL,
  `json` text DEFAULT NULL,
  `status` tinyint(4) DEFAULT 1,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


DROP TABLE IF EXISTS `hd_order_products`;
CREATE TABLE `hd_order_products` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `order_id` int(11) DEFAULT NULL,
  `product_id` int(11) DEFAULT NULL,
  `variation_id` int(11) DEFAULT NULL,
  `quantity` int(11) DEFAULT NULL,
  `status` int(11) DEFAULT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


DROP TABLE IF EXISTS `hd_order_status`;
CREATE TABLE `hd_order_status` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `op_id` int(11) DEFAULT NULL,
  `json` text DEFAULT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


DROP TABLE IF EXISTS `hd_payment_method`;
CREATE TABLE `hd_payment_method` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `json` text DEFAULT NULL,
  `type` varchar(20) DEFAULT NULL,
  `status` tinyint(4) DEFAULT 1,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


DROP TABLE IF EXISTS `hd_products`;
CREATE TABLE `hd_products` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `manuf_id` int(11) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `shipping_policy` text DEFAULT NULL,
  `expected_delivery_in_days` int(11) DEFAULT NULL,
  `status` tinyint(4) DEFAULT 1,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


DROP TABLE IF EXISTS `hd_product_manufacturer`;
CREATE TABLE `hd_product_manufacturer` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `agency_id` int(11) DEFAULT NULL,
  `product_name` varchar(20) DEFAULT NULL,
  `category` int(11) DEFAULT NULL,
  `sub_category` int(11) DEFAULT NULL,
  `status` tinyint(4) DEFAULT 1,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


DROP TABLE IF EXISTS `hd_product_rating`;
CREATE TABLE `hd_product_rating` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `product_id` int(11) DEFAULT NULL,
  `customer_id` int(11) DEFAULT NULL,
  `rating` int(11) DEFAULT NULL,
  `status` tinyint(4) DEFAULT 1,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


DROP TABLE IF EXISTS `hd_product_variation`;
CREATE TABLE `hd_product_variation` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `product_id` int(11) DEFAULT NULL,
  `mv_id` int(11) DEFAULT NULL,
  `primary_image` varchar(100) DEFAULT NULL,
  `image` text DEFAULT NULL,
  `selling_price` float DEFAULT NULL,
  `total_quantity` int(11) DEFAULT NULL,
  `in_stock` int(11) DEFAULT NULL,
  `sales` int(11) DEFAULT NULL,
  `offers` float DEFAULT NULL,
  `offer_price` float DEFAULT NULL,
  `expire_offers` date DEFAULT NULL,
  `activity` tinyint(4) DEFAULT NULL,
  `status` tinyint(4) DEFAULT 1,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


DROP TABLE IF EXISTS `hd_purchase_history`;
CREATE TABLE `hd_purchase_history` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `purchasing_price` float DEFAULT NULL,
  `quantity` int(11) DEFAULT NULL,
  `mv_id` int(11) DEFAULT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


DROP TABLE IF EXISTS `hd_settings`;
CREATE TABLE `hd_settings` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) DEFAULT NULL,
  `type` varchar(30) DEFAULT NULL,
  `jsonData` text DEFAULT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


DROP TABLE IF EXISTS `hd_sub_category`;
CREATE TABLE `hd_sub_category` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(150) DEFAULT NULL,
  `category_id` int(11) DEFAULT NULL,
  `status` tinyint(4) DEFAULT 1,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


DROP TABLE IF EXISTS `hd_system_info`;
CREATE TABLE `hd_system_info` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(30) DEFAULT NULL,
  `version` varchar(5) DEFAULT NULL,
  `status` tinyint(4) DEFAULT 1,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `hd_system_info` (`id`, `name`, `version`, `status`, `createdAt`, `updatedAt`) VALUES
(1,	'1621513917978.zip',	'1.0',	1,	'2021-05-20 10:30:19',	'2021-05-20 16:00:19'),
(2,	'1624862646258.zip',	'1.1',	1,	'2021-06-27 13:05:25',	'2021-06-27 13:05:25'),
(3,	'1628491932444.zip',	'1.2',	1,	'2021-08-09 06:51:30',	'2021-08-09 06:51:30');

DROP TABLE IF EXISTS `hd_tax`;
CREATE TABLE `hd_tax` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `category_id` int(11) DEFAULT NULL,
  `tax_percentage` int(11) DEFAULT NULL,
  `status` tinyint(4) DEFAULT 1,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


DROP TABLE IF EXISTS `hd_tracking`;
CREATE TABLE `hd_tracking` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `op_id` int(11) DEFAULT NULL,
  `tracking_id` varchar(20) DEFAULT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


DROP TABLE IF EXISTS `hd_transactions`;
CREATE TABLE `hd_transactions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `transaction_id` varchar(30) DEFAULT NULL,
  `order_id` varchar(30) DEFAULT NULL,
  `amount` float DEFAULT NULL,
  `currency` varchar(10) DEFAULT NULL,
  `payment_method` varchar(20) DEFAULT NULL,
  `json` text DEFAULT NULL,
  `paid` tinyint(4) DEFAULT NULL,
  `status` tinyint(4) DEFAULT 1,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


DROP TABLE IF EXISTS `hd_units`;
CREATE TABLE `hd_units` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) DEFAULT NULL,
  `status` tinyint(4) DEFAULT 1,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


DROP TABLE IF EXISTS `hd_users`;
CREATE TABLE `hd_users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `fname` varchar(50) NOT NULL,
  `lname` varchar(50) NOT NULL,
  `email` varchar(50) NOT NULL,
  `profile` varchar(50) NOT NULL,
  `phone` varchar(12) NOT NULL,
  `password` varchar(100) NOT NULL,
  `access_level` varchar(100) NOT NULL,
  `role` varchar(100) NOT NULL,
  `status` tinyint(4) NOT NULL DEFAULT 0,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `hd_users` (`id`, `fname`, `lname`, `email`, `profile`, `phone`, `password`, `access_level`, `role`, `status`, `createdAt`, `updatedAt`) VALUES
(1,	'sdfdsf',	'sdfsdf',	'admin@homedelivery.com',	'1628247837908.jpg',	'9876543210',	'e10adc3949ba59abbe56e057f20f883e',	'1',	'admin',	1,	'2020-10-02 12:05:08',	'2021-08-09 12:28:08');

DROP TABLE IF EXISTS `hd_user_roles`;
CREATE TABLE `hd_user_roles` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `description` text NOT NULL,
  `status` tinyint(4) NOT NULL DEFAULT 1,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `hd_user_roles` (`id`, `name`, `description`, `status`, `createdAt`, `updatedAt`) VALUES
(1,	'Inventory Management',	'This type of user can manage the all the activity of stock like - category, sub-category, products and its variation , and unit of the product.',	1,	'2020-10-02 18:47:20',	'2020-10-02 18:47:20'),
(2,	'Customer Management',	'This type of user can manage the customers.',	1,	'2020-10-03 11:11:11',	'2020-10-03 11:11:11'),
(3,	'Website Management',	'This type of user can manage the website settings and coupons.',	1,	'2020-10-03 11:11:11',	'2020-10-03 11:11:11'),
(4,	'Order Management',	'This type of user manage the orders activity.',	1,	'2020-12-17 10:15:27',	'2020-12-17 10:15:27');

DROP TABLE IF EXISTS `hd_visitors`;
CREATE TABLE `hd_visitors` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `ip_address` varchar(50) DEFAULT NULL,
  `count` int(11) DEFAULT NULL,
  `status` tinyint(4) DEFAULT 1,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


DROP TABLE IF EXISTS `hd_wishlist`;
CREATE TABLE `hd_wishlist` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `product_id` int(11) DEFAULT NULL,
  `variation_id` int(11) DEFAULT NULL,
  `customer_id` int(11) DEFAULT NULL,
  `status` tinyint(4) DEFAULT 1,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- 2021-08-09 07:06:19
