// src/app/employees/page.tsx

import EmployeeForm from '../../components/EmployeeForm';
import EmployeeList from '../../components/EmployeeList';

export default function EmployeesPage() {
  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Çalışan Ekle</h1>
      <EmployeeForm />
      <h2 className="text-2xl font-bold mt-8 mb-4">Çalışan Listesi</h2>
      <EmployeeList />
    </div>
  );
}
