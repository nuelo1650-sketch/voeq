-- Add search vectors for FTS

ALTER TABLE "Listing" ADD COLUMN "searchVector" tsvector;

UPDATE "Listing" SET "searchVector" = (
  setweight(to_tsvector('english', COALESCE("title", '')), 'A') ||
  setweight(to_tsvector('english', COALESCE("description", '')), 'B')
);

CREATE INDEX listing_search_vector_idx ON "Listing" USING GIN ("searchVector");

CREATE OR REPLACE FUNCTION listing_search_vector_update() RETURNS trigger AS $$
BEGIN
  NEW."searchVector" :=
    setweight(to_tsvector('english', COALESCE(NEW.title, '')), 'A') ||
    setweight(to_tsvector('english', COALESCE(NEW.description, '')), 'B');
  RETURN NEW;
END
$$ LANGUAGE plpgsql;

CREATE TRIGGER listing_search_vector_trigger
  BEFORE INSERT OR UPDATE ON "Listing"
  FOR EACH ROW EXECUTE FUNCTION listing_search_vector_update();

ALTER TABLE "Vendor" ADD COLUMN "searchVector" tsvector;

UPDATE "Vendor" SET "searchVector" = (
  setweight(to_tsvector('english', COALESCE("businessName", '')), 'A') ||
  setweight(to_tsvector('english', COALESCE("description", '')), 'B') ||
  setweight(to_tsvector('english', COALESCE("ownerName", '')), 'C')
);

CREATE INDEX vendor_search_vector_idx ON "Vendor" USING GIN ("searchVector");

CREATE OR REPLACE FUNCTION vendor_search_vector_update() RETURNS trigger AS $$
BEGIN
  NEW."searchVector" :=
    setweight(to_tsvector('english', COALESCE(NEW.businessName, '')), 'A') ||
    setweight(to_tsvector('english', COALESCE(NEW.description, '')), 'B') ||
    setweight(to_tsvector('english', COALESCE(NEW.ownerName, '')), 'C');
  RETURN NEW;
END
$$ LANGUAGE plpgsql;

CREATE TRIGGER vendor_search_vector_trigger
  BEFORE INSERT OR UPDATE ON "Vendor"
  FOR EACH ROW EXECUTE FUNCTION vendor_search_vector_update();
