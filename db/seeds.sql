INSERT INTO departments 
    (dep_name)
VALUES 
    ('Sales '),
    ('Engineering'),
    ('Legal'),
    ('Finance');


INSERT INTO roles 
    (title, salary, department_id)
VALUES 
    ('Sales Lead', '100000', 1),
    ('Sales Person', '60000', 1),
    ('Software Engineer', '90000', 2),
    ('Accountant', '110000', 4),
    ('Legal Team Lead', '130000', 3),
    ('Lawyer', '140000', 3);

INSERT INTO employees 
    (first_name, last_name, role_id)
VALUES 
    ('Michael', 'John', 1),
    ('Chris', 'Obrien', 2),
    ('Kayla', 'Sliwa', 2),
    ('Richard', 'Gipson', 2),
    ('Mell', 'Record', 3),
    ('Danney', 'Thomas', 4),
    ('Juan', 'Carloz', 5),
    ('Jose', 'Span', 5),
    ('Cameron', 'Oakley', 6),
    ('Brendan', 'Brown', 6);

-- first_name, last_name, role_id, manager_id)
-- VALUES 
--     ('Brandon', 'Brien', 1 ),
--     ('William', 'Astalos', 2),
--     ('Sarah', 'Menoscal', 2),
--     ('Lauren', 'Gotch', 5)