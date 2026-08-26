CREATE TABLE `team_canon_revisions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`teamId` int NOT NULL,
	`canonRecordId` int NOT NULL,
	`revisionNumber` int NOT NULL,
	`category` enum('character','world_rule','location','lore','plot','other') NOT NULL,
	`title` varchar(160) NOT NULL,
	`decision` text NOT NULL,
	`context` text,
	`revisedByUserId` int NOT NULL,
	`revisionNote` varchar(600),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `team_canon_revisions_id` PRIMARY KEY(`id`),
	CONSTRAINT `team_canon_revisions_record_number_unique` UNIQUE(`canonRecordId`,`revisionNumber`)
);
--> statement-breakpoint
CREATE INDEX `team_canon_revisions_team_record_index` ON `team_canon_revisions` (`teamId`,`canonRecordId`);