CREATE TABLE "Users" (
    "Username" TEXT NOT NULL PRIMARY KEY,
    "Email" TEXT NOT NULL UNIQUE,
    "Password" TEXT NOT NULL,
    "PasswordSalt" TEXT NOT NULL
);

INSERT INTO "Users" VALUES ('DemoUser', 'demouser@michaelconnor.ca', '$2b$10$YoSsiOSvTYXVXZda17hGgOUWJEkqJ5KfhLq8MH0yWQ2sVF3R/5Mn2', '$2b$10$YoSsiOSvTYXVXZda17hGgO');
INSERT INTO "Users" VALUES ('DemoUser2', 'demouser2@michaelconnor.ca', '$2b$10$YoSsiOSvTYXVXZda17hGgOUWJEkqJ5KfhLq8MH0yWQ2sVF3R/5Mn2', '$2b$10$YoSsiOSvTYXVXZda17hGgO');

CREATE TABLE "Friends" (
    "User" TEXT NOT NULL REFERENCES "Users" ("Username"),
    "Friend" TEXT NOT NULL REFERENCES "Users" ("Username")
);

CREATE TABLE "Messages" (
    "Sender" TEXT NOT NULL REFERENCES "Users" ("Username"),
    "Receiver" TEXT NOT NULL REFERENCES "Users" ("Username"),
    "Time" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "Message" TEXT NOT NULL,
    "Read" BOOLEAN NOT NULL DEFAULT 'FALSE'
);

CREATE TABLE "VideoRoom" (
    "Owner" TEXT NOT NULL REFERENCES "Users" ("Username"),
    "Guest" TEXT NOT NULL REFERENCES "Users" ("Username"),
    "OfferObject" TEXT NOT NULL,
    "Expiry" TIMESTAMP NOT NULL,
    "Expired" BOOLEAN NOT NULL DEFAULT 'FALSE'
);
