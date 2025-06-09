'use client';

import { useEffect, useState } from 'react';
import { ref, get, remove, update, push } from 'firebase/database';
import { database } from '../lib/firebase';
import EmployeeList from './EmployeeList';
import EmployeeForm from '../components/HRDashboard/EmployeeForm';

export default function EmployeesPage() {
  const [employees, setEmployees] = useState({});
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    async function fetchEmployees() {
      const snapshot = await get(ref(database, 'employees'));
      setEmployees(snapshot.val() || {});
    }
    fetchEmployees();
  }, []);

  const handleEdit = (id) => {
    setEditingId(id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this employee?')) {
      await remove(ref(database, `employees/${id}`));
      setEmployees(prev => {
        const copy = { ...prev };
        delete copy[id];
        return copy;
      });
    }
  };

  const handleFormSubmit = async (formData, id) => {
    if (id) {
      await update(ref(database, `employees/${id}`), formData);
      setEmployees(prev => ({
        ...prev,
        [id]: { ...prev[id], ...formData },
      }));
    } else {
      const newRef = push(ref(database, 'employees'));
      await update(newRef, formData);
      setEmployees(prev => ({
        ...prev,
        [newRef.key]: formData,
      }));
    }
    setShowForm(false);
    setEditingId(null);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
  };

  return (
    <div className="p-6 relative">
      {!showForm && (
        <button
          onClick={() => {
            setEditingId(null);
            setShowForm(true);
          }}
          className="mb-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Add New Employee
        </button>
      )}

      {/* Modal Overlay for EmployeeForm */}
      {showForm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          onClick={handleCancel} // close modal on background click
        >
          <div
            className="bg-white rounded-lg shadow-lg max-w-3xl w-full max-h-[90vh] overflow-auto p-6"
            onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside modal
          >
            <EmployeeForm
              employee={editingId ? employees[editingId] : null}
              onSubmit={handleFormSubmit}
              onCancel={handleCancel}
            />
          </div>
        </div>
      )}

      {/* Employee List */}
      <EmployeeList
        employees={employees}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
}
