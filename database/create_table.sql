CREATE TABLE User(
	UserId INT AUTO_INCREMENT,
	Username VARCHAR(255) NOT NULL,
	Email VARCHAR(255),
	Passwd VARCHAR(32) NOT NULL,
	CreateTime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	PRIMARY KEY (UserId)
);

CREATE TABLE PrivateGroup(
    GroupId INT AUTO_INCREMENT,
    GroupName VARCHAR(255),
    Passwd VARCHAR(32) NOT NULL,
    CreateTime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (GroupId)
);

create table Transaction(
    TransactionId INT AUTO_INCREMENT,
    Amount REAL DEFAULT 0, # >=0
    LendId INT, 
    BorrowId INT,
    PaidStatus enum("Process","Paid") DEFAULT "Process", # status only choices
    Date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
		PRIMARY KEY (TransactionId),
		FOREIGN KEY (LendId) REFERENCES User(UserId) ON DELETE CASCADE,
    FOREIGN KEY (BorrowId) REFERENCES User(UserId) ON DELETE CASCADE,
		CHECK(Amount >= 0) 
);


CREATE TABLE Bill(
    BillId INT AUTO_INCREMENT,
    Amount REAL DEFAULT 0,
    LendId INT,
    BorrowId INT,
    PaidStatus enum("Process","Paid") DEFAULT "Process", # status only choices
    Date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (BillId),
    FOREIGN KEY (LendId) REFERENCES User(UserId) ON DELETE CASCADE,
    FOREIGN KEY (BorrowId) REFERENCES User(UserId) ON DELETE CASCADE,
		CHECK(Amount >= 0)
);

CREATE TABLE GroupJoin(
		GroupId INT,
		UserId INT,
		PRIMARY KEY (GroupId, UserId),
		FOREIGN KEY (GroupId) REFERENCES PrivateGroup(GroupId) ON DELETE CASCADE,
		FOREIGN KEY (UserId) REFERENCES User(UserId) ON DELETE CASCADE
);
# updated 1123
CREATE TABLE PublicActivity(
	EventId INT AUTO_INCREMENT,
	EventName VARCHAR(255),
	EventType VARCHAR(32),
	StartDate TIMESTAMP NOT NULL,
	EndDate TIMESTAMP NOT NULL,
	CreatorId INT,
	Fee REAL DEFAULT 0,
	PlaceId INT,
	PRIMARY KEY(EventId),
	FOREIGN KEY (PlaceId) REFERENCES Place(PlaceId) ON DELETE CASCADE,
	FOREIGN KEY (CreatorId) REFERENCES User(UserId) ON DELETE CASCADE
);
# updated 1123
CREATE TABLE Place(
	PlaceId INT,
	Location VARCHAR(255),
	ZipCode VARCHAR(32),
	TimeVisit INT DEFAULT 0,
	PRIMARY KEY (PlaceId)
);

# updated 1123
CREATE TABLE ActivityJoin(
		EventId INT,
		UserId INT,
		PRIMARY KEY (EventId, UserId),
		FOREIGN KEY (EventId) REFERENCES PublicActivity(EventId) ON DELETE CASCADE,
		FOREIGN KEY (UserId) REFERENCES User(UserId) ON DELETE CASCADE
);


DECLARE currId int;
    DECLARE myCur CURSOR FOR SELECT DISTINCT UserId FROM GroupJoin WHERE GroupId = new.GroupId AND UserId <> new.LendId;
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = 1;
    SET @countOfMembers = (SELECT COUNT(*) FROM GroupJoin WHERE GroupId = new.GroupId);
    SET @division = new.Amount / @countOfMembers;
    OPEN mycur;
    cursorLoop:
    loop
        FETCH myCur INTO currId;
        if done then
            leave cursorLoop;
        end if;
        INSERT INTO Transaction(BillId, Amount, LendId, BorrowId)
        VALUES (new.BillId, @division, new.LendId, currId);
    end loop cursorLoop;
    CLOSE myCur;
END;