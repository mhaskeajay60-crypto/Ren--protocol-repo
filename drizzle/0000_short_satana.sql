CREATE TABLE `team_invitations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`teamId` int NOT NULL,
	`inviteeEmail` varchar(320) NOT NULL,
	`role` enum('writer') NOT NULL DEFAULT 'writer',
	`defaultVisibility` enum('private','team','restricted') NOT NULL DEFAULT 'private',
	`tokenHash` varchar(64) NOT NULL,
	`invitedByUserId` int NOT NULL,
	`status` enum('pending','accepted','revoked','expired') NOT NULL DEFAULT 'pending',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`expiresAt` timestamp NOT NULL,
	`acceptedAt` timestamp,
	CONSTRAINT `team_invitations_id` PRIMARY KEY(`id`),
	CONSTRAINT `team_invitations_token_hash_unique` UNIQUE(`tokenHash`)
);
--> statement-breakpoint
CREATE TABLE `team_members` (
	`id` int AUTO_INCREMENT NOT NULL,
	`teamId` int NOT NULL,
	`userId` int NOT NULL,
	`role` enum('owner','writer') NOT NULL,
	`defaultVisibility` enum('private','team','restricted') NOT NULL DEFAULT 'private',
	`joinedAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `team_members_id` PRIMARY KEY(`id`),
	CONSTRAINT `team_members_team_user_unique` UNIQUE(`teamId`,`userId`)
);
--> statement-breakpoint
CREATE TABLE `teams` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(160) NOT NULL,
	`slug` varchar(96) NOT NULL,
	`description` text,
	`createdByUserId` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `teams_id` PRIMARY KEY(`id`),
	CONSTRAINT `teams_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE INDEX `team_invitations_team_status_index` ON `team_invitations` (`teamId`,`status`);--> statement-breakpoint
CREATE INDEX `team_invitations_email_index` ON `team_invitations` (`inviteeEmail`);--> statement-breakpoint
CREATE INDEX `team_members_user_index` ON `team_members` (`userId`);--> statement-breakpoint
CREATE INDEX `team_members_team_index` ON `team_members` (`teamId`);--> statement-breakpoint
CREATE INDEX `teams_creator_index` ON `teams` (`createdByUserId`);
