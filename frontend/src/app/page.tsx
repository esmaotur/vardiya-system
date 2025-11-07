import EmployeeForm from "../components/EmployeeForm";
import EmployeeList from "../components/EmployeeList";
import ShiftList from "../components/ShiftList"; // ✅ Bunu ekledik

export default function HomePage() {
  return (
    <main className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-600">
        🕒 Vardiya Sistemi
      </h1>

      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <div className="bg-white rounded-xl shadow p-4">
          <h2 className="text-xl font-semibold mb-2">👩‍💻 Yeni Çalışan</h2>
          <EmployeeForm />
        </div>

        <div className="bg-white rounded-xl shadow p-4">
          <h2 className="text-xl font-semibold mb-2">📋 Çalışanlar</h2>
          <EmployeeList />
        </div>
      </div>

      {/* ✅ Şimdi vardiya listesi geliyor */}
      <div className="bg-white rounded-xl shadow p-4">
        <ShiftList />
      </div>
    </main>
  );
}
