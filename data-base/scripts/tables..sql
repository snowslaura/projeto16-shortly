CREATE TABLE "users" (
	"id" serial PRIMARY KEY,
	"name" TEXT NOT NULL,
	"email" TEXT NOT NULL UNIQUE,
	"password" TEXT NOT NULL,	
	"createdAt" TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE "shortlyUrls" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" integer NOT NULL REFERENCES "users"("id"),
	"url" TEXT NOT NULL,
	"shortUrl" TEXT NOT NULL,
	"visitCount" integer NOT NULL,
	"createdAt" TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW()	
);

CREATE TABLE "sessions" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" integer NOT NULL REFERENCES "users"("id"),
	"token" TEXT NOT NULL,
	"createdAt" TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW()	
);


