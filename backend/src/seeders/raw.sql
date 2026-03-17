-- ======================
-- TRANSACTIONS
-- ======================
CREATE TABLE transactions (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  avatar_url VARCHAR(500),
  category VARCHAR(50) NOT NULL,
  date TIMESTAMP WITH TIME ZONE NOT NULL,
  amount NUMERIC(10,2) NOT NULL,
  recurring BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL
);

CREATE INDEX transactions_category_idx ON transactions (category);
CREATE INDEX transactions_date_idx ON transactions (date);
CREATE INDEX transactions_recurring_idx ON transactions (recurring);

-- ======================
-- BUDGETS
-- ======================
CREATE TABLE budgets (
  id SERIAL PRIMARY KEY,
  category VARCHAR(50) NOT NULL UNIQUE,
  maximum NUMERIC(10,2) NOT NULL,
  theme VARCHAR(20) NOT NULL DEFAULT '#277C78',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL
);

-- ======================
-- POTS
-- ======================
CREATE TABLE pots (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  target NUMERIC(10,2) NOT NULL,
  total NUMERIC(10,2) NOT NULL DEFAULT 0,
  theme VARCHAR(20) NOT NULL DEFAULT '#277C78',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL
);

-- ======================
-- RECURRING BILLS
-- ======================
CREATE TABLE recurring_bills (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  avatar_url VARCHAR(500),
  category VARCHAR(50) NOT NULL,
  amount NUMERIC(10,2) NOT NULL,
  due_day INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL
);

-- ======================
-- SEED DATA
-- ======================

-- Transactions
INSERT INTO transactions (name, avatar_url, category, date, amount, recurring, created_at, updated_at) VALUES
('Emma Richardson','/avatars/emma-richardson.jpg','General','2024-08-19T14:23:11Z',-75.50,false,NOW(),NOW()),
('Savory Bites Restaurant','/avatars/savory-bites.jpg','Dining Out','2024-08-19T10:05:42Z',-55.50,false,NOW(),NOW()),
('Daniel Carter','/avatars/daniel-carter.jpg','General','2024-08-18T20:11:09Z',-42.30,false,NOW(),NOW()),
('Sun Park','/avatars/sun-park.jpg','General','2024-08-17T16:45:22Z',150.00,false,NOW(),NOW()),
('Urban Services Hub','/avatars/urban-services.jpg','General','2024-08-17T08:30:00Z',-65.00,false,NOW(),NOW()),
('Tune Twisters','/avatars/tune-twisters.jpg','Entertainment','2024-08-15T19:00:00Z',-12.99,true,NOW(),NOW()),
('Green Plate Eatery','/avatars/green-plate.jpg','Dining Out','2024-08-15T13:22:45Z',-45.00,false,NOW(),NOW()),
('Spendy App','/avatars/spendy-app.jpg','Entertainment','2024-08-14T09:00:00Z',-9.99,true,NOW(),NOW()),
('James Thompson','/avatars/james-thompson.jpg','General','2024-08-14T11:30:00Z',2000.00,false,NOW(),NOW()),
('Pixel Plate','/avatars/pixel-plate.jpg','Dining Out','2024-08-13T18:45:00Z',-35.00,false,NOW(),NOW()),
('Rina Sato','/avatars/rina-sato.jpg','General','2024-08-12T14:00:00Z',-60.00,false,NOW(),NOW()),
('Spark Electric Solutions','/avatars/spark-electric.jpg','Bills','2024-08-12T00:00:00Z',-100.00,true,NOW(),NOW()),
('Aqua Flow Utilities','/avatars/aqua-flow.jpg','Bills','2024-08-11T00:00:00Z',-100.00,true,NOW(),NOW()),
('Serenity Spa & Wellness','/avatars/serenity-spa.jpg','Personal Care','2024-08-10T14:00:00Z',-30.00,false,NOW(),NOW()),
('Swift Ride Share','/avatars/swift-ride.jpg','Transportation','2024-08-10T08:30:00Z',-18.50,false,NOW(),NOW()),
('ByteMe Gaming','/avatars/byteme-gaming.jpg','Entertainment','2024-08-09T00:00:00Z',-14.99,true,NOW(),NOW()),
('Yolo Fitness Zone','/avatars/yolo-fitness.jpg','Personal Care','2024-08-09T07:00:00Z',-50.00,true,NOW(),NOW()),
('EduLearn Online','/avatars/edulearn.jpg','Education','2024-08-08T00:00:00Z',-50.00,true,NOW(),NOW()),
('Fresh Bites Grocery','/avatars/fresh-bites.jpg','Groceries','2024-08-07T11:00:00Z',-78.50,false,NOW(),NOW()),
('Opia Hair Care','/avatars/opia-hair.jpg','Personal Care','2024-08-06T13:00:00Z',-30.00,false,NOW(),NOW()),
('Loca Loca Restaurant','/avatars/loca-loca.jpg','Dining Out','2024-08-06T19:30:00Z',-22.50,false,NOW(),NOW()),
('Mason Martinez','/avatars/mason-martinez.jpg','General','2024-08-05T16:00:00Z',-25.00,false,NOW(),NOW()),
('Transit Express','/avatars/transit-express.jpg','Transportation','2024-08-05T07:30:00Z',-12.50,false,NOW(),NOW()),
('Buzz Marketing','/avatars/buzz-marketing.jpg','Shopping','2024-08-04T14:30:00Z',-29.99,false,NOW(),NOW()),
('Posh Totty Designs','/avatars/posh-totty.jpg','Shopping','2024-08-03T12:00:00Z',-45.00,false,NOW(),NOW()),
('Ella Phillips','/avatars/ella-phillips.jpg','General','2024-08-03T09:00:00Z',1750.00,false,NOW(),NOW()),
('Spark Electric Solutions','/avatars/spark-electric.jpg','Bills','2024-08-02T00:00:00Z',-100.00,true,NOW(),NOW()),
('Wholesome Bites Co.','/avatars/wholesome-bites.jpg','Groceries','2024-08-01T10:00:00Z',-95.50,false,NOW(),NOW()),
('Emma Richardson','/avatars/emma-richardson.jpg','General','2024-07-30T14:23:11Z',-75.50,false,NOW(),NOW()),
('Savory Bites Restaurant','/avatars/savory-bites.jpg','Dining Out','2024-07-28T10:05:42Z',-42.00,false,NOW(),NOW()),
('Tune Twisters','/avatars/tune-twisters.jpg','Entertainment','2024-07-15T19:00:00Z',-12.99,true,NOW(),NOW()),
('ByteMe Gaming','/avatars/byteme-gaming.jpg','Entertainment','2024-07-09T00:00:00Z',-14.99,true,NOW(),NOW()),
('Spark Electric Solutions','/avatars/spark-electric.jpg','Bills','2024-07-12T00:00:00Z',-100.00,true,NOW(),NOW()),
('Aqua Flow Utilities','/avatars/aqua-flow.jpg','Bills','2024-07-11T00:00:00Z',-100.00,true,NOW(),NOW()),
('Yolo Fitness Zone','/avatars/yolo-fitness.jpg','Personal Care','2024-07-09T07:00:00Z',-50.00,true,NOW(),NOW()),
('EduLearn Online','/avatars/edulearn.jpg','Education','2024-07-08T00:00:00Z',-50.00,true,NOW(),NOW()),
('James Thompson','/avatars/james-thompson.jpg','General','2024-07-14T11:30:00Z',2000.00,false,NOW(),NOW()),
('Ella Phillips','/avatars/ella-phillips.jpg','General','2024-07-03T09:00:00Z',1750.00,false,NOW(),NOW());

