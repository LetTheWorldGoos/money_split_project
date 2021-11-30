-- updated 1130
-- stored procedure
DROP PROCEDURE IF EXISTS Balance;
CREATE PROCEDURE Balance(IN InUserId INT, IN year VARCHAR(4))
BEGIN
    
    declare uid INT;
    declare a DOUBLE;
    declare date TIMESTAMP;
 
    -- declare cursor
    -- 1st advanced query
    declare pg_cur cursor for (
        (SELECT t1.Date, t1.BorrowId as UserId, t1.Amount as Amount
        FROM Transaction t1 JOIN Bill b1 on b1.BillId = t1.BillId
        WHERE b1.LendId = InUserId)
        UNION
        (SELECT t2.Date, t2.LendId as UserId, -(t2.Amount) as Amount
        FROM Transaction t2 JOIN Bill b2 on b2.BillId = t2.BillId
        WHERE t2.BorrowId = InUserId)
    );    
    -- 2nd advanced query
    declare pa_cur cursor for(
        (SELECT p1.StartDate, p1.CreatorId as UserId, -p1.Fee as Amount
        FROM ActivityJoin a1 JOIN PublicActivity p1 ON p1.EventId = a1.EventId
        WHERE a1.UserId = InUserId AND p1.CreatorId <> a1.UserId)
        UNION
        (SELECT p2.StartDate, a2.UserId as UserId, p2.Fee as Amount
        FROM ActivityJoin a2 JOIN PublicActivity p2 ON p2.EventId = a2.EventId
        WHERE p2.CreatorId = InUserId And a2.UserId <> p2.CreatorId)
    );
    
    -- reclare table
    drop table if exists NEWTABLE;
    create table NEWTABLE(
        UserId INT primary key, 
        Amount INT
    );
  
    -- start the loop on private group
    open pg_cur;
    begin
        declare pg_done int default 0;
        declare continue handler for not found set pg_done = 1;
        while pg_done = 0
        do
            fetch pg_cur into date, uid, a;
            if DATE_FORMAT(date, "%Y") = year then
	insert ignore into NEWTABLE values (uid,a);
            end if;
      
         end while;
    end;
    close pg_cur;

    -- start the loop on public activity
    open pa_cur;
    begin
        declare pa_done int default 0;
        declare continue handler for not found set pa_done = 1;
        while pa_done = 0
        do
            fetch pa_cur into date, uid, a;
            if DATE_FORMAT(date, "%Y") = year then 
            insert ignore into NEWTABLE values (uid,a);
        end if;
    
        end while;
        end;
        close pa_cur;

    -- select and return 
    -- 3rd advanced query
    SELECT UserId, Username, SUM(Amount)
    FROM NEWTABLE NATURAL JOIN User
    GROUP BY UserId;
END;

--updated 1130 trigger 
begin
set @timenow = current_timestamp;
set @timeend = (select EndDate from PublicActivity where EventId = new.EventId);
if @timenow < @timeend then
UPDATE Place SET TimeVisit = TimeVisit + 1
WHERE PlaceId in (select PlaceId from PublicActivity where EventId =  new.EventId);
else
SIGNAL SQLSTATE '45000';
end if;
end    