"use client";
import { useState } from "react";

const EmployeeForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(""); // Eski mesajı temizle

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/employees`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, role }),
      });

      if (res.ok) {
        if (res.ok) {
          console.log("✅ Yeni çalışan eklendi!");
          window.dispatchEvent(new Event("employeeAdded"));
          setName("");
          setEmail("");
          setRole("");
          
}

      } else {
        const err = await res.json();
        setMessage("❌ Hata: " + (err.message || "Bilinmeyen hata"));
      }
    } catch (error) {
      console.error("Bağlantı hatası:", error);
      setMessage("⚠️ Sunucuya bağlanılamadı!");
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 border border-gray-200">
      <h2 className="text-2xl font-bold mb-4 text-gray-800 text-center">
        Yeni Çalışan Ekle
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Ad Soyad
          </label>
          <input
            name="name"
            type="text"
            placeholder="Ad Soyad"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border w-full p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1">
            E-posta
          </label>
          <input
            name="email"
            type="email"
            placeholder="E-posta"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border w-full p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1">Rol</label>
          <input
            name="role"
            type="text"
            placeholder="Rol"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="border w-full p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white w-full py-2 rounded-md hover:bg-blue-600 transition-all font-semibold"
        >
          Ekle
        </button>
      </form>

      {message && (
        <p
          className={`mt-4 text-center font-medium ${
            message.startsWith("✅")
              ? "text-green-600"
              : message.startsWith("❌")
              ? "text-red-600"
              : "text-yellow-600"
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
};

export default EmployeeForm;
