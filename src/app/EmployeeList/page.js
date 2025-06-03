'use client';

import { useEffect, useState } from 'react';
import { ref, get, remove } from 'firebase/database';
import { database } from '../lib/firebase';
import EmployeeList from './EmployeeList'; // adjust path if needed

export default function EmployeesPage() {
  const [employees, setEmployees] = useState({});

  useEffect(() => {
    const fetchEmployees = async () => {
      const snapshot = await get(ref(database, 'employees'));
      setEmployees(snapshot.val() || {});
    };
    fetchEmployees();
  }, []);

  const handleEdit = (id) => {
    alert(`Edit employee with id: ${id}`);
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this employee?')) {
      await remove(ref(database, `employees/${id}`));
      setEmployees((prev) => {
        const updated = { ...prev };
        delete updated[id];
        return updated;
      });
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Employees List</h1>
      <EmployeeList employees={employees} onEdit={handleEdit} onDelete={handleDelete} />
    </div>
  );
}
