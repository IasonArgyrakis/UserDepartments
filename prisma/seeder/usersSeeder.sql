INSERT INTO users (email, hash, firstName, lastName, afm, updatedAt)
VALUES ('jane.doe@example.com', 'a1b2c3d4', 'Jane', 'Doe', '1234567890', NOW());
VALUES ('jane.Dowy@example.com', 'a1b2c3d4', 'Jane', 'Doowy', '12345690', NOW());
VALUES ('jane.doe2@example.com', 'a1b2c3d4', 'Jane', 'Doe', '1234567', NOW());
VALUES ('jane.Dowy2@example.com', 'a1b2c3d4', 'Jane', 'Doowy', '123490', NOW());


INSERT INTO departments (title, updatedAt)
VALUES ('Sales', NOW());
VALUES ('Dev', NOW());
VALUES ('HR', NOW());
