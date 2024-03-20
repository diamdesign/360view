-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Mar 20, 2024 at 07:06 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `diam_360`
--

-- --------------------------------------------------------

--
-- Table structure for table `captions`
--

CREATE TABLE `captions` (
  `id` int(30) NOT NULL,
  `user_id` int(30) DEFAULT NULL,
  `location_id` int(30) DEFAULT NULL,
  `caption_language` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `comments`
--

CREATE TABLE `comments` (
  `id` int(30) NOT NULL,
  `user_id` int(30) DEFAULT NULL,
  `location_id` int(30) DEFAULT NULL,
  `parent_id` int(30) DEFAULT NULL,
  `reply_id` int(30) DEFAULT NULL,
  `comment` text DEFAULT NULL,
  `registered` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `comments`
--

INSERT INTO `comments` (`id`, `user_id`, `location_id`, `parent_id`, `reply_id`, `comment`, `registered`) VALUES
(1, 1, 1, NULL, NULL, 'Provar vi lite text här', '2024-03-20 18:31:47'),
(2, 2, 1, NULL, NULL, 'JA hej hej', '2024-03-20 18:31:47'),
(3, 1, 1, 1, 1, 'Reply to id1', '2024-03-20 18:32:21'),
(4, 1, 1, 1, 3, 'reply to id3', '2024-03-20 18:32:21');

-- --------------------------------------------------------

--
-- Table structure for table `comments_likes`
--

CREATE TABLE `comments_likes` (
  `id` int(30) NOT NULL,
  `user_id` int(30) DEFAULT NULL,
  `comment_id` int(30) DEFAULT NULL,
  `registered` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `comments_likes`
--

INSERT INTO `comments_likes` (`id`, `user_id`, `comment_id`, `registered`) VALUES
(1, 1, 2, '2024-03-20 19:03:00');

-- --------------------------------------------------------

--
-- Table structure for table `customcss`
--

CREATE TABLE `customcss` (
  `id` int(30) NOT NULL,
  `user_id` int(30) DEFAULT NULL,
  `customname` varchar(255) DEFAULT NULL,
  `maplink` tinyint(1) DEFAULT 0,
  `marker` tinyint(1) DEFAULT 0,
  `markerinfo` tinyint(1) DEFAULT 0,
  `customcss` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `inventory`
--

CREATE TABLE `inventory` (
  `id` int(30) NOT NULL,
  `location_id` int(30) DEFAULT NULL,
  `project_id` int(30) DEFAULT NULL,
  `inventory_name` varchar(255) DEFAULT NULL,
  `inventory_description` varchar(255) DEFAULT NULL,
  `inventory_image` varchar(255) DEFAULT NULL,
  `usewith_id` int(30) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `likes`
--

CREATE TABLE `likes` (
  `id` int(30) NOT NULL,
  `user_id` int(30) DEFAULT NULL,
  `location_id` int(30) DEFAULT NULL,
  `project_id` int(30) DEFAULT NULL,
  `registered` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `likes`
--

INSERT INTO `likes` (`id`, `user_id`, `location_id`, `project_id`, `registered`) VALUES
(1, 1, 1, 1, '2024-03-20 19:02:32'),
(2, 2, 1, 1, '2024-03-20 19:02:32');

-- --------------------------------------------------------

--
-- Table structure for table `locations`
--

CREATE TABLE `locations` (
  `id` int(30) NOT NULL,
  `embed_id` varchar(50) DEFAULT NULL,
  `user_id` int(30) DEFAULT NULL,
  `location_title` varchar(255) DEFAULT NULL,
  `location_description` varchar(255) DEFAULT NULL,
  `file_type` varchar(20) DEFAULT NULL,
  `file_name` varchar(255) DEFAULT NULL,
  `base_url` varchar(255) DEFAULT NULL,
  `duration` varchar(50) DEFAULT NULL,
  `captions` varchar(255) DEFAULT NULL,
  `info` text DEFAULT NULL,
  `custom_logo` varchar(255) DEFAULT NULL,
  `logo_link` varchar(255) DEFAULT NULL,
  `custom_css` text DEFAULT NULL,
  `ispublic` tinyint(1) NOT NULL DEFAULT 1,
  `allowcomments` tinyint(1) NOT NULL DEFAULT 1,
  `hasmusic` tinyint(1) NOT NULL DEFAULT 0,
  `haspass` tinyint(1) NOT NULL DEFAULT 0,
  `hasinventory` tinyint(1) NOT NULL DEFAULT 0,
  `location_password` varchar(255) DEFAULT NULL,
  `registered` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `locations`
--

INSERT INTO `locations` (`id`, `embed_id`, `user_id`, `location_title`, `location_description`, `file_type`, `file_name`, `base_url`, `duration`, `captions`, `info`, `custom_logo`, `logo_link`, `custom_css`, `ispublic`, `allowcomments`, `hasmusic`, `haspass`, `hasinventory`, `location_password`, `registered`) VALUES
(1, 'Lds343GXFfse32', 1, 'Some short title', 'Some description', 'image', '360.jpg', 'https://snallapojkar.se/360/img/', NULL, NULL, 'Some info', NULL, NULL, NULL, 1, 1, 0, 0, 0, NULL, '2024-03-19 19:00:41');

-- --------------------------------------------------------

--
-- Table structure for table `map_links`
--

CREATE TABLE `map_links` (
  `id` int(30) NOT NULL,
  `user_id` int(30) DEFAULT NULL,
  `project_id` int(30) DEFAULT NULL,
  `link_title` varchar(255) DEFAULT NULL,
  `pos_top` int(4) DEFAULT NULL,
  `pos_left` int(4) DEFAULT NULL,
  `link_location_id` int(30) DEFAULT NULL,
  `link_order_index` int(30) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `map_links`
--

INSERT INTO `map_links` (`id`, `user_id`, `project_id`, `link_title`, `pos_top`, `pos_left`, `link_location_id`, `link_order_index`) VALUES
(1, 1, 1, 'Bedroom', 20, 80, 1, 1);

-- --------------------------------------------------------

--
-- Table structure for table `markers`
--

CREATE TABLE `markers` (
  `id` int(30) NOT NULL,
  `location_id` int(30) DEFAULT NULL,
  `marker_title` varchar(255) DEFAULT NULL,
  `pos_x` int(11) DEFAULT NULL,
  `pos_y` int(11) DEFAULT NULL,
  `pos_z` int(11) DEFAULT NULL,
  `info` text DEFAULT NULL,
  `link` varchar(255) DEFAULT NULL,
  `user_id` int(30) DEFAULT NULL,
  `customcss` text DEFAULT NULL,
  `sound` varchar(255) DEFAULT NULL,
  `autoplay` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `markers`
--

INSERT INTO `markers` (`id`, `location_id`, `marker_title`, `pos_x`, `pos_y`, `pos_z`, `info`, `link`, `user_id`, `customcss`, `sound`, `autoplay`) VALUES
(1, 1, 'Bedroom', 1, 1, 360, NULL, '1', 1, NULL, NULL, 0),
(2, 1, 'Get some details', 5, -4, -360, 'Hello', NULL, 1, NULL, NULL, 0);

-- --------------------------------------------------------

--
-- Table structure for table `music`
--

CREATE TABLE `music` (
  `id` int(30) NOT NULL,
  `user_id` int(30) DEFAULT NULL,
  `project_id` int(30) DEFAULT NULL,
  `location_id` int(30) DEFAULT NULL,
  `file_name` varchar(255) DEFAULT NULL,
  `base_url` varchar(255) DEFAULT NULL,
  `duration` varchar(20) DEFAULT NULL,
  `artist` varchar(255) DEFAULT NULL,
  `album` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `projects`
--

CREATE TABLE `projects` (
  `id` int(30) NOT NULL,
  `embed_id` varchar(50) DEFAULT NULL,
  `user_id` int(30) DEFAULT NULL,
  `project_title` varchar(255) DEFAULT NULL,
  `project_description` text DEFAULT NULL,
  `map_filename` varchar(255) DEFAULT NULL,
  `base_url` varchar(255) DEFAULT NULL,
  `custom_logo` varchar(255) DEFAULT NULL,
  `logo_link` varchar(255) DEFAULT NULL,
  `custom_css` varchar(255) DEFAULT NULL,
  `ispublic` tinyint(1) NOT NULL DEFAULT 1,
  `hasmusic` tinyint(1) NOT NULL DEFAULT 0,
  `haspass` tinyint(1) NOT NULL DEFAULT 0,
  `hasinventory` tinyint(1) NOT NULL DEFAULT 0,
  `showlocations` tinyint(1) NOT NULL DEFAULT 1,
  `project_password` varchar(255) DEFAULT NULL,
  `overide_location_password` tinyint(1) NOT NULL DEFAULT 0,
  `registered` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `projects`
--

INSERT INTO `projects` (`id`, `embed_id`, `user_id`, `project_title`, `project_description`, `map_filename`, `base_url`, `custom_logo`, `logo_link`, `custom_css`, `ispublic`, `hasmusic`, `haspass`, `hasinventory`, `showlocations`, `project_password`, `overide_location_password`, `registered`) VALUES
(1, 'Pds343GXFfse32', 1, 'Project title here', 'short description', 'map.png', 'https://snallapojkar.se/360/img/', NULL, NULL, NULL, 1, 0, 0, 0, 1, NULL, 0, '2024-03-19 18:38:27');

-- --------------------------------------------------------

--
-- Table structure for table `project_list`
--

CREATE TABLE `project_list` (
  `id` int(30) NOT NULL,
  `embed_id` varchar(50) DEFAULT NULL,
  `user_id` int(30) DEFAULT NULL,
  `project_id` int(30) DEFAULT NULL,
  `location_id` int(30) DEFAULT NULL,
  `order_index` int(2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `project_list`
--

INSERT INTO `project_list` (`id`, `embed_id`, `user_id`, `project_id`, `location_id`, `order_index`) VALUES
(1, 'Pds343GXFfse32', 1, 1, 1, 1);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(30) NOT NULL,
  `username` varchar(255) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `thumbnail` varchar(255) DEFAULT NULL,
  `coverimage` varchar(255) DEFAULT NULL,
  `user_password` varchar(255) DEFAULT NULL,
  `apikey` varchar(20) DEFAULT NULL,
  `subscriber` tinyint(1) NOT NULL DEFAULT 0,
  `registered` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `email`, `thumbnail`, `coverimage`, `user_password`, `apikey`, `subscriber`, `registered`) VALUES
(1, 'Player1', 'fredrik@diam.se', 'https://picsum.photos/80/80', NULL, 'Timecop', 'sfsrrgs453535', 0, '2024-03-20 18:38:14'),
(2, 'Player2', 'timecop@diam.se', 'https://picsum.photos/81/81', NULL, 'Timecop', 'esrt4535635', 0, '2024-03-20 18:38:18');

-- --------------------------------------------------------

--
-- Table structure for table `user_inventory`
--

CREATE TABLE `user_inventory` (
  `id` int(30) NOT NULL,
  `user_id` int(30) DEFAULT NULL,
  `location_id` int(30) DEFAULT NULL,
  `project_id` int(30) DEFAULT NULL,
  `inventory_id` int(30) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `views`
--

CREATE TABLE `views` (
  `id` int(11) NOT NULL,
  `user_id` int(30) DEFAULT NULL,
  `location_id` int(30) DEFAULT NULL,
  `project_id` int(30) DEFAULT NULL,
  `visitor_ipadress` varchar(255) DEFAULT NULL,
  `visited` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `visitors`
--

CREATE TABLE `visitors` (
  `id` int(11) NOT NULL,
  `user_id` int(30) DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `browser` varchar(255) DEFAULT NULL,
  `resolution` varchar(20) DEFAULT NULL,
  `user_language` varchar(50) DEFAULT NULL,
  `operating_system` varchar(50) DEFAULT NULL,
  `device_type` enum('Mobile','Desktop','Tablet','Other') DEFAULT NULL,
  `current_url` varchar(255) DEFAULT NULL,
  `current_url_system` varchar(255) DEFAULT NULL,
  `visited` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `visitors`
--

INSERT INTO `visitors` (`id`, `user_id`, `ip_address`, `browser`, `resolution`, `user_language`, `operating_system`, `device_type`, `current_url`, `current_url_system`, `visited`) VALUES
(1, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36 Edg/122.0.0.0', NULL, 'en-GB,en;q=0.9,en-US;q=0.8,sv;q=0.7', NULL, NULL, 'http://localhost/360/embed/?i=Pds343GXFfse32&loc=245', 'http://localhost/360/php/checkdata.php', '2024-03-20 17:30:28'),
(2, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36 Edg/122.0.0.0', NULL, 'en-GB,en;q=0.9,en-US;q=0.8,sv;q=0.7', NULL, NULL, 'http://localhost/360/embed/?i=Pds343GXFfse32&loc=245', 'http://localhost/360/php/checkdata.php', '2024-03-20 17:33:43'),
(3, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36 Edg/122.0.0.0', NULL, 'en-GB,en;q=0.9,en-US;q=0.8,sv;q=0.7', NULL, NULL, 'http://localhost/360/embed/?i=Pds343GXFfse32&loc=245', 'http://localhost/360/php/checkdata.php', '2024-03-20 17:34:15'),
(4, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36 Edg/122.0.0.0', NULL, 'en-GB,en;q=0.9,en-US;q=0.8,sv;q=0.7', NULL, NULL, 'http://localhost/360/embed/?i=Pds343GXFfse32&loc=245', 'http://localhost/360/php/checkdata.php', '2024-03-20 17:34:22'),
(5, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36 Edg/122.0.0.0', NULL, 'en-GB,en;q=0.9,en-US;q=0.8,sv;q=0.7', NULL, NULL, 'http://localhost/360/embed/?i=Pds343GXFfse32&loc=245', 'http://localhost/360/php/checkdata.php', '2024-03-20 17:36:00'),
(6, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36 Edg/122.0.0.0', NULL, 'en-GB,en;q=0.9,en-US;q=0.8,sv;q=0.7', NULL, NULL, 'http://localhost/360/embed/?i=Pds343GXFfse32&loc=245', 'http://localhost/360/php/checkdata.php', '2024-03-20 17:38:01'),
(7, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36 Edg/122.0.0.0', NULL, 'en-GB,en;q=0.9,en-US;q=0.8,sv;q=0.7', NULL, NULL, 'http://localhost/360/embed/?i=Pds343GXFfse32&loc=245', 'http://localhost/360/php/checkdata.php', '2024-03-20 17:38:05'),
(8, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36 Edg/122.0.0.0', NULL, 'en-GB,en;q=0.9,en-US;q=0.8,sv;q=0.7', NULL, NULL, 'http://localhost/360/embed/?i=Pds343GXFfse32&loc=245', 'http://localhost/360/php/checkdata.php', '2024-03-20 17:38:37'),
(9, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36 Edg/122.0.0.0', NULL, 'en-GB,en;q=0.9,en-US;q=0.8,sv;q=0.7', NULL, NULL, 'http://localhost/360/embed/?i=Pds343GXFfse32&loc=245', 'http://localhost/360/php/checkdata.php', '2024-03-20 17:40:15'),
(10, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36 Edg/122.0.0.0', NULL, 'en-GB,en;q=0.9,en-US;q=0.8,sv;q=0.7', NULL, NULL, 'http://localhost/360/embed/?i=Pds343GXFfse32&loc=245', 'http://localhost/360/php/checkdata.php', '2024-03-20 17:41:55'),
(11, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36 Edg/122.0.0.0', NULL, 'en-GB,en;q=0.9,en-US;q=0.8,sv;q=0.7', NULL, NULL, 'http://localhost/360/embed/?i=Pds343GXFfse32&loc=245', 'http://localhost/360/php/checkdata.php', '2024-03-20 17:42:34'),
(12, 1, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36 Edg/122.0.0.0', NULL, 'en-GB,en;q=0.9,en-US;q=0.8,sv;q=0.7', NULL, NULL, 'http://localhost/360/embed/?i=Pds343GXFfse32&loc=245', 'http://localhost/360/php/getdata.php', '2024-03-20 17:42:34'),
(13, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36 Edg/122.0.0.0', NULL, 'en-GB,en;q=0.9,en-US;q=0.8,sv;q=0.7', NULL, NULL, 'http://localhost/360/embed/?i=Pds343GXFfse32&loc=245', 'http://localhost/360/php/checkdata.php', '2024-03-20 17:44:30'),
(14, 1, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36 Edg/122.0.0.0', NULL, 'en-GB,en;q=0.9,en-US;q=0.8,sv;q=0.7', NULL, NULL, 'http://localhost/360/embed/?i=Pds343GXFfse32&loc=245', 'http://localhost/360/php/getdata.php', '2024-03-20 17:44:30'),
(15, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36 Edg/122.0.0.0', NULL, 'en-GB,en;q=0.9,en-US;q=0.8,sv;q=0.7', NULL, NULL, 'http://localhost/360/embed/?i=Pds343GXFfse32&loc=245', 'http://localhost/360/php/checkdata.php', '2024-03-20 17:45:13'),
(16, 1, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36 Edg/122.0.0.0', NULL, 'en-GB,en;q=0.9,en-US;q=0.8,sv;q=0.7', NULL, NULL, 'http://localhost/360/embed/?i=Pds343GXFfse32&loc=245', 'http://localhost/360/php/getdata.php', '2024-03-20 17:45:13'),
(17, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36 Edg/122.0.0.0', NULL, 'en-GB,en;q=0.9,en-US;q=0.8,sv;q=0.7', NULL, NULL, 'http://localhost/360/embed/?i=Pds343GXFfse32&loc=245', 'http://localhost/360/php/checkdata.php', '2024-03-20 17:46:22'),
(18, 1, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36 Edg/122.0.0.0', NULL, 'en-GB,en;q=0.9,en-US;q=0.8,sv;q=0.7', NULL, NULL, 'http://localhost/360/embed/?i=Pds343GXFfse32&loc=245', 'http://localhost/360/php/getdata.php', '2024-03-20 17:46:22'),
(19, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36 Edg/122.0.0.0', NULL, 'en-GB,en;q=0.9,en-US;q=0.8,sv;q=0.7', NULL, NULL, 'http://localhost/360/embed/?i=Pds343GXFfse32&loc=245', 'http://localhost/360/php/checkdata.php', '2024-03-20 17:46:46'),
(20, 1, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36 Edg/122.0.0.0', NULL, 'en-GB,en;q=0.9,en-US;q=0.8,sv;q=0.7', NULL, NULL, 'http://localhost/360/embed/?i=Pds343GXFfse32&loc=245', 'http://localhost/360/php/getdata.php', '2024-03-20 17:46:46'),
(21, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36 Edg/122.0.0.0', NULL, 'en-GB,en;q=0.9,en-US;q=0.8,sv;q=0.7', NULL, NULL, 'http://localhost/360/embed/?i=Pds343GXFfse32&loc=245', 'http://localhost/360/php/checkdata.php', '2024-03-20 17:48:30'),
(22, 1, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36 Edg/122.0.0.0', NULL, 'en-GB,en;q=0.9,en-US;q=0.8,sv;q=0.7', NULL, NULL, 'http://localhost/360/embed/?i=Pds343GXFfse32&loc=245', 'http://localhost/360/php/getdata.php', '2024-03-20 17:48:30'),
(23, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36 Edg/122.0.0.0', NULL, 'en-GB,en;q=0.9,en-US;q=0.8,sv;q=0.7', NULL, NULL, 'http://localhost/360/embed/?i=Pds343GXFfse32&loc=245', 'http://localhost/360/php/checkdata.php', '2024-03-20 17:48:54'),
(24, 1, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36 Edg/122.0.0.0', NULL, 'en-GB,en;q=0.9,en-US;q=0.8,sv;q=0.7', NULL, NULL, 'http://localhost/360/embed/?i=Pds343GXFfse32&loc=245', 'http://localhost/360/php/getdata.php', '2024-03-20 17:48:54'),
(25, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36 Edg/122.0.0.0', NULL, 'en-GB,en;q=0.9,en-US;q=0.8,sv;q=0.7', NULL, NULL, 'http://localhost/360/embed/?i=Pds343GXFfse32&loc=245', 'http://localhost/360/php/checkdata.php', '2024-03-20 17:50:16'),
(26, 1, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36 Edg/122.0.0.0', NULL, 'en-GB,en;q=0.9,en-US;q=0.8,sv;q=0.7', NULL, NULL, 'http://localhost/360/embed/?i=Pds343GXFfse32&loc=245', 'http://localhost/360/php/getdata.php', '2024-03-20 17:50:16'),
(27, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36 Edg/122.0.0.0', NULL, 'en-GB,en;q=0.9,en-US;q=0.8,sv;q=0.7', NULL, NULL, 'http://localhost/360/embed/?i=Pds343GXFfse32&loc=245', 'http://localhost/360/php/checkdata.php', '2024-03-20 17:50:33'),
(28, 1, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36 Edg/122.0.0.0', NULL, 'en-GB,en;q=0.9,en-US;q=0.8,sv;q=0.7', NULL, NULL, 'http://localhost/360/embed/?i=Pds343GXFfse32&loc=245', 'http://localhost/360/php/getdata.php', '2024-03-20 17:50:33'),
(29, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36 Edg/122.0.0.0', NULL, 'en-GB,en;q=0.9,en-US;q=0.8,sv;q=0.7', NULL, NULL, 'http://localhost/360/embed/?i=Pds343GXFfse32&loc=245', 'http://localhost/360/php/checkdata.php', '2024-03-20 17:52:30'),
(30, 1, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36 Edg/122.0.0.0', NULL, 'en-GB,en;q=0.9,en-US;q=0.8,sv;q=0.7', NULL, NULL, 'http://localhost/360/embed/?i=Pds343GXFfse32&loc=245', 'http://localhost/360/php/getdata.php', '2024-03-20 17:52:30'),
(31, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36 Edg/122.0.0.0', NULL, 'en-GB,en;q=0.9,en-US;q=0.8,sv;q=0.7', NULL, NULL, 'http://localhost/360/embed/?i=Pds343GXFfse32&loc=245', 'http://localhost/360/php/checkdata.php', '2024-03-20 17:53:16'),
(32, 1, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36 Edg/122.0.0.0', NULL, 'en-GB,en;q=0.9,en-US;q=0.8,sv;q=0.7', NULL, NULL, 'http://localhost/360/embed/?i=Pds343GXFfse32&loc=245', 'http://localhost/360/php/getdata.php', '2024-03-20 17:53:16'),
(33, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36 Edg/122.0.0.0', NULL, 'en-GB,en;q=0.9,en-US;q=0.8,sv;q=0.7', NULL, NULL, 'http://localhost/360/embed/?i=Pds343GXFfse32&loc=245', 'http://localhost/360/php/checkdata.php', '2024-03-20 17:54:47'),
(34, 1, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36 Edg/122.0.0.0', NULL, 'en-GB,en;q=0.9,en-US;q=0.8,sv;q=0.7', NULL, NULL, 'http://localhost/360/embed/?i=Pds343GXFfse32&loc=245', 'http://localhost/360/php/getdata.php', '2024-03-20 17:54:48'),
(35, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36 Edg/122.0.0.0', NULL, 'en-GB,en;q=0.9,en-US;q=0.8,sv;q=0.7', NULL, NULL, 'http://localhost/360/embed/?i=Pds343GXFfse32&loc=245', 'http://localhost/360/php/checkdata.php', '2024-03-20 17:55:53'),
(36, 1, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36 Edg/122.0.0.0', NULL, 'en-GB,en;q=0.9,en-US;q=0.8,sv;q=0.7', NULL, NULL, 'http://localhost/360/embed/?i=Pds343GXFfse32&loc=245', 'http://localhost/360/php/getdata.php', '2024-03-20 17:55:53'),
(37, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36 Edg/122.0.0.0', NULL, 'en-GB,en;q=0.9,en-US;q=0.8,sv;q=0.7', NULL, NULL, 'http://localhost/360/embed/?i=Pds343GXFfse32&loc=245', 'http://localhost/360/php/checkdata.php', '2024-03-20 17:56:16'),
(38, 1, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36 Edg/122.0.0.0', NULL, 'en-GB,en;q=0.9,en-US;q=0.8,sv;q=0.7', NULL, NULL, 'http://localhost/360/embed/?i=Pds343GXFfse32&loc=245', 'http://localhost/360/php/getdata.php', '2024-03-20 17:56:16'),
(39, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36 Edg/122.0.0.0', NULL, 'en-GB,en;q=0.9,en-US;q=0.8,sv;q=0.7', NULL, NULL, 'http://localhost/360/embed/?i=Pds343GXFfse32&loc=245', 'http://localhost/360/php/checkdata.php', '2024-03-20 17:56:34'),
(40, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36 Edg/122.0.0.0', NULL, 'en-GB,en;q=0.9,en-US;q=0.8,sv;q=0.7', NULL, NULL, 'http://localhost/360/embed/?i=Pds343GXFfse32&loc=245', 'http://localhost/360/php/checkdata.php', '2024-03-20 17:56:35'),
(41, 1, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36 Edg/122.0.0.0', NULL, 'en-GB,en;q=0.9,en-US;q=0.8,sv;q=0.7', NULL, NULL, 'http://localhost/360/embed/?i=Pds343GXFfse32&loc=245', 'http://localhost/360/php/getdata.php', '2024-03-20 17:56:35'),
(42, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36 Edg/122.0.0.0', NULL, 'en-GB,en;q=0.9,en-US;q=0.8,sv;q=0.7', NULL, NULL, 'http://localhost/360/embed/?i=Pds343GXFfse32&loc=245', 'http://localhost/360/php/checkdata.php', '2024-03-20 17:58:03'),
(43, 1, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36 Edg/122.0.0.0', NULL, 'en-GB,en;q=0.9,en-US;q=0.8,sv;q=0.7', NULL, NULL, 'http://localhost/360/embed/?i=Pds343GXFfse32&loc=245', 'http://localhost/360/php/getdata.php', '2024-03-20 17:58:03'),
(44, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36 Edg/122.0.0.0', NULL, 'en-GB,en;q=0.9,en-US;q=0.8,sv;q=0.7', NULL, NULL, 'http://localhost/360/embed/?i=Pds343GXFfse32&loc=245', 'http://localhost/360/php/checkdata.php', '2024-03-20 17:58:55'),
(45, 1, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36 Edg/122.0.0.0', NULL, 'en-GB,en;q=0.9,en-US;q=0.8,sv;q=0.7', NULL, NULL, 'http://localhost/360/embed/?i=Pds343GXFfse32&loc=245', 'http://localhost/360/php/getdata.php', '2024-03-20 17:58:56'),
(46, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36 Edg/122.0.0.0', NULL, 'en-GB,en;q=0.9,en-US;q=0.8,sv;q=0.7', NULL, NULL, 'http://localhost/360/embed/?i=Pds343GXFfse32&loc=245', 'http://localhost/360/php/checkdata.php', '2024-03-20 17:59:51'),
(47, 1, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36 Edg/122.0.0.0', NULL, 'en-GB,en;q=0.9,en-US;q=0.8,sv;q=0.7', NULL, NULL, 'http://localhost/360/embed/?i=Pds343GXFfse32&loc=245', 'http://localhost/360/php/getdata.php', '2024-03-20 17:59:51'),
(48, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36 Edg/122.0.0.0', NULL, 'en-GB,en;q=0.9,en-US;q=0.8,sv;q=0.7', NULL, NULL, 'http://localhost/360/embed/?i=Pds343GXFfse32&loc=245', 'http://localhost/360/php/checkdata.php', '2024-03-20 18:00:52'),
(49, 1, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36 Edg/122.0.0.0', NULL, 'en-GB,en;q=0.9,en-US;q=0.8,sv;q=0.7', NULL, NULL, 'http://localhost/360/embed/?i=Pds343GXFfse32&loc=245', 'http://localhost/360/php/getdata.php', '2024-03-20 18:00:52'),
(50, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36 Edg/122.0.0.0', NULL, 'en-GB,en;q=0.9,en-US;q=0.8,sv;q=0.7', NULL, NULL, 'http://localhost/360/embed/?i=Pds343GXFfse32&loc=245', 'http://localhost/360/php/checkdata.php', '2024-03-20 18:01:16'),
(51, 1, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36 Edg/122.0.0.0', NULL, 'en-GB,en;q=0.9,en-US;q=0.8,sv;q=0.7', NULL, NULL, 'http://localhost/360/embed/?i=Pds343GXFfse32&loc=245', 'http://localhost/360/php/getdata.php', '2024-03-20 18:01:16'),
(52, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36 Edg/122.0.0.0', NULL, 'en-GB,en;q=0.9,en-US;q=0.8,sv;q=0.7', NULL, NULL, 'http://localhost/360/embed/?i=Pds343GXFfse32&loc=245', 'http://localhost/360/php/checkdata.php', '2024-03-20 18:02:49'),
(53, 1, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36 Edg/122.0.0.0', NULL, 'en-GB,en;q=0.9,en-US;q=0.8,sv;q=0.7', NULL, NULL, 'http://localhost/360/embed/?i=Pds343GXFfse32&loc=245', 'http://localhost/360/php/getdata.php', '2024-03-20 18:02:49'),
(54, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36 Edg/122.0.0.0', NULL, 'en-GB,en;q=0.9,en-US;q=0.8,sv;q=0.7', NULL, NULL, 'http://localhost/360/embed/?i=Pds343GXFfse32&loc=245', 'http://localhost/360/php/checkdata.php', '2024-03-20 18:03:12'),
(55, 1, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36 Edg/122.0.0.0', NULL, 'en-GB,en;q=0.9,en-US;q=0.8,sv;q=0.7', NULL, NULL, 'http://localhost/360/embed/?i=Pds343GXFfse32&loc=245', 'http://localhost/360/php/getdata.php', '2024-03-20 18:03:12'),
(56, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36 Edg/122.0.0.0', NULL, 'en-GB,en;q=0.9,en-US;q=0.8,sv;q=0.7', NULL, NULL, 'http://localhost/360/embed/?i=Pds343GXFfse32&loc=245', 'http://localhost/360/php/checkdata.php', '2024-03-20 18:04:44'),
(57, 1, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36 Edg/122.0.0.0', NULL, 'en-GB,en;q=0.9,en-US;q=0.8,sv;q=0.7', NULL, NULL, 'http://localhost/360/embed/?i=Pds343GXFfse32&loc=245', 'http://localhost/360/php/getdata.php', '2024-03-20 18:04:44');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `captions`
--
ALTER TABLE `captions`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `comments`
--
ALTER TABLE `comments`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `comments_likes`
--
ALTER TABLE `comments_likes`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `customcss`
--
ALTER TABLE `customcss`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `inventory`
--
ALTER TABLE `inventory`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `likes`
--
ALTER TABLE `likes`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `locations`
--
ALTER TABLE `locations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `map_links`
--
ALTER TABLE `map_links`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `markers`
--
ALTER TABLE `markers`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `music`
--
ALTER TABLE `music`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `projects`
--
ALTER TABLE `projects`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `project_list`
--
ALTER TABLE `project_list`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user_inventory`
--
ALTER TABLE `user_inventory`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `views`
--
ALTER TABLE `views`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `visitors`
--
ALTER TABLE `visitors`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `captions`
--
ALTER TABLE `captions`
  MODIFY `id` int(30) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `comments`
--
ALTER TABLE `comments`
  MODIFY `id` int(30) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `comments_likes`
--
ALTER TABLE `comments_likes`
  MODIFY `id` int(30) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `customcss`
--
ALTER TABLE `customcss`
  MODIFY `id` int(30) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `inventory`
--
ALTER TABLE `inventory`
  MODIFY `id` int(30) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `likes`
--
ALTER TABLE `likes`
  MODIFY `id` int(30) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `locations`
--
ALTER TABLE `locations`
  MODIFY `id` int(30) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `map_links`
--
ALTER TABLE `map_links`
  MODIFY `id` int(30) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `markers`
--
ALTER TABLE `markers`
  MODIFY `id` int(30) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `music`
--
ALTER TABLE `music`
  MODIFY `id` int(30) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `projects`
--
ALTER TABLE `projects`
  MODIFY `id` int(30) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `project_list`
--
ALTER TABLE `project_list`
  MODIFY `id` int(30) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(30) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `user_inventory`
--
ALTER TABLE `user_inventory`
  MODIFY `id` int(30) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `views`
--
ALTER TABLE `views`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `visitors`
--
ALTER TABLE `visitors`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=58;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
