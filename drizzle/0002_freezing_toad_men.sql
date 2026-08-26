CREATE TABLE `team_canon_records` (
	`id` int AUTO_INCREMENT NOT NULL,
	`teamId` int NOT NULL,
	`category` enum('character','world_rule','location','lore','plot','other') NOT NULL,
	`title` varchar(160) NOT NULL,
	`decision` text NOT NULL,
	`context` text,
	`status` enum('pending','approved','rejected') NOT NULL DEFAULT 'pending',
	`proposedByUserId` int NOT NULL,
	`reviewedByUserId` int,
	`reviewedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `team_canon_records_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE INDEX `team_canon_records_team_status_index` ON `team_canon_records` (`teamId`,`status`);--> statement-breakpoint
CREATE INDEX `team_canon_records_proposer_index` ON `team_canon_records` (`proposedByUserId`);