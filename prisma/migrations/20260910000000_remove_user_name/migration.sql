-- Preserve legacy names when fullname has not been populated.
-- Refuse to discard a different non-empty name: reconcile it first.
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM "User" WHERE COALESCE("name", '') <> '' AND "fullname" <> '' AND "name" <> "fullname") THEN
    RAISE EXCEPTION 'Conflicting User.name and User.fullname values; reconcile before migrating';
  END IF;
END $$;

UPDATE "User" SET "fullname" = "name"
WHERE "fullname" = '' AND COALESCE("name", '') <> '';

ALTER TABLE "User" DROP COLUMN "name";