-- Budgets
INSERT INTO budgets (category, maximum, theme, created_at, updated_at) VALUES
('Entertainment',50.00,'#277C78',NOW(),NOW()),
('Bills',750.00,'#82C9D7',NOW(),NOW()),
('Dining Out',75.00,'#F2CDAC',NOW(),NOW()),
('Personal Care',100.00,'#626070',NOW(),NOW());

-- Pots
INSERT INTO pots (name, target, total, theme, created_at, updated_at) VALUES
('Savings',2000.00,159.00,'#277C78',NOW(),NOW()),
('Concert Ticket',150.00,110.00,'#626070',NOW(),NOW()),
('Emergency Fund',500.00,125.00,'#C94736',NOW(),NOW()),
('Gift',150.00,110.00,'#3F82B2',NOW(),NOW()),
('Holiday',1440.00,531.00,'#F2CDAC',NOW(),NOW()),
('New Laptop',1000.00,10.00,'#97A0AC',NOW(),NOW()),
('New Phone',600.00,50.00,'#82C9D7',NOW(),NOW());

-- Recurring Bills
INSERT INTO recurring_bills (name, avatar_url, category, amount, due_day, created_at, updated_at) VALUES
('Spark Electric Solutions','/avatars/spark-electric.jpg','Bills',-100.00,12,NOW(),NOW()),
('Aqua Flow Utilities','/avatars/aqua-flow.jpg','Bills',-100.00,11,NOW(),NOW()),
('Tune Twisters','/avatars/tune-twisters.jpg','Entertainment',-12.99,15,NOW(),NOW()),
('ByteMe Gaming','/avatars/byteme-gaming.jpg','Entertainment',-14.99,9,NOW(),NOW()),
('Spendy App','/avatars/spendy-app.jpg','Entertainment',-9.99,14,NOW(),NOW()),
('Yolo Fitness Zone','/avatars/yolo-fitness.jpg','Personal Care',-50.00,9,NOW(),NOW()),
('EduLearn Online','/avatars/edulearn.jpg','Education',-50.00,8,NOW(),NOW()),
('Pixel Plate','/avatars/pixel-plate.jpg','Dining Out',-35.00,13,NOW(),NOW()),
('Buzz Marketing','/avatars/buzz-marketing.jpg','Shopping',-29.99,4,NOW(),NOW());