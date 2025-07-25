'use client';
import { useEffect, useState } from 'react';

export default function AllStudentsPage() {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    const fetchStudents = async () => {
      const res = await fetch('/api/students');
      const data = await res.json();
      setStudents(data.students || []);
    };

    fetchStudents();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">👨‍🎓 All Registered Students</h1>

        {students.length === 0 ? (
          <p>No students found 😕</p>
        ) : (
          <div className="overflow-x-auto rounded shadow bg-white">
            <table className="w-full table-auto border-collapse">
              <thead className="bg-gray-200">
                <tr>
                  <th className="p-3 text-left">#</th>
                  <th className="p-3 text-left">Name</th>
                  <th className="p-3 text-left">Roll No</th>
                  <th className="p-3 text-left">Email</th>
                  <th className="p-3 text-left">Role</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student, index) => (
                  <tr key={student._id} className="border-t">
                    <td className="p-3">{index + 1}</td>
                    <td className="p-3">{student.name}</td>
                    <td className="p-3">{student.rollNo}</td>
                    <td className="p-3">{student.email}</td>
                    <td className="p-3 capitalize text-blue-700 font-medium">{student.role}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
