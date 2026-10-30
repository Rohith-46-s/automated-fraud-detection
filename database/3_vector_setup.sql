-- 3. pgvector Setup (Behavioral Fraud Detection)
CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE Transaction_Embeddings (
    embedding_id SERIAL PRIMARY KEY,
    transaction_id INT REFERENCES Transactions(transaction_id) ON DELETE CASCADE,
    -- Example 3D vector: [time_of_day_normalized, amount_normalized, location_distance]
    behavior_vector vector(3) 
);

-- Query to find similar anomalous transactions using L2 distance (<->)
-- SELECT transaction_id, behavior_vector <-> '[0.9, 0.1, 0.8]' AS distance 
-- FROM Transaction_Embeddings 
-- ORDER BY distance ASC LIMIT 5;
