"use client";
import { useEffect, useState } from "react";

interface Shift {
  id: string;
  date: string;
  start: string;
  end: string;
  location?: string;
  maxEmployees: number;
}

export default function ShiftList() {
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchShifts = async () => {
      try {
        const res = await fetch("http://localhost:3001/shifts", { cache: "no-store" });


        if (!res.ok) throw new Error("Veri alınamadı");
        const data = await res.json();
        setShifts(data);
      } catch (err) {
        console.error("Vardiyalar alınamadı:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchShifts();
  }, []);

  if (loading) return <p>⏳ Vardiyalar yükleniyor...</p>;
  if (shifts.length === 0) return <p>Henüz vardiya eklenmemiş.</p>;

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">📅 Vardiya Listesi</h2>
      <table className="min-w-full border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border">Tarih</th>
            <th className="p-2 border">Başlangıç</th>
            <th className="p-2 border">Bitiş</th>
            <th className="p-2 border">Konum</th>
            <th className="p-2 border">Maks. Kişi</th>
          </tr>
        </thead>
        <tbody>
          {shifts.map((s) => (
            <tr key={s.id} className="text-center border-t">
              <td className="p-2 border">{s.date.slice(0, 10)}</td>
              <td className="p-2 border">{s.start}</td>
              <td className="p-2 border">{s.end}</td>
              <td className="p-2 border">{s.location || "-"}</td>
              <td className="p-2 border">{s.maxEmployees}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
