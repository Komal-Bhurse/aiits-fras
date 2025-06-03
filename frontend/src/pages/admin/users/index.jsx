
import { useEffect, useState } from "react"
import axios from "axios"
export default function Index() {
  const [users, setUsers] = useState([])

 function formatDateTime(dateStr) {
  const date = new Date(dateStr);
  const day = String(date.getDate()).padStart(2, "0");
  const month = date.toLocaleString("en-GB", { month: "short" }); // e.g., "Jun"
  const year = date.getFullYear();

  const hours = date.getHours() % 12 || 12;
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const ampm = date.getHours() >= 12 ? "PM" : "AM";

  return `${day}-${month}-${year} | ${hours}:${minutes} ${ampm}`;
}

function formatAadhaar(number) {
  return number.replace(/(\d{4})(\d{4})(\d{4})/, "$1 $2 $3");
}




  const fetchUsers = async () => {
    const res = await axios.get("/api/user")
    if (res.status) {
      const std = res.data.users.map((item)=>{
        const date = formatDateTime(item.createdAt)
        const adhar = formatAadhaar(item.aadhaar)
        return {...item,createdAt:date,aadhaar:adhar}
      })
      setUsers(std)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  return (
    <>
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">

        <div className="overflow-x-auto">
          <table className="min-w-full bg-gray-900 border border-gray-800 rounded-xl">
            <thead className="bg-gray-800 text-gray-300">
              <tr>
                <th className="px-6 py-3 text-left">#</th>
                <th className="px-6 py-3 text-left">Name</th>
                <th className="px-6 py-3 text-left">Aadhaar</th>
                <th className="px-6 py-3 text-left">Created Date</th>
              </tr>
            </thead>
            <tbody className="text-gray-200">
              {
                users && users.map((item, index) => {
                  return <tr key={index} className="hover:bg-gray-700 transition">
                    <td className="px-6 py-4">{index + 1}</td>
                    <td className="px-6 py-4">{item.name}</td>
                    <td className="px-6 py-4 text-green-400">{item.aadhaar}</td>
                    <td className="px-6 py-4">{item.createdAt}</td>
                  </tr>
                })
              }
            </tbody>
          </table>
        </div>
      </div>





    </>
  )
}
