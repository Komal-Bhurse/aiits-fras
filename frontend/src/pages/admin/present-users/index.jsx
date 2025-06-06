
import { useEffect, useState } from "react"
import {  getAllPresentUsers } from "../../../utils/attendances"



export default function Index() {

  const [presentUsers, setPresentUsers] = useState([])

  const getDashBoardData = async () => {
      const res2 = await getAllPresentUsers()
      setPresentUsers(res2)
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
                <th className="px-6 py-3 text-left">Date</th>
              </tr>
            </thead>
            <tbody className="text-gray-200">
              {
                presentUsers && presentUsers.map((item, index) => {
                  return <tr key={index} className="hover:bg-gray-700 transition">
                    <td className="px-6 py-4">{index + 1}</td>
                    <td className="px-6 py-4">{item.user.name}</td>
                    {
                      item.user.aadhaarVerified ?
                        <td className="px-6 py-4 text-green-400">{item.user.aadhaar}</td>

                        :
                        <td className="px-6 py-4 text-red-400">{item.user.aadhaar}</td>

                    }

                    <td className="px-6 py-4 text-green-400">Present</td>
                    <td className="px-6 py-4">{item.signInAt}</td>
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
