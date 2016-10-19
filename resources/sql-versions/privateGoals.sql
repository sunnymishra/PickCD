Alter table `f_goal` Add `isPrivateGoal` bit default 0 after goalUnit;
Alter table `f_user_goal` drop isPrivateGoal;