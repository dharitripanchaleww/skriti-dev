-- MariaDB dump 10.19  Distrib 10.4.24-MariaDB, for Win64 (AMD64)
--
-- Host: localhost    Database: sanskriti
-- ------------------------------------------------------
-- Server version	10.4.24-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `adonis_schema`
--

DROP TABLE IF EXISTS `adonis_schema`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `adonis_schema` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `batch` int(11) NOT NULL,
  `migration_time` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `adonis_schema`
--

LOCK TABLES `adonis_schema` WRITE;
/*!40000 ALTER TABLE `adonis_schema` DISABLE KEYS */;
/*!40000 ALTER TABLE `adonis_schema` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `api_tokens`
--

DROP TABLE IF EXISTS `api_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `api_tokens` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int(10) unsigned DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `type` varchar(255) NOT NULL,
  `token` varchar(64) NOT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `api_tokens`
--

LOCK TABLES `api_tokens` WRITE;
/*!40000 ALTER TABLE `api_tokens` DISABLE KEYS */;
/*!40000 ALTER TABLE `api_tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `app_services`
--

DROP TABLE IF EXISTS `app_services`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `app_services` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `type` varchar(200) COLLATE utf8_unicode_ci NOT NULL COMMENT 'type of service. i.e. app_android, app_ios, etc.',
  `version` varchar(10) COLLATE utf8_unicode_ci NOT NULL COMMENT 'version of service.',
  `is_under_maintenance` tinyint(1) NOT NULL DEFAULT 1 COMMENT '1 if service is under maintenance.',
  `is_force_update` tinyint(1) NOT NULL DEFAULT 0 COMMENT '1 if service is must be updated by user.',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `app_services_type_unique` (`type`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `app_services`
--

LOCK TABLES `app_services` WRITE;
/*!40000 ALTER TABLE `app_services` DISABLE KEYS */;
INSERT INTO `app_services` VALUES (1,'ios','0.0.1',0,0,NULL,'2021-08-31 07:29:12'),(2,'android','0.0.1',0,0,NULL,'2021-08-31 07:29:28');
/*!40000 ALTER TABLE `app_services` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `category`
--

DROP TABLE IF EXISTS `category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `category` (
  `id` int(20) NOT NULL AUTO_INCREMENT,
  `category_name` varchar(255) NOT NULL,
  `status` tinyint(2) NOT NULL DEFAULT 1,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT NULL ON UPDATE current_timestamp(),
  `deleted_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `category`
--

LOCK TABLES `category` WRITE;
/*!40000 ALTER TABLE `category` DISABLE KEYS */;
/*!40000 ALTER TABLE `category` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `colors`
--

DROP TABLE IF EXISTS `colors`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `colors` (
  `id` int(20) NOT NULL AUTO_INCREMENT,
  `color_name` varchar(50) NOT NULL,
  `status` tinyint(2) NOT NULL DEFAULT 1,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT NULL ON UPDATE current_timestamp(),
  `deleted_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `colors`
--

LOCK TABLES `colors` WRITE;
/*!40000 ALTER TABLE `colors` DISABLE KEYS */;
/*!40000 ALTER TABLE `colors` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `contact_uses`
--

DROP TABLE IF EXISTS `contact_uses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `contact_uses` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8_unicode_ci NOT NULL COMMENT 'name of user.',
  `email` varchar(255) COLLATE utf8_unicode_ci NOT NULL COMMENT 'email of user.',
  `subject` varchar(255) COLLATE utf8_unicode_ci NOT NULL COMMENT 'subject of inquiry.',
  `message` text COLLATE utf8_unicode_ci NOT NULL COMMENT 'message of inquiry.',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `contact_uses`
--

LOCK TABLES `contact_uses` WRITE;
/*!40000 ALTER TABLE `contact_uses` DISABLE KEYS */;
INSERT INTO `contact_uses` VALUES (2,'test','admin@admin.com','test','sldkfjdfl','2022-01-12 06:01:27','2022-01-12 06:01:27');
/*!40000 ALTER TABLE `contact_uses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `groups`
--

DROP TABLE IF EXISTS `groups`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `groups` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT NULL ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `groups`
--

LOCK TABLES `groups` WRITE;
/*!40000 ALTER TABLE `groups` DISABLE KEYS */;
INSERT INTO `groups` VALUES (1,'Admin','admin','2022-06-09 11:47:43','2022-06-09 11:47:52'),(2,'User','user','2022-06-09 11:47:43','2022-06-09 11:47:54');
/*!40000 ALTER TABLE `groups` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pages`
--

DROP TABLE IF EXISTS `pages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `pages` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(255) COLLATE utf8_unicode_ci NOT NULL COMMENT 'title of the page.',
  `content` text COLLATE utf8_unicode_ci NOT NULL COMMENT 'content of the page.',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_page_name` (`title`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pages`
--

LOCK TABLES `pages` WRITE;
/*!40000 ALTER TABLE `pages` DISABLE KEYS */;
INSERT INTO `pages` VALUES (1,'en_terms_and_conditions','<ul><li class=\"ql-align-justify\"><strong>Lorem Ipsum</strong>&nbsp;is simply dummy text of the printing and typesetting industry. </li><li class=\"ql-align-justify\">Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. </li><li class=\"ql-align-justify\">It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. </li><li class=\"ql-align-justify\">It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</li></ul><p><br></p>',NULL,'2022-06-14 09:45:07'),(2,'en_privacy_and_policy','<ul><li class=\"ql-align-justify\"><strong>Lorem Ipsum</strong>&nbsp;is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.</li><li class=\"ql-align-justify\"> It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</li></ul><p><br></p>',NULL,'2022-06-14 09:45:46'),(3,'en_about_us','<p class=\"ql-align-justify\">It is a long-established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using \'Content here, content here, making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for \'lorem Ipsum will uncover many websites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humor and the like).</p><p class=\"ql-align-justify\"><br></p><p class=\"ql-align-justify\"><strong>Lorem Ipsum</strong>&nbsp;is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p><p class=\"ql-align-justify\"><br></p>',NULL,'2022-06-14 09:44:07'),(4,'en_publication_ethics','<p class=\"ql-align-justify\"><strong>Publication Ethics:</strong></p><p class=\"ql-align-justify\">Every author who provides their works to the journal for publishing as authenticate researches shall undertake that the submitted works are their own contributions and not scrapped entirely or partially from third parties’ works.</p><p class=\"ql-align-justify\">The journal is subject to <a href=\"http://publicationethics.org/files/Code_of_conduct_for_journal_editors_Mar11.pdf\" target=\"_blank\" style=\"color: rgb(5, 99, 193);\"><u>Code of Conduct and Best Practice Guidelines for Journal Editors</u></a>&nbsp;</p><p class=\"ql-align-justify\">It is also subject to <a href=\"https://publicationethics.org/\" target=\"_blank\" style=\"color: rgb(5, 99, 193);\"><u>COPE Ethical Guidelines for Peer Reviewers</u></a>.</p><p class=\"ql-align-justify\">&nbsp;</p><p class=\"ql-align-justify\"><strong>Editing Duties:</strong></p><p class=\"ql-align-justify\">-&nbsp;To supervise and follow up the journal in terms of quality of published content and works of peer reviewing committees, and continuously strive to achieve and develop the journal objectives;</p><p class=\"ql-align-justify\">-&nbsp;To contribute to achieving the vision, mission and objectives of the journal;</p><p class=\"ql-align-justify\">-&nbsp;To verify the fields of researches to be published in the journal;</p><p class=\"ql-align-justify\">-&nbsp;To participate in the nomination of peer reviewers for scientific researches to be published in the journal;</p><p class=\"ql-align-justify\">-&nbsp;To review the peer reviewing results and discuss the results;</p><p class=\"ql-align-justify\">-&nbsp;To participate in making decisions related to the acceptance of publication of research in the journal;</p><p class=\"ql-align-justify\">-&nbsp;To ensure the quality of published research outputs and their compliance with publication rules and requirements;</p><p class=\"ql-align-justify\">-&nbsp;To ensure the novelty and authenticity of the research content published in the journal; and</p><p class=\"ql-align-justify\">-&nbsp;To periodically review and update the requirements of publication and the method of documentation.</p><p class=\"ql-align-justify\">&nbsp;</p><p class=\"ql-align-justify\"><strong>Peer Reviewers Duties:</strong></p><p class=\"ql-align-justify\">-&nbsp;The peer reviewer shall maintain the confidentiality of the research data and respect the property of the presented ideas;</p><p class=\"ql-align-justify\">-&nbsp;To check, review and evaluate manuscripts;</p><p class=\"ql-align-justify\">-&nbsp;To provide assistance to the editorial team in making the appropriate decision regarding the acceptance of the research;</p><p class=\"ql-align-justify\">-&nbsp;To provide scientific and technical observations on research objectively to improve and raise its scientific efficiency;</p><p class=\"ql-align-justify\">-&nbsp;To ensure the researcher’s commitment to the scientific methodology for writing research, and commitment to the publishing standards approved in the journal; and</p><p class=\"ql-align-justify\">-&nbsp;The peer reviewers must disclose any conflict of interest resulting from relationships with any of the authors, companies or institutions associated with their research papers.</p><p class=\"ql-align-justify\">&nbsp;</p><p class=\"ql-align-justify\"><strong>Authors Duties:</strong></p><p class=\"ql-align-justify\">-&nbsp;To adhere to the principles and standards of research and publication ethics;</p><p class=\"ql-align-justify\">-&nbsp;To ensure that authenticate research is provided, and a list of sources and references that have been referenced in the research is provided;</p><p class=\"ql-align-justify\">-&nbsp;To adhere to the rules of citation, documentation and publication ethics;</p><p class=\"ql-align-justify\">-&nbsp;To ensure that the research is authenticate and has not been previously published in other journals;</p><p class=\"ql-align-justify\">-&nbsp;To mention the efforts of others or contributors to his/her research and obtain prior approvals from them;</p><p class=\"ql-align-justify\">-&nbsp;To disclose any conflict of interest that may affect the evaluation of the research submitted for publication;</p><p class=\"ql-align-justify\">-&nbsp;Not to submit the research to more than one entity for publication;</p><p class=\"ql-align-justify\">-&nbsp;To avoid all kinds of unethical behavior such as plagiarism and forgery; and</p><p class=\"ql-align-justify\">-&nbsp;The researcher must review his/her research according to the peer reviewers’ proposals, and in case the researcher does not agree the proposed amendments, he/she must provide a reasonable justification, and failure thereof, the journal reserves the right to refuse publication.</p><p class=\"ql-align-justify\">&nbsp;</p><p class=\"ql-align-justify\"><strong>Journal Policies for Author Making Changes to Research:</strong></p><p class=\"ql-align-justify\">·&nbsp;The researcher has the right to make the necessary additions, clarifications and corrections, and to indicate errors, if any, in the research after its publication, by notifying the editorial board and after its approval.</p><p class=\"ql-align-justify\">·&nbsp;The researcher has the right to request the withdrawal of his/her research after submitting a written request and clarifying the reasons therefor, and the editorial board has the final decision.</p><p class=\"ql-align-justify\">·&nbsp;The editorial board has the right to remove the research from the journal website if it is proven that there is plagiarism and scientific scraping, or it is proven that the said research was previously published in another journal, or it violates the terms and policies of the journal.</p><p><br></p>',NULL,'2022-01-25 09:21:28'),(5,'en_for_author','<h4 class=\"ql-align-justify\"><strong>Research&nbsp;Submission</strong></h4><p class=\"ql-align-justify\">Researchers must review the publishing standards before submitting the search.</p><p class=\"ql-align-justify\">Submitting the research is considered as a consent and acceptance by the researcher for the publishing rules of the journal.</p><p class=\"ql-align-justify\">The article can be submitted either by direct submission on the journal’s website or by sending it to the journal’s email:<span style=\"color: rgb(0, 0, 255);\">&nbsp;</span><a href=\"mailto:editor@mahurajournal.com\" target=\"_blank\" style=\"color: rgb(0, 0, 255);\">editor@mahurajournal.com</a></p><p class=\"ql-align-justify\">All personal information of the researcher must be provided.</p><p class=\"ql-align-justify\"><strong>&nbsp;</strong></p><h4 class=\"ql-align-justify\"><strong>Declaration</strong></h4><p class=\"ql-align-justify\"><a href=\"https://drive.google.com/file/d/1tnKon3wOVTdpHBxiG5-0a4-j_FFmszCC/view?usp=sharing\" target=\"_blank\" style=\"color: rgb(255, 0, 0);\"><strong>Policy Acceptance</strong></a></p><p class=\"ql-align-justify\">Right-click and select “Save Link As” to download the form</p><p class=\"ql-align-justify\">Author’s information form</p><p class=\"ql-align-justify\"><a href=\"https://drive.google.com/file/d/1yu6hCDZHEHPtmfqzz8O1-5UclilypleT/view?usp=sharing\" target=\"_blank\" style=\"color: rgb(255, 0, 0);\"><strong>English</strong>&nbsp;</a>/&nbsp;<a href=\"https://drive.google.com/file/d/1C8brk8z6LMU6TZXXYd2qIQ1d8pb28uuV/view?usp=sharing\" target=\"_blank\" style=\"color: rgb(255, 0, 0);\"><strong>Arabic&nbsp;</strong>&nbsp;</a>Right click and select “Save Link As” to download the form</p><p class=\"ql-align-justify\"><strong>Publishing Domains</strong></p><p class=\"ql-align-justify\">The journal accepts the submissions for publication in the below areas and their sub divisions, which are not limited to the following:</p><ul><li>Fundamentals of Islamic Finance</li><li>Fundamentals of Shari’ah</li><li>Islamic banking</li><li>Islamic capital markets</li><li>Islamic money markets</li><li>Islamic insurance (Takaful)</li><li>Basics of jurisprudence and Shari’ah and their modern application in the field of finance</li><li>Corporate governance in Islamic perspective</li><li>Social responsibility in Islamic perspective</li><li>Shari’ah compliant investments</li><li>Shari’ah compliant risk management</li><li>Islamic derivatives</li><li>Shari’ah compliant sukuk, shares and funds</li><li>Shari’ah compliant capital partnership</li><li>Shari’ah application in light of modern finance</li><li>Islamic finance and financial systems</li><li>Shari’ah compliant wealth management</li><li>Islamic Accounting</li><li>Shari’ah Auditing</li><li>Scientific reports published by conferences, seminars and workshops related to Economics</li><li>Research and studies in the behavioural economics and ethics</li><li>Studies in the field of economic regulation</li><li>Economic review and critiques of academic dissertations: Master’s thesis and PhD researches related to the journal’s specialization</li></ul><p class=\"ql-align-justify\">&nbsp;</p><h4 class=\"ql-align-justify\"><strong>Publishing Policies</strong></h4><p class=\"ql-align-justify\"><strong>&nbsp;</strong></p><h4 class=\"ql-align-justify\"><strong>First: General Publishing Conditions:</strong></h4><p class=\"ql-align-justify\">&nbsp;</p><ul><li>The Journal publishes should be articles related to Islamic economics and finance in both Arabic and English, whether original researches, reports and proceedings of conferences, seminars, workshops or thesis proposals related to the field of specialization.</li><li>The journal shall publish researches that have never been published before, by any means of publication, not been submitted for publication in another journal. The researcher shall confirm the same in a written undertaking.</li><li>The researches submitted to the journal cannot be recalled whether published or not published.</li><li>The research shall not be published elsewhere after it has been approved for publication/published in the journal, except after obtaining a written permission from the editor in chief.</li><li>In the event, the researcher is found to be in breach of the academic integrity, the journal reserves the right to take necessary action and notify the same to the co-journals.</li><li>The journal shall not be required to detail the reasons in case of the research was not published.</li><li>The editorial board reserves the right to undertake structural changes on the research in line with the publication policy of the journal.</li><li>The journal does not charge any fee for publishing, neither it pays any monetary gratuity for the papers selected for publication except in case of the papers written on a special request by the journal.</li></ul><h4 class=\"ql-align-justify\">&nbsp;</h4><h4 class=\"ql-align-justify\"><strong>Second Specific Publishing Conditions:</strong></h4><p class=\"ql-align-justify\">&nbsp;</p><ol><li>The researcher should adhere to the objectives and ethical values of scientific researches, including but not limited to:</li></ol><ul><li class=\"ql-indent-1\">The originality and integrity of the research paper, both scientifically and intellectually.</li><li class=\"ql-indent-1\">Refraining from offending individuals and institutions while undertaking scientific criticism in research.</li><li class=\"ql-indent-1\">Addressing contemporary issues and that are in need for human realism in theoretical and applied spectrums.</li><li class=\"ql-indent-1\">Ensuring the adherence to the objectivity without influence of any personal tendencies and trends.</li></ul><ol><li>The manuscript should meet the following scientific standards for presenting research:</li></ol><ul><li class=\"ql-indent-1\">The linguistic accuracy free from linguistic and grammatical errors.</li><li class=\"ql-indent-1\">Proper application of the punctuation and spelling rules.</li><li class=\"ql-indent-1\">Accuracy in editing and citing the texts and references.</li></ul><ol><li>The number of pages of the research paper should not exceed (30) pages of normal (A4) size, including the summaries: Arabic and English, as well as the references and annexure.</li><li>Font size and type:</li></ol><ul><li class=\"ql-indent-1\">Researches submitted in Arabic should be submitted in Traditional Arabic font: size (16), with margin line (12).</li><li class=\"ql-indent-1\">Researches written in English should be submitted in (Times New Roman) font and size of (14), with the margin of (10).</li></ul><ol><li>The research should be accompanied by an abstract in both Arabic and English, in no more than 300 words in a clear language. The abstract should include: Topic of the research, its objectives, significant findings, additional recommendations, and the keywords.</li><li>The research should be divided and organized according to the requirements of the research method in order to maintain the styles of the researches and reports published in the journal as following:</li></ol><ul><li class=\"ql-indent-1\">The introduction which shall includes: the research’s subject, significance, problem, limitations, objectives, methodology, literature review (if any), and research structure.</li><li class=\"ql-indent-1\">The research contents should be divided into subtopics systematically and coherently.</li><li class=\"ql-indent-1\">Ensure that a specific idea is presented in each section to avoid prolonged paragraphs and sub-headings.</li><li class=\"ql-indent-1\">Conclusion should summarize the research and give a comprehensive outlook including the most important (results) and (recommendations).</li><li class=\"ql-indent-1\">List of sources, references and annexes.</li></ul><ol><li>The citation method should be applied as follows:</li></ol><ul><li class=\"ql-indent-1\">Researches in English language shall use (MLA) methodology for in text and bibliographic citations.</li><li>Researches in Arabic Language shall adopt the below methodology for citing the sources and references:</li></ul><ol><li class=\"ql-indent-2\">The sources and references in the footnote for the first time are mentioned as follows: (Author’s nickname, first name, source material, place of publication, publisher, edition number, publication date, volume and page)</li><li class=\"ql-indent-1\">The source and reference are mentioned when recurred in the next foot note directly (ibid., volume and page) and when mentioned in another place of the research (the author’s nickname, name of the source, the volume and the page).</li></ol><ul><li>If the reference is lacking some data, the abbreviations shall be as follows:</li></ul><ol><li class=\"ql-indent-2\">Without the place of publication: (N.P). Without the name of the publisher (N.p)</li><li class=\"ql-indent-1\">Without edition number: (n.e) Without publication date: (n.d)</li><li>The Qur’anic aayath should be written, not to be copied from some electronic source, name of the Surah and number of the Aayath shall be mentioned in footnote.</li><li>While quoting the source of Hadith of messenger peace be upon him, the complete description of Hadith verification, in terms of the chapter, section and the number of Hadith shall be mentioned.</li><li>While quoting something from internet, the last retrieval date shall be mentioned. Footnotes are placed at the bottom of each page with sequential numbering from the beginning of the research to the end.</li><li>Graphics, data, tables, etc., to be placed as follows:</li></ol><ul><li class=\"ql-indent-1\">Graphs and illustrations are included in the text, in black and white colours, numbered sequentially, and their titles and annotations are written at the bottom.</li><li class=\"ql-indent-1\">The tables are listed in the text, given serial numbers and their titles written on the top while explanatory notes written below the table.</li></ul><ol><li>The sources and references of the research shall be indexed at the end of the research as per the alphabetic order with a distinction between Arabic and English resources.</li><li>Upon the acceptance of research, the researcher shall translate the Arabic resources at the end of the research in English language (Roman script)</li></ol><p class=\"ql-align-justify\">&nbsp;</p><h4 class=\"ql-align-justify\"><strong>Third Research Submission Procedures:</strong></h4><p class=\"ql-align-justify\">&nbsp;</p><ul><li>Research papers shall be sent electronically via email to the journal’s email address at:&nbsp;<a href=\"mailto:editor@mashurajournal.com\" target=\"_blank\" style=\"color: var(--primary-color);\">editor@mashurajournal.com</a></li><li>The editorial board of the journal shall conduct the initial examination of the research, and then decide whether it is competent for review or rejection.</li><li>The researches and studies submitted for publication in the Journal shall be reviewed by at least two reviewers.</li><li>The research shall be returned to the researchers after review for the purpose of amendment, if necessary.</li><li>If the research is accepted for publication, all the copyrights shall be reserved by the journal and may not be published by any means of paper or electronic publishing, except with the written permission by the editor in chief of the journal.</li><li>The accepted research shall be published as per the policies mentioned on the official website of the journal.</li><li>Once the research is published, the researcher will be provided with a letter of gratitude along with an electronic copy of the journal in which the research has been published.</li></ul><p class=\"ql-align-justify\">&nbsp;</p><p><br></p>',NULL,'2022-01-12 05:40:17'),(6,'ar_terms_and_conditions','<h4>This is test</h4>',NULL,'2021-11-23 12:08:47'),(7,'ar_privacy_and_policy','<ul><li>سياسة الخصوصية الأولى يمكن أن تكون الفقرة العشوائية طريقة ممتازة للكاتب لمعالجة كتلة الكتاب. غالبًا ما تحدث كتلة الكتابة بسبب تعثرها في مشروع حالي يحاول الكاتب إكماله.</li><li>سياسة الخصوصية الثانية يمكن أن تكون الفقرة العشوائية طريقة ممتازة للكاتب لمعالجة كتلة الكتاب. غالبًا ما تحدث كتلة الكتابة بسبب تعثرها في مشروع حالي يحاول الكاتب إكماله.</li></ul>',NULL,'2022-01-17 05:31:36'),(8,'ar_about_us','<p class=\"ql-align-justify\"><strong>Research&nbsp;Submission</strong></p><p class=\"ql-align-justify\">Researchers must review the publishing standards before submitting the search.</p><p class=\"ql-align-justify\">Submitting the research is considered as a consent and acceptance by the researcher for the publishing rules of the journal.</p><p class=\"ql-align-justify\">The article can be submitted either by direct submission on the journal’s website or by sending it to the journal’s email:<span style=\"color: rgb(0, 0, 255);\">&nbsp;</span><a href=\"mailto:editor@mahurajournal.com\" target=\"_blank\" style=\"color: rgb(0, 0, 255);\">editor@mahurajournal.com</a></p><p class=\"ql-align-justify\">All personal information of the researcher must be provided.</p><p class=\"ql-align-justify\"><strong>&nbsp;</strong></p><p class=\"ql-align-justify\"><strong>Declaration</strong></p><p class=\"ql-align-justify\"><a href=\"https://drive.google.com/file/d/1tnKon3wOVTdpHBxiG5-0a4-j_FFmszCC/view?usp=sharing\" target=\"_blank\" style=\"color: rgb(255, 0, 0);\"><strong>Policy Acceptance</strong></a></p><p class=\"ql-align-justify\">Right-click and select “Save Link As” to download the form</p><p class=\"ql-align-justify\">Author’s information form</p><p class=\"ql-align-justify\"><a href=\"https://drive.google.com/file/d/1yu6hCDZHEHPtmfqzz8O1-5UclilypleT/view?usp=sharing\" target=\"_blank\" style=\"color: rgb(255, 0, 0);\"><strong>English</strong>&nbsp;</a>/&nbsp;<a href=\"https://drive.google.com/file/d/1C8brk8z6LMU6TZXXYd2qIQ1d8pb28uuV/view?usp=sharing\" target=\"_blank\" style=\"color: rgb(255, 0, 0);\"><strong>Arabic&nbsp;</strong>&nbsp;</a>Right click and select “Save Link As” to download the form</p><p class=\"ql-align-justify\"><strong>Publishing Domains</strong></p><p class=\"ql-align-justify\">The journal accepts the submissions for publication in the below areas and their sub divisions, which are not limited to the following:</p><ul><li>Fundamentals of Islamic Finance</li><li>Fundamentals of Shari’ah</li><li>Islamic banking</li><li>Islamic capital markets</li><li>Islamic money markets</li><li>Islamic insurance (Takaful)</li><li>Basics of jurisprudence and Shari’ah and their modern application in the field of finance</li><li>Corporate governance in Islamic perspective</li><li>Social responsibility in Islamic perspective</li><li>Shari’ah compliant investments</li><li>Shari’ah compliant risk management</li><li>Islamic derivatives</li><li>Shari’ah compliant sukuk, shares and funds</li><li>Shari’ah compliant capital partnership</li><li>Shari’ah application in light of modern finance</li><li>Islamic finance and financial systems</li><li>Shari’ah compliant wealth management</li><li>Islamic Accounting</li><li>Shari’ah Auditing</li><li>Scientific reports published by conferences, seminars and workshops related to Economics</li><li>Research and studies in the behavioural economics and ethics</li><li>Studies in the field of economic regulation</li><li>Economic review and critiques of academic dissertations: Master’s thesis and PhD researches related to the journal’s specialization</li></ul><p class=\"ql-align-justify\">&nbsp;</p><p class=\"ql-align-justify\"><strong>Publishing Policies</strong></p><p class=\"ql-align-justify\"><strong>&nbsp;</strong></p><p class=\"ql-align-justify\"><strong>First: General Publishing Conditions:</strong></p><p class=\"ql-align-justify\">&nbsp;</p><ul><li>The Journal publishes should be articles related to Islamic economics and finance in both Arabic and English, whether original researches, reports and proceedings of conferences, seminars, workshops or thesis proposals related to the field of specialization.</li><li>The journal shall publish researches that have never been published before, by any means of publication, not been submitted for publication in another journal. The researcher shall confirm the same in a written undertaking.</li><li>The researches submitted to the journal cannot be recalled whether published or not published.</li><li>The research shall not be published elsewhere after it has been approved for publication/published in the journal, except after obtaining a written permission from the editor in chief.</li><li>In the event, the researcher is found to be in breach of the academic integrity, the journal reserves the right to take necessary action and notify the same to the co-journals.</li><li>The journal shall not be required to detail the reasons in case of the research was not published.</li><li>The editorial board reserves the right to undertake structural changes on the research in line with the publication policy of the journal.</li><li>The journal does not charge any fee for publishing, neither it pays any monetary gratuity for the papers selected for publication except in case of the papers written on a special request by the journal.</li></ul><p class=\"ql-align-justify\">&nbsp;</p><p class=\"ql-align-justify\"><strong>Second: Specific Publishing Conditions:</strong></p><p class=\"ql-align-justify\">&nbsp;</p><ol><li>The researcher should adhere to the objectives and ethical values of scientific researches, including but not limited to:</li></ol><ul><li class=\"ql-indent-1\">The originality and integrity of the research paper, both scientifically and intellectually.</li><li class=\"ql-indent-1\">Refraining from offending individuals and institutions while undertaking scientific criticism in research.</li><li class=\"ql-indent-1\">Addressing contemporary issues and that are in need for human realism in theoretical and applied spectrums.</li><li class=\"ql-indent-1\">Ensuring the adherence to the objectivity without influence of any personal tendencies and trends.</li></ul><ol><li>The manuscript should meet the following scientific standards for presenting research:</li></ol><ul><li class=\"ql-indent-1\">The linguistic accuracy free from linguistic and grammatical errors.</li><li class=\"ql-indent-1\">Proper application of the punctuation and spelling rules.</li><li class=\"ql-indent-1\">Accuracy in editing and citing the texts and references.</li></ul><ol><li>The number of pages of the research paper should not exceed (30) pages of normal (A4) size, including the summaries: Arabic and English, as well as the references and annexure.</li><li>Font size and type:</li></ol><ul><li class=\"ql-indent-1\">Researches submitted in Arabic should be submitted in Traditional Arabic font: size (16), with margin line (12).</li><li class=\"ql-indent-1\">Researches written in English should be submitted in (Times New Roman) font and size of (14), with the margin of (10).</li></ul><ol><li>The research should be accompanied by an abstract in both Arabic and English, in no more than 300 words in a clear language. The abstract should include: Topic of the research, its objectives, significant findings, additional recommendations, and the keywords.</li><li>The research should be divided and organized according to the requirements of the research method in order to maintain the styles of the researches and reports published in the journal as following:</li></ol><ul><li class=\"ql-indent-1\">The introduction which shall includes: the research’s subject, significance, problem, limitations, objectives, methodology, literature review (if any), and research structure.</li><li class=\"ql-indent-1\">The research contents should be divided into subtopics systematically and coherently.</li><li class=\"ql-indent-1\">Ensure that a specific idea is presented in each section to avoid prolonged paragraphs and sub-headings.</li><li class=\"ql-indent-1\">Conclusion should summarize the research and give a comprehensive outlook including the most important (results) and (recommendations).</li><li class=\"ql-indent-1\">List of sources, references and annexes.</li></ul><ol><li>The citation method should be applied as follows:</li></ol><ul><li class=\"ql-indent-1\">Researches in English language shall use (MLA) methodology for in text and bibliographic citations.</li><li>Researches in Arabic Language shall adopt the below methodology for citing the sources and references:</li></ul><ol><li class=\"ql-indent-2\">The sources and references in the footnote for the first time are mentioned as follows: (Author’s nickname, first name, source material, place of publication, publisher, edition number, publication date, volume and page)</li><li class=\"ql-indent-1\">The source and reference are mentioned when recurred in the next foot note directly (ibid., volume and page) and when mentioned in another place of the research (the author’s nickname, name of the source, the volume and the page).</li></ol><ul><li>If the reference is lacking some data, the abbreviations shall be as follows:</li></ul><ol><li class=\"ql-indent-2\">Without the place of publication: (N.P). Without the name of the publisher (N.p)</li><li class=\"ql-indent-1\">Without edition number: (n.e) Without publication date: (n.d)</li><li>The Qur’anic aayath should be written, not to be copied from some electronic source, name of the Surah and number of the Aayath shall be mentioned in footnote.</li><li>While quoting the source of Hadith of messenger peace be upon him, the complete description of Hadith verification, in terms of the chapter, section and the number of Hadith shall be mentioned.</li><li>While quoting something from internet, the last retrieval date shall be mentioned. Footnotes are placed at the bottom of each page with sequential numbering from the beginning of the research to the end.</li><li>Graphics, data, tables, etc., to be placed as follows:</li></ol><ul><li class=\"ql-indent-1\">Graphs and illustrations are included in the text, in black and white colours, numbered sequentially, and their titles and annotations are written at the bottom.</li><li class=\"ql-indent-1\">The tables are listed in the text, given serial numbers and their titles written on the top while explanatory notes written below the table.</li></ul><ol><li>The sources and references of the research shall be indexed at the end of the research as per the alphabetic order with a distinction between Arabic and English resources.</li><li>Upon the acceptance of research, the researcher shall translate the Arabic resources at the end of the research in English language (Roman script)</li><li>&nbsp;</li></ol><p class=\"ql-align-justify\">&nbsp;</p><p class=\"ql-align-justify\"><strong>Third: Research Submission Procedures</strong></p><p class=\"ql-align-justify\">&nbsp;</p><ul><li>Research papers shall be sent electronically via email to the journal’s email address at:&nbsp;<a href=\"mailto:editor@mashurajournal.com\" target=\"_blank\" style=\"color: var(--primary-color);\">editor@mashurajournal.com</a></li><li>The editorial board of the journal shall conduct the initial examination of the research, and then decide whether it is competent for review or rejection.</li><li>The researches and studies submitted for publication in the Journal shall be reviewed by at least two reviewers.</li><li>The research shall be returned to the researchers after review for the purpose of amendment, if necessary.</li><li>If the research is accepted for publication, all the copyrights shall be reserved by the journal and may not be published by any means of paper or electronic publishing, except with the written permission by the editor in chief of the journal.</li><li>The accepted research shall be published as per the policies mentioned on the official website of the journal.</li><li>Once the research is published, the researcher will be provided with a letter of gratitude along with an electronic copy of the journal in which the research has been published.</li></ul><p class=\"ql-align-justify\">&nbsp;</p><p><br></p>',NULL,'2021-11-23 04:05:54'),(9,'ar_publication_ethics','<p><strong>أخلاقيات النشر :</strong></p><p>يقوم كل واحد من المؤلفين الذين يقدّمون أعمالهم إلى المجلة للنشر كبحوث أصيلة بالتعهد بأن الأعمال المقدمة هي عبارة عن إسهاماته الأصيلة وليست انتحالًا&nbsp;بشكل كلي أو جزئي من أعمال الآخرين.&nbsp;</p><p>تخضع المجلة لمبادئ السلوك وتعليمات الممارسات المثلى للمحررين</p><p><a href=\"http://publicationethics.org/files/Code_of_conduct_for_journal_editors_Mar11.pdf\" target=\"_blank\" style=\"color: rgb(5, 99, 193);\"><em><u>CODE OF CONDUCT AND BEST PRACTICE GUIDELINES FOR JOURNAL EDITORS</u></em></a>&nbsp;</p><p>كما أنها تخضع لتعليمات أخلاقية&nbsp;COPE&nbsp;للمحكّمين&nbsp;<a href=\"https://publicationethics.org/\" target=\"_blank\" style=\"color: rgb(5, 99, 193);\"><em><u>COPE&nbsp;Ethical&nbsp;Guidelines for Peer Reviewers</u></em></a>.</p><p class=\"ql-align-justify\"><br></p><p class=\"ql-align-justify\"><strong>مهام التحرير:</strong></p><p class=\"ql-align-justify\"><strong>-&nbsp;</strong>الإشراف على المجلة ومتابعتها من حيث جودة المحتوى المنشور وأعمال لجان التحكيم، والسعي الدائم لتحقيق أهداف المجلة وتطويرها.</p><p class=\"ql-align-justify\"><strong>-&nbsp;</strong>الإسهام في تحقيق رؤية ورسالة المجلة وأهدافها.</p><p class=\"ql-align-justify\"><strong>-&nbsp;</strong>التأكد من&nbsp;تخصصات البحوث التي تنشر في المجلة.</p><p class=\"ql-align-justify\"><strong>-&nbsp;</strong>المشاركة في ترشيح المحكمين للأبحاث العلمية التي سيتم نشرها في المجلة.</p><p class=\"ql-align-justify\"><strong>-&nbsp;</strong>الاطلاع على نتائج التحكيم ومناقشة النتائج.</p><p class=\"ql-align-justify\"><strong>-&nbsp;</strong>المشاركة في اتخاذ القرارات المتعلقة بقبول نشر الأبحاث في المجلة.</p><p class=\"ql-align-justify\"><strong>-&nbsp;</strong>ضمان جودة المخرجات البحثية المنشورة والتزامها&nbsp;بقواعد النشر وشروطه.</p><p class=\"ql-align-justify\"><strong>-&nbsp;</strong>ضمان جِدّة وأصالة المحتوى البحثي المنشور في المجلة.</p><p class=\"ql-align-justify\"><strong>-&nbsp;</strong>مراجعة شروط النشر وأسلوب التوثيق وتحديثها دوريًا.</p><p class=\"ql-align-justify\"><strong>مهام المراجعين والمحكمين:</strong></p><p><strong>-&nbsp;</strong>يلتزم المحكم بالحفاظ على سرية بيانات البحث واحترام ملكية الأفكار المطروحة فيه.</p><p><strong>-&nbsp;</strong>النظر في المخطوطات ومراجعتها وتقييمها.</p><p><strong>-&nbsp;</strong>تقديم المساعدة لفريق التحرير في اتخاذ القرار المناسب المتعلق بقبول البحث.</p><p><strong>-&nbsp;</strong>تقديم الملاحظات العلمية والفنية على البحث بكل موضوعية لتجويده والرفع من كفاءته العلمية.</p><p class=\"ql-align-justify\"><strong>-&nbsp;</strong>التأكد من التزام الباحث بالمنهجية العلمية لكتابة الأبحاث، والتزامه بمعايير النشر المعتمدة في المجلة.</p><p class=\"ql-align-justify\"><strong>-&nbsp;</strong>على المُراجعين والمحكمين الإفصاح عن أي تضارب في المصالح ناتج عن علاقات مع أي من المؤلفين أو الشركات أو المؤسسات المرتبطة بالأورق البحثية التي لديهم.</p><p class=\"ql-align-justify\"><br></p><p class=\"ql-align-justify\"><strong>مهام المؤلفين: </strong></p><p class=\"ql-align-justify\"><span style=\"color: rgb(51, 51, 51);\">&nbsp;</span>- الالتزام بمبادئ ومعايير أخلاقيات البحث والنشر.</p><p class=\"ql-align-justify\">- الحرص على تقديم أبحاث أصلية خالصة،&nbsp;وتوفير قائمة بالمصادر والمراجع&nbsp;التي تم الرجوع إليها في البحث.</p><p class=\"ql-align-justify\">- الالتزام بقواعد الاقتباس والتوثيق وأخلاقيات النّشر.</p><p class=\"ql-align-justify\">- الحرص على أصالة البحث وأنه لم يسبق نشره في مجلات أخرى.</p><p class=\"ql-align-justify\">- ذكره جهود الآخرين أو المساهمين معه في بحثه وأخذ موافقات مسبقة منهم.</p><p class=\"ql-align-justify\">- الإفصاح عن أي تضارب مصالح قد يؤثر على تقييم البحث المقدم للنشر.</p><p class=\"ql-align-justify\">- عدم تقديم البحث لأكثر من جهة لنشره.</p><p class=\"ql-align-justify\">- الابتعاد عن جميع أنواع السلوك&nbsp;غير الأخلاقي مثل الانتحال والتزوير.</p><p class=\"ql-align-justify\">- على الباحث مراجعة بحثه وفقًا لمقترحات المحکمين، وفي حالة&nbsp;عدم موافقة الباحث على الأخذ بالتعديلات المقترحة؛ يجب عليه تقديم تبرير منطقيّ بذلك،&nbsp;وفي حالة عدم تقديم أسباب مقنعة تحتفظ المجلة بالحق في رفض النشر.</p><p class=\"ql-align-justify\"><br></p><p><br></p><p><br></p><p><strong>سياسات&nbsp;المجلة لقيام المؤلف بإحداث تغييرات على البحث:</strong></p><p class=\"ql-align-justify\">·&nbsp;يحق للباحث إجراء الإضافات والتوضيحات والتصحيحات اللازمة وبيان الأخطاء إن وجدت في البحث بعد نشره وذلك بإخطار هيئة التحرير وموافقتها.</p><p class=\"ql-align-justify\">·&nbsp;يحق للباحث طلب سحب بحثه بعد تقديم طلب خطي وتوضيح الأسباب الداعية لذلك، ولهيئة التحرير القرار النهائي.</p><p class=\"ql-align-justify\">·&nbsp;يحق لهيئة التحرير إزالة البحث من موقع المجلة في حالة ثبوت الانتحال والسرقة العلمية، أو ثبوت نشره سابقًا في مجلة أخرى، أو&nbsp;إخلاله&nbsp;بشروط&nbsp;وسياسات&nbsp;المجلة.</p><p class=\"ql-align-justify\"><br></p><p class=\"ql-align-justify\"><br></p><p><br></p>',NULL,'2022-01-25 09:21:28'),(10,'ar_for_author','<h4>تقديم البحث</h4><p><br></p><p>يجب على الباحثين مراجعة معايير النشر قبل تقديم البحث.</p><p><br></p><p>يعتبر تقديم البحث موافقة وقبول من الباحث لقواعد نشر المجلة.</p><p><br></p><p>يمكن إرسال المقال إما عن طريق الإرسال المباشر على موقع المجلة الإلكتروني أو بإرساله إلى البريد الإلكتروني للمجلة: editor@mahurajournal.com</p><p><br></p><p>يجب تقديم جميع المعلومات الشخصية للباحث.</p><p><br></p><p>&nbsp;</p><p><br></p><h4>تصريح</h4><p><br></p><p>قبول السياسة</p><p><br></p><p>انقر بزر الماوس الأيمن وحدد \"حفظ الارتباط باسم\" لتنزيل النموذج</p><p><br></p><p>نموذج معلومات المؤلف</p><p><br></p><p>الإنجليزية / العربية انقر بزر الماوس الأيمن واختر \"حفظ الرابط باسم\" لتنزيل النموذج</p><p><br></p><h4>مجالات النشر</h4><p><br></p><p>تقبل المجلة الطلبات للنشر في المجالات التالية وأقسامها الفرعية ، والتي لا تقتصر على ما يلي:</p><p><br></p><p>أساسيات التمويل الإسلامي</p><p>أصول الشريعة</p><p>الخدمات المصرفية الإسلامية</p><p>أسواق رأس المال الإسلامية</p><p>أسواق المال الإسلامية</p><p>التأمين الإسلامي (تكافل)</p><p>أصول الفقه والشريعة وتطبيقهما الحديث في مجال التمويل</p><p>حوكمة الشركات من منظور إسلامي</p><p>المسؤولية الاجتماعية من منظور إسلامي</p><p>استثمارات متوافقة مع الشريعة الإسلامية</p><p>إدارة المخاطر المتوافقة مع الشريعة الإسلامية</p><p>المشتقات الإسلامية</p><p>الصكوك والأسهم والصناديق المتوافقة مع الشريعة الإسلامية</p><p>شراكة رأس المال المتوافقة مع الشريعة الإسلامية</p><p>تطبيق الشريعة في ظل التمويل الحديث</p><p>التمويل الإسلامي والأنظمة المالية</p><p>إدارة الثروات المتوافقة مع الشريعة الإسلامية</p><p>محاسبة اسلامية</p><p>التدقيق الشرعي</p><p>التقارير العلمية الصادرة عن المؤتمرات والندوات وورش العمل المتعلقة بالاقتصاد</p><p>بحوث ودراسات في علم الاقتصاد السلوكي والأخلاق</p><p>دراسات في مجال التنظيم الاقتصادي</p><p>المراجعة الاقتصادية والنقد للرسائل الأكاديمية: رسائل الماجستير وأبحاث الدكتوراه المتعلقة بتخصص المجلة</p><p>&nbsp;</p><p><br></p><h4>سياسات النشر</h4><p><br></p><p>&nbsp;</p><p><br></p><h4>أولاً شروط النشر العامة:</h4><p><br></p><p>&nbsp;</p><p><br></p><p>يجب أن تكون إصدارات المجلة من المقالات المتعلقة بالاقتصاد والتمويل الإسلامي باللغتين العربية والإنجليزية ، سواء كانت أبحاث أصلية أو تقارير ووقائع المؤتمرات أو الندوات أو ورش العمل أو مقترحات الأطروحات المتعلقة بمجال التخصص.</p><p>تنشر المجلة البحوث التي لم يسبق نشرها من قبل بأية وسيلة من وسائل النشر ولم تعرض للنشر في مجلة أخرى. ويثبت ذلك الباحث في تعهد كتابي.</p><p>لا يمكن استرجاع البحوث المقدمة للمجلة سواء نشرت أم لم تنشر.</p><p>لا يجوز نشر البحث في مكان آخر بعد الموافقة على نشره / نشره في المجلة إلا بعد الحصول على إذن كتابي من رئيس التحرير.</p><p>في حالة اكتشاف أن الباحث انتهك النزاهة الأكاديمية ، تحتفظ المجلة بالحق في اتخاذ الإجراءات اللازمة وإخطار المجلات المشتركة بذلك.</p><p>لا يطلب من المجلة تفصيل الأسباب في حالة عدم نشر البحث.</p><p>تحتفظ هيئة التحرير بالحق في إجراء تغييرات هيكلية على البحث بما يتماشى مع سياسة النشر للمجلة.</p><p>لا تتقاضى المجلة أي رسوم للنشر ، كما أنها تدفع أي مكافأة مالية للأوراق المختارة للنشر إلا في حالة الأوراق المكتوبة بناءً على طلب خاص من المجلة.</p><p>&nbsp;</p><p><br></p><h4>ثانيًا شروط النشر الخاصة:</h4><p><br></p><p>&nbsp;</p><p><br></p><p>يجب على الباحث الالتزام بالأهداف والقيم الأخلاقية للبحث العلمي ، بما في ذلك على سبيل المثال لا الحصر:</p><p>أصالة الورقة البحثية وسلامتها علميا وفكريا.</p><p>الامتناع عن الإساءة للأفراد والمؤسسات أثناء النقد العلمي في البحث.</p><p>معالجة القضايا المعاصرة والمطلوبة للواقعية البشرية في الأطياف النظرية والتطبيقية.</p><p>التأكد من الالتزام بالموضوعية دون التأثير على الميول والتوجهات الشخصية.</p><p>يجب أن تستوفي المخطوطة المعايير العلمية التالية لتقديم البحث:</p><p>الدقة اللغوية الخالية من الأخطاء اللغوية والنحوية.</p><p>التطبيق الصحيح لعلامات الترقيم والهجاء.</p><p>الدقة في تحرير النصوص والمراجع والاقتباس منها.</p><p>أن لا يزيد عدد صفحات البحث عن (30) صفحة بالحجم العادي (A4) متضمنة الملخصات باللغتين العربية والإنجليزية والمراجع والملحق.</p><p>حجم الخط ونوعه:</p><p>تقدم البحوث باللغة العربية بخط عربي تقليدي حجم (16) مع خط الهامش (12).</p><p>تقدم البحوث المكتوبة باللغة الإنجليزية بخط (Times New Roman) وحجم (14) وبهامش (10).</p><p>أن يكون البحث مصحوبا بملخص باللغتين العربية والإنجليزية بما لا يزيد عن 300 كلمة بلغة واضحة. يجب أن يتضمن الملخص: موضوع البحث ، وأهدافه ، والنتائج المهمة ، والتوصيات الإضافية ، والكلمات الرئيسية.</p><p>يجب تقسيم البحث وتنظيمه حسب متطلبات أسلوب البحث حفاظا على أنماط البحوث والتقارير المنشورة في المجلة على النحو التالي:</p><p>المقدمة والتي يجب أن تشمل:</p><p>موضوع البحث وأهميته ومشكلته وحدوده وأهدافه ومنهجيته ومراجعة الأدبيات (إن وجدت) وهيكل البحث.</p><p>يجب تقسيم محتويات البحث إلى مواضيع فرعية بشكل منهجي ومتماسك.</p><p>تأكد من تقديم فكرة محددة في كل قسم لتجنب الفقرات الطويلة والعناوين الفرعية.</p><p>يجب أن تلخص الخاتمة البحث وتعطي نظرة شاملة تتضمن أهم (النتائج) و (التوصيات).</p><p>قائمة المصادر والمراجع والملاحق.</p><p>يجب تطبيق طريقة الاقتباس على النحو التالي:</p><p>يجب أن تستخدم الأبحاث باللغة الإنجليزية منهجية (MLA) في الاستشهادات النصية والببليوغرافية.</p><p>تعتمد الأبحاث باللغة العربية المنهجية التالية في الاستشهاد بالمصادر والمراجع:</p><p>تم ذكر المصادر والمراجع في الحاشية السفلية لأول مرة على النحو التالي: (كنية المؤلف ، الاسم الأول ، المادة المصدر ، مكان النشر ، الناشر ، رقم الإصدار ، تاريخ النشر ، المجلد والصفحة)</p><p>يتم ذكر المصدر والمرجع عند التكرار في الحاشية السفلية التالية مباشرة (المرجع نفسه ، المجلد والصفحة) وعند ذكرهما في مكان آخر من البحث (لقب المؤلف واسم المصدر والمجلد والصفحة).</p><p>إذا كان المرجع ينقصه بعض البيانات ، تكون الاختصارات على النحو التالي:</p><p>بدون مكان النشر: (NP). بدون اسم الناشر (N.p)</p><p>بدون رقم الطبعة: (غير مذكورة) بدون تاريخ النشر: (بدون تاريخ)</p><p>يجب كتابة الآية القرآنية ، وليس نسخها من مصدر إلكتروني ، ويجب ذكر اسم السورة ورقم الآية في الحاشية.</p><p>يذكر مع ذكر مصدر حديث الرسول صلى الله عليه وسلم الوصف الكامل لتحقق الحديث من باب ومقطع وعدد الحديث.</p><p>أثناء الاقتباس من شيء ما من الإنترنت ، يجب ذكر تاريخ الاسترجاع الأخير. توضع الحواشي في أسفل كل صفحة مع ترقيم تسلسلي من بداية البحث حتى النهاية.</p><p>يتم وضع الرسومات والبيانات والجداول وغيرها على النحو التالي:</p><p>يتم تضمين الرسوم البيانية والرسوم التوضيحية في النص ، باللونين الأسود والأبيض ، مرقمة بالتسلسل ، وعناوينها وشروحها مكتوبة في الأسفل.</p><p>يتم سرد الجداول في النص ، مع إعطاء الأرقام التسلسلية وعناوينها مكتوبة في الأعلى بينما الملاحظات التوضيحية مكتوبة أسفل الجدول.</p><p>تُفهرس مصادر ومراجع البحث في نهاية البحث حسب الترتيب الأبجدي مع التمييز بين المصادر العربية والإنجليزية.</p><p>عند قبول البحث يترجم الباحث المصادر العربية في نهاية البحث إلى اللغة الإنجليزية (نص روماني).</p><p>&nbsp;</p><p>&nbsp;</p><p><br></p><h4>ثالثاً إجراءات تقديم البحث:</h4><p><br></p><p>&nbsp;</p><p><br></p><p>تُرسل الأوراق البحثية إلكترونيًا عبر البريد الإلكتروني إلى عنوان البريد الإلكتروني للمجلة على: editor@mashurajournal.com</p><p>تقوم هيئة تحرير المجلة بإجراء الفحص الأولي للبحث ، ثم تقرر ما إذا كانت مختصة بالمراجعة أو الرفض.</p><p>تتم مراجعة البحوث والدراسات المقدمة للنشر في المجلة من قبل اثنين على الأقل من المراجعين.</p><p>يعاد البحث للباحثين بعد مراجعته لغرض التعديل إذا لزم الأمر.</p><p>إذا تم قبول البحث للنشر ، فإن جميع حقوق المؤلف محفوظة للمجلة ولا يجوز نشرها بأي وسيلة من وسائل النشر الورقية أو الإلكترونية ، إلا بإذن كتابي من رئيس تحرير المجلة.</p><p>ينشر البحث المقبول وفق السياسات المذكورة في الموقع الرسمي للمجلة.</p><p>بمجرد نشر البحث ، سيتم تزويد الباحث بخطاب شكر مع نسخة إلكترونية من المجلة التي تم نشر البحث فيها.</p>',NULL,'2022-01-12 05:41:14'),(11,'en_about_journal','This is a semiannual refereed international scientific journal for publishing researches in the fields of Islamic economics and Islamic finance. The journal aims at providing an opportunity to researchers and professionals for publishing their academic outcomes such as researches and studies in the fields of Islamic economics and Islamic finance. It also aims at spreading the knowledge of the Islamic economic and Islamic finance industry through our website making these researches and studies available to those who are interested.',NULL,'2021-11-25 09:09:17'),(12,'ar_about_journal','مجلة علمية دولية محكمة نصف سنوية تنشر البحوث في مجالات الاقتصاد الإسلامي والتمويل الإسلامي. تهدف المجلة إلى إتاحة الفرصة للباحثين والمهنيين لنشر نتائجهم الأكاديمية مثل الأبحاث والدراسات في مجالات الاقتصاد الإسلامي والتمويل الإسلامي. كما يهدف إلى نشر المعرفة بالاقتصاد الإسلامي وصناعة التمويل الإسلامي من خلال موقعنا على الإنترنت مما يجعل هذه الأبحاث والدراسات متاحة للمهتمين.',NULL,'2022-01-12 08:41:21'),(13,'en_message_journal','To provide an opportunity to the researchers for get their works peer-reviewed and published in the field of Islamic finance industry. To contribute in the development of Islamic finance industry through the good quality scientific researches. To present the Islamic finance under the Shari’ah premises in a contemporary perception.',NULL,'2021-11-25 09:09:17'),(14,'ar_message_journal','إتاحة الفرصة للباحثين لمراجعة أعمالهم ونشرها في مجال صناعة التمويل الإسلامي. المساهمة في تطوير صناعة التمويل الإسلامي من خلال البحث العلمي الجيد. لتقديم التمويل الإسلامي في إطار مبادئ الشريعة في تصور معاصر.',NULL,'2022-01-12 08:41:21'),(15,'en_goal_journal','- To provide an opportunity to the researchers for get their works peer-reviewed and published in the field of Islamic finance industry.\r\n- To contribute in the development of Islamic finance industry through the good quality scientific researches.\r\n- To present the Islamic finance under the Shari’ah premises in a contemporary perception.\r\n- Establishment of Database that achieve the scientific reference of the Journal so that it is a documentary record of research and studies in the field of the Islamic financial industry.',NULL,'2021-11-25 09:09:17'),(16,'ar_goal_journal','- إتاحة الفرصة للباحثين لمراجعة أعمالهم ونشرها في مجال صناعة التمويل الإسلامي.\r\n- المساهمة في تطوير صناعة التمويل الإسلامي من خلال البحث العلمي الجيد.\r\n- تقديم التمويل الإسلامي وفق مقومات الشريعة في تصور معاصر.\r\n- إنشاء قاعدة بيانات تحقق المرجع العلمي للمجلة بحيث تكون سجلاً وثائقيًا للبحوث والدراسات في مجال الصناعة المالية الإسلامية.',NULL,'2022-01-12 08:41:21'),(17,'en_vision_journal','To be a leading, scientific and international journal in the field of Islamic finance industry. Message To publish the scientific researches in the field of Islamic finance industry in pursuant to the accredited global standards.',NULL,'2021-11-25 09:09:17'),(18,'ar_vision_journal','أن تكون مجلة علمية وعلمية وعالمية رائدة في مجال صناعة التمويل الإسلامي. الرسالة: نشر البحوث العلمية في مجال صناعة التمويل الإسلامي وفق المعايير العالمية المعتمدة.',NULL,'2022-01-12 08:41:21'),(19,'en_values','- To provide an opportunity to the researchers for get their works peer-reviewed and published in the field of Islamic finance industry.\r\n- To contribute in the development of Islamic finance industry through the good quality scientific researches.\r\n- To present the Islamic finance under the Shari’ah premises in a contemporary perception.\r\n- Establishment of Database that achieve the scientific reference of the Journal so that it is a documentary record of research and studies in the field of the Islamic financial industry.','2022-02-01 09:17:35','2022-02-01 09:22:13'),(20,'ar_values','- إتاحة الفرصة للباحثين لمراجعة أعمالهم ونشرها في مجال صناعة التمويل الإسلامي.\r\n- المساهمة في تطوير صناعة التمويل الإسلامي من خلال البحث العلمي الجيد.\r\n- تقديم التمويل الإسلامي وفق مقومات الشريعة في تصور معاصر.\r\n- إنشاء قاعدة بيانات تحقق المرجع العلمي للمجلة بحيث تكون سجلاً وثائقيًا للبحوث والدراسات في مجال الصناعة المالية الإسلامية.','2022-02-01 09:17:35','2022-02-01 09:22:13');
/*!40000 ALTER TABLE `pages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `products` (
  `id` int(50) NOT NULL AUTO_INCREMENT,
  `user_id` int(20) NOT NULL,
  `color_id` int(20) NOT NULL,
  `product_name` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `original_price` int(20) NOT NULL,
  `seller_price` int(20) NOT NULL,
  `discount_price` int(20) NOT NULL,
  `qty` tinyint(20) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT NULL ON UPDATE current_timestamp(),
  `deleted_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sub_category`
--

DROP TABLE IF EXISTS `sub_category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sub_category` (
  `id` int(20) NOT NULL AUTO_INCREMENT,
  `category_id` int(20) NOT NULL,
  `subcat_name` varchar(255) NOT NULL,
  `status` tinyint(2) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT NULL ON UPDATE current_timestamp(),
  `deleted_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sub_category`
--

LOCK TABLES `sub_category` WRITE;
/*!40000 ALTER TABLE `sub_category` DISABLE KEYS */;
/*!40000 ALTER TABLE `sub_category` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_address`
--

DROP TABLE IF EXISTS `user_address`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user_address` (
  `id` int(50) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `address` text NOT NULL,
  `tags` int(11) DEFAULT NULL COMMENT '1:Home,2:Work,3:Other',
  `status` tinyint(2) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT NULL ON UPDATE current_timestamp(),
  `deleted_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_address`
--

LOCK TABLES `user_address` WRITE;
/*!40000 ALTER TABLE `user_address` DISABLE KEYS */;
/*!40000 ALTER TABLE `user_address` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_groups`
--

DROP TABLE IF EXISTS `user_groups`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user_groups` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) unsigned NOT NULL,
  `group_id` bigint(20) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_groups`
--

LOCK TABLES `user_groups` WRITE;
/*!40000 ALTER TABLE `user_groups` DISABLE KEYS */;
INSERT INTO `user_groups` VALUES (1,1,1),(2,2,1);
/*!40000 ALTER TABLE `user_groups` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_referral_codes`
--

DROP TABLE IF EXISTS `user_referral_codes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user_referral_codes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(20) NOT NULL,
  `referral_code` text DEFAULT NULL,
  `discount_code` text DEFAULT NULL,
  `used_flag_for_invitee` tinyint(4) NOT NULL DEFAULT 0,
  `used_flag_for_invited_user` tinyint(4) NOT NULL DEFAULT 0,
  `status` tinyint(4) NOT NULL DEFAULT 1,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT NULL ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_referral_codes`
--

LOCK TABLES `user_referral_codes` WRITE;
/*!40000 ALTER TABLE `user_referral_codes` DISABLE KEYS */;
/*!40000 ALTER TABLE `user_referral_codes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `ip_address` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_referral_code` text COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `first_name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `last_name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `gender` tinyint(2) DEFAULT NULL COMMENT '1:Male,2:Female',
  `profile_picture` text COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `phone` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_type` tinyint(1) NOT NULL DEFAULT 2 COMMENT '1:Admin,2:User',
  `notifications` tinyint(4) NOT NULL DEFAULT 1,
  `stripe_id` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` enum('1','0') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '1',
  `address` text COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `city` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `state` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `country` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `zip` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `lat` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `lng` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `device_type` enum('android','ios') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `device_token` longtext COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `last_login` datetime DEFAULT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `verify_url` text COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email_verified_at` datetime DEFAULT NULL,
  `phone_verified_at` datetime DEFAULT NULL,
  `remember_me_token` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT NULL ON UPDATE current_timestamp(),
  `deleted_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `users_stripe_id_index` (`stripe_id`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,NULL,NULL,'Sophia','Brown','admin1@yopmail.com',NULL,NULL,NULL,1,1,NULL,'1',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'$argon2id$v=19$t=3,m=4096,p=1$hjSyUfxhVsFfkWD0A4NkLw$fc/Q/3U3N2ir7IqGC+BXk417yBHk6wcTLCjqIJn2AEs','http://127.0.0.1:1317/admin/change-password/admin@yopmail.com?signature=eyJtZXNzYWdlIjoiL2FkbWluL2NoYW5nZS1wYXNzd29yZC9hZG1pbkB5b3BtYWlsLmNvbSIsImV4cGlyeURhdGUiOiIyMDIyLTA2LTEzVDEwOjU4OjQ0LjY5MloifQ.4b2qgBarEtvhfsk3UWWV0cyEoXmv0uObj9LmuBj-m2Q',NULL,NULL,NULL,'2022-06-09 16:31:09','2022-06-13 14:29:38',NULL),(2,NULL,NULL,'Dharitri','Panchal','dharitri.panchal@excellentwebworld.in',NULL,NULL,NULL,1,1,NULL,'1',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'$argon2id$v=19$t=3,m=4096,p=1$LYrq8GW7u3cpGz2tBLAe1A$FPr0FBBoPJPBVyuTIcsC7V1/Qkb5J+x318Mc5ollJxE','',NULL,NULL,NULL,'2022-06-09 16:31:09','2022-06-10 15:33:58',NULL),(3,NULL,NULL,'Lucifer','Morningstar','lucifer@yopmail.com',NULL,'cl48ejx2i0001ngc4bfbe5k93.jpg',NULL,2,1,NULL,'1',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'$argon2id$v=19$t=3,m=4096,p=1$hjSyUfxhVsFfkWD0A4NkLw$fc/Q/3U3N2ir7IqGC+BXk417yBHk6wcTLCjqIJn2AEs',NULL,NULL,NULL,NULL,'2022-06-09 16:31:09','2022-06-10 17:35:48',NULL),(4,NULL,NULL,'Noah','Martin','noah@yopmail.com',NULL,'cl482ho17000340c41xhocjd2.png',NULL,2,1,NULL,'1',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'','http://localhost:8000/admin/sub-admin/verify/noah@yopmail.com?signature=eyJtZXNzYWdlIjoiL2FkbWluL3N1Yi1hZG1pbi92ZXJpZnkvbm9haEB5b3BtYWlsLmNvbSJ9.96_4PXq9p9Cld2wk3gDKLIl8g51IgtOzlkf1ivgsjaE',NULL,NULL,NULL,'2022-06-09 17:26:37','2022-06-10 11:58:08',NULL),(5,NULL,NULL,'Isabella','Wilson','Isabella@yopmail.com',NULL,'cl4745ufd0009rkc47d8bauqw.png',NULL,2,1,NULL,'1',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'','http://localhost:8000/admin/sub-admin/verify/Isabella@yopmail.com?signature=eyJtZXNzYWdlIjoiL2FkbWluL3N1Yi1hZG1pbi92ZXJpZnkvSXNhYmVsbGFAeW9wbWFpbC5jb20ifQ.HBrdFxsCqKxQfR7XArHdtPcj3KtsYgaDZW3tWAQoL8Q',NULL,NULL,NULL,'2022-06-09 19:34:08','2022-06-09 19:57:09',NULL),(6,NULL,NULL,'Sophie','Garcia','sophie@yopmail.com',NULL,'cl482hbbt000140c4b2kchvzx.png',NULL,2,1,NULL,'1',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'','http://localhost:8000/admin/users/verify/sophie@yopmail.com?signature=eyJtZXNzYWdlIjoiL2FkbWluL3VzZXJzL3ZlcmlmeS9zb3BoaWVAeW9wbWFpbC5jb20ifQ.MSuqJkmrVNygVjI52n0-Q6D8wfy1zCkxOQGsElKcnmo',NULL,NULL,NULL,'2022-06-10 11:57:51','2022-06-10 12:29:08',NULL),(8,NULL,NULL,'Maria','Johnson','maria@yopmail.com',NULL,'cl483yvwl0001skc48eeyazy0.png',NULL,2,1,NULL,'1',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'',NULL,NULL,NULL,NULL,'2022-06-10 12:39:31','2022-06-10 12:39:31',NULL),(10,NULL,NULL,'dharitri','panchal','dharitripanchaleww@gmail.com',NULL,'cl4873h1j0009aoc48yum11ey.jpg',NULL,2,1,NULL,'1',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'','http://localhost:8000/admin/users/verify/dharitripanchaleww@gmail.com?signature=eyJtZXNzYWdlIjoiL2FkbWluL3VzZXJzL3ZlcmlmeS9kaGFyaXRyaXBhbmNoYWxld3dAZ21haWwuY29tIn0.QXVQg3H78kcCePPhd0pmOrrrz9nLVQEGhitIahuOu8c',NULL,NULL,NULL,'2022-06-10 12:43:38','2022-06-10 14:07:04',NULL),(12,NULL,NULL,'Travis','Wilson','travis@yopmail.com',NULL,'cl486gbe40003aoc44kjv36ct.jpg',NULL,2,1,NULL,'1',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'','http://localhost:8000/admin/users/verify/travis@yopmail.com?signature=eyJtZXNzYWdlIjoiL2FkbWluL3VzZXJzL3ZlcmlmeS90cmF2aXNAeW9wbWFpbC5jb20ifQ.nk4zTg7YI-I1lD3e94E1VthrAU0fMRcmAHuHhmfYadI',NULL,NULL,NULL,'2022-06-10 12:51:02','2022-06-10 13:49:03',NULL),(13,NULL,NULL,'David','Williams','david@yopmail.com',NULL,'cl4876c4n0001bkc47aifee2l.jpg',NULL,2,1,NULL,'1',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'','http://localhost:8000/admin/users/verify/david@yopmail.com?signature=eyJtZXNzYWdlIjoiL2FkbWluL3VzZXJzL3ZlcmlmeS9kYXZpZEB5b3BtYWlsLmNvbSJ9.WVDA-F8_DOMn1QEPEgZicp1dheQ97CxLyxRX-5F4h_o',NULL,NULL,NULL,'2022-06-10 14:09:17','2022-06-10 14:09:17',NULL);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2022-06-14 15:53:13
