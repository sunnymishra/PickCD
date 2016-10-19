

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for `f_friend_request_type`
-- ----------------------------
DROP TABLE IF EXISTS `f_user_goal_status_type`;
CREATE TABLE `f_user_goal_status_type` (
  `userGoalStatusTypeId` int(5) NOT NULL,
  `userGoalStatusTypeName` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`userGoalStatusTypeId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of f_user_goal_status_type
-- ----------------------------
INSERT INTO `f_user_goal_status_type` VALUES ('1', 'PENDING_ACCEPTANCE');
INSERT INTO `f_user_goal_status_type` VALUES ('2', 'PENDING_APPROVAL');
INSERT INTO `f_user_goal_status_type` VALUES ('3', 'CONFIRMED');
INSERT INTO `f_user_goal_status_type` VALUES ('4', 'REVOKED');
INSERT INTO `f_user_goal_status_type` VALUES ('5', 'REJECTED');

-- ----------------------------
-- Table structure for `f_goal`
-- ----------------------------
DROP TABLE IF EXISTS `f_goal`;
CREATE TABLE `f_goal` (
  `goalId` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `tagId` int(11) NOT NULL,
  `goalTypeId` int(11) NOT NULL,
  `goalName` varchar(100) DEFAULT NULL,
  `goalDescription` varchar(500) DEFAULT NULL,
  `goalTargetValue` int(11) DEFAULT NULL,
  `goalUnit` varchar(12) DEFAULT NULL,
  `isPrivateGoal` bit(1) DEFAULT b'0',
  `goalMembersCount` int(10) NOT NULL DEFAULT '1',
  `createdDate` date DEFAULT NULL,
  `createdBy` bigint(20) DEFAULT NULL,
  `modifiedDate` date DEFAULT NULL,
  `modifiedBy` bigint(20) DEFAULT NULL,
  `active` bit(1) NOT NULL,
  PRIMARY KEY (`goalId`),
  KEY `tagId` (`tagId`),
  KEY `goalTypeId` (`goalTypeId`),
  CONSTRAINT `f_goal_ibfk_1` FOREIGN KEY (`tagId`) REFERENCES `f_tag` (`tagId`),
  CONSTRAINT `f_goal_ibfk_2` FOREIGN KEY (`goalTypeId`) REFERENCES `f_goal_type` (`goalTypeId`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of f_goal
-- ----------------------------
INSERT INTO `f_goal` VALUES ('1', '1', '1', 'Lose 10 KG', 'Need to lose 10 KG weight in 1 month period', '10', 'KG', '', '1', '2015-11-10', '1', null, null, '');
INSERT INTO `f_goal` VALUES ('2', '1', '1', 'Run 1KM each day', '', '1', 'KM', '', '1', '2015-11-10', '1', null, null, '');
INSERT INTO `f_goal` VALUES ('3', '2', '1', 'Finish Harry Potter last book', 'Complete 500  pages of Harry potter\'s last novel', '500', 'No', '', '1', '2015-11-10', '1', null, null, '');
INSERT INTO `f_goal` VALUES ('6', '1', '1', 'Fitness Example', 'This is a fitness example goal', '21', 'kg', '', '1', '2015-12-01', '1', null, null, '');
INSERT INTO `f_goal` VALUES ('11', '1', '1', 'Harry potter book', '', '500', 'Pages', '', '1', '2015-12-18', '12', null, null, '');
INSERT INTO `f_goal` VALUES ('12', '1', '1', 'Run 1KM each day', '', '1', 'KM', '', '1', '2015-12-19', '1', null, null, '');

-- ----------------------------
-- Table structure for `f_goal_log`
-- ----------------------------
DROP TABLE IF EXISTS `f_goal_log`;
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

-- ----------------------------
-- Records of f_goal_log
-- ----------------------------
INSERT INTO `f_goal_log` VALUES ('1', '1', '1', 'KG', 'Today was 1st day hence tiresome experience', '2015-11-18');
INSERT INTO `f_goal_log` VALUES ('2', '1', '1', 'KG', 'Today was 1st day hence tiresome experience', '2015-11-18');
INSERT INTO `f_goal_log` VALUES ('3', '1', '1', 'KG', 'Today was 1st day hence tiresome experience', '2015-11-18');
INSERT INTO `f_goal_log` VALUES ('4', '1', '2', 'KG', 'Today was 1st day hence tiresome experience', '2015-11-18');
INSERT INTO `f_goal_log` VALUES ('5', '3', '25', 'No', 'After lot of procrastination I finally hit the treadmill today and did a rigorous 30-minutes hill-walking. Meter says I burnt 300-calories :)', '2015-12-06');
INSERT INTO `f_goal_log` VALUES ('6', '3', '550', 'No', 'After lot of procrastination I finally hit the treadmill today and did a rigorous 30-minutes hill-walking. Meter says I burnt 300-calories :)', '2015-12-06');
INSERT INTO `f_goal_log` VALUES ('7', '3', '0', 'No', 'After lot of procrastination I finally hit the treadmill today and did a rigorous 30-minutes hill-walking. Meter says I burnt 300-calories :)', '2015-12-06');
INSERT INTO `f_goal_log` VALUES ('8', '3', '-10', 'No', 'After lot of procrastination I finally hit the treadmill today and did a rigorous 30-minutes hill-walking. Meter says I burnt 300-calories :)', '2015-12-06');
INSERT INTO `f_goal_log` VALUES ('9', '3', '-10', 'No', 'After lot of procrastination I finally hit the treadmill today and did a rigorous 30-minutes hill-walking. Meter says I burnt 300-calories :)', '2015-12-06');
INSERT INTO `f_goal_log` VALUES ('10', '3', '-10', 'No', 'After lot of procrastination I finally hit the treadmill today and did a rigorous 30-minutes hill-walking. Meter says I burnt 300-calories :)', '2015-12-06');
INSERT INTO `f_goal_log` VALUES ('11', '3', '-10', 'No', 'After lot of procrastination I finally hit the treadmill today and did a rigorous 30-minutes hill-walking. Meter says I burnt 300-calories :)', '2015-12-06');
INSERT INTO `f_goal_log` VALUES ('12', '3', '-10', 'No', 'After lot of procrastination I finally hit the treadmill today and did a rigorous 30-minutes hill-walking. Meter says I burnt 300-calories :)', '2015-12-06');
INSERT INTO `f_goal_log` VALUES ('13', '3', '-10', 'No', 'After lot of procrastination I finally hit the treadmill today and did a rigorous 30-minutes hill-walking. Meter says I burnt 300-calories :)', '2015-12-06');
INSERT INTO `f_goal_log` VALUES ('14', '3', '-10', 'No', 'After lot of procrastination I finally hit the treadmill today and did a rigorous 30-minutes hill-walking. Meter says I burnt 300-calories :)', '2015-12-06');
INSERT INTO `f_goal_log` VALUES ('15', '3', '-10', 'No', 'After lot of procrastination I finally hit the treadmill today and did a rigorous 30-minutes hill-walking. Meter says I burnt 300-calories :)', '2015-12-06');
INSERT INTO `f_goal_log` VALUES ('16', '3', '10', 'No', 'After lot of procrastination I finally hit the treadmill today and did a rigorous 30-minutes hill-walking. Meter says I burnt 300-calories :)', '2015-12-06');
INSERT INTO `f_goal_log` VALUES ('17', '1', '2', 'KG', 'After lot of procrastination I finally hit the treadmill today and did a rigorous 30-minutes hill-walking. Meter says I burnt 300-calories :)', '2015-11-22');
INSERT INTO `f_goal_log` VALUES ('18', '1', '2', 'KG', 'After lot of procrastination I finally hit the treadmill today and did a rigorous 30-minutes hill-walking. Meter says I burnt 300-calories :)', '2015-11-22');
INSERT INTO `f_goal_log` VALUES ('19', '1', '2', 'KG', 'After lot of procrastination I finally hit the treadmill today and did a rigorous 30-minutes hill-walking. Meter says I burnt 300-calories :)', '2015-11-22');
INSERT INTO `f_goal_log` VALUES ('20', '1', '10', 'KG', 'After lot of procrastination I finally hit the treadmill today and did a rigorous 30-minutes hill-walking. Meter says I burnt 300-calories :)', '2015-11-22');
INSERT INTO `f_goal_log` VALUES ('21', '1', '9', 'KG', 'After lot of procrastination I finally hit the treadmill today and did a rigorous 30-minutes hill-walking. Meter says I burnt 300-calories :)', '2015-11-22');
INSERT INTO `f_goal_log` VALUES ('22', '1', '9', 'KG', 'After lot of procrastination I finally hit the treadmill today and did a rigorous 30-minutes hill-walking. Meter says I burnt 300-calories :)', '2015-11-22');
INSERT INTO `f_goal_log` VALUES ('23', '1', '9', 'KG', 'After lot of procrastination I finally hit the treadmill today and did a rigorous 30-minutes hill-walking. Meter says I burnt 300-calories :)', '2015-11-22');
INSERT INTO `f_goal_log` VALUES ('24', '1', '9', 'KG', 'After lot of procrastination I finally hit the treadmill today and did a rigorous 30-minutes hill-walking. Meter says I burnt 300-calories :)', '2015-11-22');

-- ----------------------------
-- Table structure for `f_goal_type`
-- ----------------------------
DROP TABLE IF EXISTS `f_goal_type`;
CREATE TABLE `f_goal_type` (
  `goalTypeId` int(11) NOT NULL,
  `goalTypeName` varchar(100) DEFAULT NULL,
  `active` bit(1) NOT NULL,
  PRIMARY KEY (`goalTypeId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of f_goal_type
-- ----------------------------
INSERT INTO `f_goal_type` VALUES ('1', 'Target', '');
INSERT INTO `f_goal_type` VALUES ('2', 'Habit', '');
INSERT INTO `f_goal_type` VALUES ('5', 'JOIN_REQUEST_REJECTED', '');

-- ----------------------------
-- Table structure for `f_tag`
-- ----------------------------
DROP TABLE IF EXISTS `f_tag`;
CREATE TABLE `f_tag` (
  `tagId` int(11) NOT NULL,
  `tagName` varchar(50) DEFAULT NULL,
  `tagDescription` varchar(200) DEFAULT NULL,
  `createdDate` date DEFAULT NULL,
  `active` bit(1) NOT NULL,
  PRIMARY KEY (`tagId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of f_tag
-- ----------------------------
INSERT INTO `f_tag` VALUES ('1', 'Fitness', null, '2015-11-01', '');
INSERT INTO `f_tag` VALUES ('2', 'Reading', null, '2015-11-01', '');
INSERT INTO `f_tag` VALUES ('3', 'Saving Money', null, '2015-11-01', '');
INSERT INTO `f_tag` VALUES ('4', 'Sport', null, '2015-11-01', '');

-- ----------------------------
-- Table structure for `f_user`
-- ----------------------------
DROP TABLE IF EXISTS `f_user`;
CREATE TABLE `f_user` (
  `userId` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `displayName` varchar(200) DEFAULT NULL,
  `profilePicPath` varchar(500) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `city` varchar(50) DEFAULT NULL,
  `zipCode` varchar(10) DEFAULT NULL,
  `aboutMe` varchar(150) DEFAULT NULL,
  `silverCoins` int(11) DEFAULT '0',
  `goldCoins` int(11) DEFAULT '0',
  `password` varchar(200) DEFAULT NULL,
  `forgotPasswordCode` varchar(200) DEFAULT NULL,
  `isPasswordVerified` bit(1) DEFAULT NULL,
  `createdDate` date DEFAULT NULL,
  `modifiedDate` date DEFAULT NULL,
  `active` bit(1) NOT NULL,
  PRIMARY KEY (`userId`),
  UNIQUE KEY `constr_user` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of f_user
-- ----------------------------
INSERT INTO `f_user` VALUES ('1', 'Sunny', null, 'sunny@sunny.com', null, null, null, null, '0', '0', 'f04ba60a118ea37608c8f515677a1be9284708ebca64e095a446ed7a4d772abd', null, null, '2015-11-01', null, '');
INSERT INTO `f_user` VALUES ('6', 'sunny@sunny.com', null, 'sunny@sunny.com', '9999999', null, null, null, '0', '0', 'f04ba60a118ea37608c8f515677a1be9284708ebca64e095a446ed7a4d772abd', null, null, '2015-11-18', null, '');
INSERT INTO `f_user` VALUES ('12', 'Sunny1', null, 'sunny1@sunny.com', null, null, null, null, '0', '0', '2666be9d3df17f4b242f5fd0d9b929b64693faa8ef149eedb9fd5ebabd564021', null, null, '2015-11-22', null, '');
INSERT INTO `f_user` VALUES ('13', 'Sunny12', null, 'sunny12@sunny.com', null, null, null, null, '0', '0', '7a57953a3ed902b3da695f57d03518f456d9162cdb9dbb7b5fb72c41bb841bec', null, null, '2015-11-22', null, '');

-- ----------------------------
-- Table structure for `f_user_goal`
-- ----------------------------
DROP TABLE IF EXISTS `f_user_goal`;
CREATE TABLE `f_user_goal` (
  `userGoalId` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `userId` bigint(20) unsigned NOT NULL,
  `goalId` bigint(20) unsigned NOT NULL,
  `goalProgressPercent` int(11) DEFAULT NULL,
  `goalStartDate` date DEFAULT NULL,
  `goalEndDate` date DEFAULT NULL,
  `timePer` int(11) DEFAULT NULL,
  `period` varchar(1) DEFAULT NULL,
  `isGoalAchieved` bit(1) DEFAULT b'0',
  `createdDate` date DEFAULT NULL,
  `createdBy` int(11) DEFAULT NULL,
  `modifiedDate` date DEFAULT NULL,
  `modifiedBy` date DEFAULT NULL,
  `statusType` int(5) DEFAULT NULL,
  PRIMARY KEY (`userGoalId`),
  UNIQUE KEY `userId_2` (`userId`,`goalId`),
  KEY `userId` (`userId`),
  KEY `goalId` (`goalId`),
  CONSTRAINT `f_user_goal_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `f_user` (`userId`),
  CONSTRAINT `f_user_goal_ibfk_2` FOREIGN KEY (`goalId`) REFERENCES `f_goal` (`goalId`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of f_user_goal
-- ----------------------------
INSERT INTO `f_user_goal` VALUES ('1', '1', '1', '90', '2015-10-18', '2015-11-18', null, null, '', '2015-11-10', null, '2015-11-11', null, '3');
INSERT INTO `f_user_goal` VALUES ('2', '1', '2', '50', '2015-10-20', '2015-12-20', null, null, '', '2015-11-10', null, null, null, '3');
INSERT INTO `f_user_goal` VALUES ('3', '1', '3', '10', '2015-10-11', '2015-12-16', null, null, '', '2015-11-10', null, null, null, '3');
INSERT INTO `f_user_goal` VALUES ('10', '12', '1', null, '2015-10-20', '2015-12-20', null, null, '', '2015-12-16', '12', null, null, '3');
INSERT INTO `f_user_goal` VALUES ('12', '12', '11', null, '2015-10-20', '2015-12-20', null, null, '', '2015-12-18', null, null, null, '3');
INSERT INTO `f_user_goal` VALUES ('13', '1', '12', null, '2015-10-20', '2015-12-20', null, null, '', '2015-12-19', null, null, null, '3');
