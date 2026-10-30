-- 1. Tables Setup
CREATE TABLE Users (
    user_id SERIAL PRIMARY KEY, 
    name VARCHAR(100) NOT NULL, 
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL -- 'Admin', 'Customer'
);

CREATE TABLE Accounts (
    account_id SERIAL PRIMARY KEY, 
    user_id INT REFERENCES Users(user_id) ON DELETE CASCADE, 
    balance DECIMAL(15,2) DEFAULT 0 CHECK (balance >= 0), 
    status VARCHAR(20) DEFAULT 'ACTIVE'
);

CREATE TABLE Transactions (
    transaction_id SERIAL PRIMARY KEY, 
    sender_account INT REFERENCES Accounts(account_id), 
    receiver_account INT REFERENCES Accounts(account_id), 
    amount DECIMAL(15,2) NOT NULL CHECK (amount > 0), 
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
    status VARCHAR(20) DEFAULT 'PENDING'
);

CREATE TABLE Audit_Log (
    log_id SERIAL PRIMARY KEY, 
    transaction_id INT, 
    action VARCHAR(255), 
    log_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
