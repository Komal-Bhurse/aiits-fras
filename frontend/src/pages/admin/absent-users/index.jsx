import { useEffect, useState } from "react"
import { getAllAbsentUsers } from "../../../utils/attendances"


export default function Index() {

  const [absentUsers, setAbsentUsers] = useState([])

  const getDashBoardData = async () => {
      const res3 = await getAllAbsentUsers()
      setAbsentUsers(res3)
    }
  
  
    useEffect(() => {
      getDashBoardData()
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

                <th className="px-6 py-3 text-left">Status</th>
              </tr>
            </thead>
            <tbody className="text-gray-200">
              {
                absentUsers && absentUsers.map((item, index) => {
                  return <tr key={index} className="hover:bg-gray-700 transition">
                    <td className="px-6 py-4">{index + 1}</td>
                    <td className="px-6 py-4">{item?.name}</td>
                    {
                      item.aadhaarVerified ?
                        <td className="px-6 py-4 text-green-400">{item.aadhaar}</td>

                        :
                        <td className="px-6 py-4 text-red-400">{item.aadhaar}</td>

                    }

                    <td className="px-6 py-4 text-red-400">Absent</td>
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
