CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS timestamp_ (
    id SERIAL PRIMARY KEY,
    reading_timestamp TIMESTAMP NOT NULL,
    ai_soc DECIMAL(5, 2) NOT NULL,
    sensor_soc DECIMAL(5, 2) NOT NULL,
    soh_pct DECIMAL(5, 2),
    voltage_diff_v DECIMAL(8, 4),
    max_cell_voltage_v DECIMAL(8, 4),
    current_a DECIMAL(8, 4),
    power_kw DECIMAL(8, 4),
    voltage_v DECIMAL(8, 4)
);