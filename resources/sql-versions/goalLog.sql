-- Changing name of table F_GOAL_TRACKER to F_GOAL_LOG
DROP TABLE IF EXISTS `f_goal_tracker`;
CREATE TABLE `f_goal_log` (
  `goalLogId` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `userGoalId` bigint(20) unsigned NOT NULL,
  `logValue` int(11) DEFAULT NULL,
  `logUnit` varchar(12) DEFAULT NULL,
  `logNotes` varchar(1000) DEFAULT NULL,
  `logDate` date NOT NULL,
  PRIMARY KEY (`goalLogId`),
  KEY `userGoalId` (`userGoalId`),
  CONSTRAINT `f_goal_log_ibfk_1` FOREIGN KEY (`userGoalId`) REFERENCES `f_user_goal` (`userGoalId`)
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8;
