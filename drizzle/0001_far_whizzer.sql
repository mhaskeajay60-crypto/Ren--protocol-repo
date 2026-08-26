CREATE TABLE `team_join_requests` (
	`id` int AUTO_INCREMENT NOT NULL,
	`teamId` int NOT NULL,
	`requesterUserId` int NOT NULL,
	`requestedRole` enum('writer','watcher') NOT NULL,
	`message` text,
	`status` enum('pending','approved','rejected','withdrawn') NOT NULL DEFAULT 'pending',
	`reviewedByUserId` int,
	`reviewedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `team_join_requests_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `team_members` MODIFY COLUMN `role` enum('owner','writer','watcher') NOT NULL;--> statement-breakpoint
CREATE INDEX `team_join_requests_team_status_index` ON `team_join_requests` (`teamId`,`status`);--> statement-breakpoint
CREATE INDEX `team_join_requests_requester_index` ON `team_join_requests` (`requesterUserId`);