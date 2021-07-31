CREATE TABLE "Users" (
    "Username" TEXT PRIMARY KEY,
    "Email" TEXT UNIQUE,
    "Password" TEXT NOT NULL
);

CREATE TABLE "Friends" (
    "User" TEXT NOT NULL REFERENCES "Users" ("Username"),
    "Friend" TEXT NOT NULL REFERENCES "Users" ("Username")
);