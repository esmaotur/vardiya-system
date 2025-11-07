"use client";

import { useEffect, useState } from "react";

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    const fetchEmployees = async () => {
      const res = await fetch("http://localhost:3001/employees");
      const data = await res.json();
      setEmployees(data);
    };

    fetchEmployees();
    const handleUpdate = () => fetchEmployees(); // yeni çalışan eklenince yenile
    window.addEventListener("employeeAdded", handleUpdate);

    return () => window.removeEventListener("employeeAdded", handleUpdate);
  }, []);

  return (
    <div className="bg-white p-4 shadow-md rounded-md border">
      <h2 className="text-xl font-semibold mb-4 text-gray-700">
        Çalışan Listesi
      </h2>
      {employees.length === 0 ? (
        <p className="text-gray-500">Henüz çalışan eklenmemiş.</p>
      ) : (
        <ul>
          {employees.map((emp: any) => (
            <li key={emp.id} className="border-b py-2">
              <p className="font-semibold">{emp.name}</p>
              <p className="text-sm text-gray-600">{emp.email}</p>
              <p className="text-sm text-gray-600">{emp.role}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default EmployeeList;
