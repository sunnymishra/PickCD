Alter table `f_user` Drop `browniePoints`;
Alter table `f_user` Add `goldCoins` int(11) DEFAULT 0 after `zipCode`;
Alter table `f_user` Add `silverCoins` int(11) DEFAULT 0 after `zipCode`;
Alter table `f_user` Add `aboutMe` varchar(150) DEFAULT NULL after `zipCode`;
ALTER TABLE f_user CHANGE `name` `displayName` varchar(200) DEFAULT NULL;
Alter table f_user_goal ADD UNIQUE  (`userId`, `goalId`);