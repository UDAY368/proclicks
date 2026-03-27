-- Add optional admin remark for each lead row.
ALTER TABLE "Lead"
ADD COLUMN "remark" TEXT;
