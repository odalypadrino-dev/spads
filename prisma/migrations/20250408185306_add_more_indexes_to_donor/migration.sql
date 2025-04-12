-- CreateIndex
CREATE FULLTEXT INDEX `Donor_record_idx` ON `Donor`(`record`);

-- CreateIndex
CREATE FULLTEXT INDEX `Donor_ciString_idx` ON `Donor`(`ciString`);
