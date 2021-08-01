CREATE TABLE "Users" (
    "Username" TEXT NOT NULL PRIMARY KEY,
    "Email" TEXT NOT NULL UNIQUE,
    "Password" TEXT NOT NULL,
    "PasswordSalt" TEXT NOT NULL
);

CREATE TABLE "Friends" (
    "User" TEXT NOT NULL REFERENCES "Users" ("Username"),
    "Friend" TEXT NOT NULL REFERENCES "Users" ("Username")
);

CREATE TABLE "PendingFriendInvitations" (
    "Inviter" TEXT NOT NULL REFERENCES "Users" ("Username"),
    "Invitee" TEXT NOT NULL REFERENCES "Users" ("Username")
);