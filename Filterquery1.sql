SELECT 
	e.id AS ID, 
    e.first_name AS First, 
    e.last_name AS Last, 
    e.role_id AS Role, 
    r.salary AS Salary, 
    m.last_name AS Manager, 
    d.name AS Department 
FROM role r
LEFT JOIN employee e
	ON r.title = e.role_id
LEFT JOIN employee m 
	ON e.manager_id = m.id 
LEFT JOIN department d 
	ON r.department_id = d.id 
