-- 2. Advanced DB Features
-- View: High Risk Dashboard
CREATE VIEW High_Risk_Transactions_View AS
SELECT t.transaction_id, t.amount, t.timestamp, t.status, u.name AS sender_name
FROM Transactions t 
JOIN Accounts a ON t.sender_account = a.account_id 
JOIN Users u ON a.user_id = u.user_id
WHERE t.amount > 50000 OR t.status = 'FLAGGED';

-- Trigger: Audit Logging
CREATE OR REPLACE FUNCTION log_transaction_changes() RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO Audit_Log (transaction_id, action) 
    VALUES (NEW.transaction_id, 'Transaction state changed to: ' || NEW.status);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER transaction_audit_trigger
AFTER INSERT OR UPDATE ON Transactions
FOR EACH ROW EXECUTE FUNCTION log_transaction_changes();

-- Stored Procedure: Process Transfer
CREATE OR REPLACE PROCEDURE process_transfer(sender INT, receiver INT, transfer_amount DECIMAL)
LANGUAGE plpgsql
AS $$
BEGIN
    -- ACID Transaction to ensure integrity
    UPDATE Accounts SET balance = balance - transfer_amount WHERE account_id = sender;
    UPDATE Accounts SET balance = balance + transfer_amount WHERE account_id = receiver;
    INSERT INTO Transactions (sender_account, receiver_account, amount, status) 
    VALUES (sender, receiver, transfer_amount, 'COMPLETED');
    COMMIT;
END;
$$;
