
import { useEffect, useState } from "react"
import { getAllUsers, getAllPresentUsers, getAllAbsentUsers } from "../../../utils/attendances"

export default function Index() {

  const [users, setUsers] = useState(0)
  const [presentUsers, setPresentUsers] = useState(0)
  const [absentUsers, setAbsentUsers] = useState(0)


  const getDashBoardData = async () => {
    const res = await getAllUsers()
    setUsers(res.length)
    const res2 = await getAllPresentUsers()
    setPresentUsers(res2.length)
    const res3 = await getAllAbsentUsers()
    setAbsentUsers(res3.length)
  }


  useEffect(() => {
    getDashBoardData()
  }, [])


  return (
    <>
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 text-white">
          {/* <!-- Total Users --> */}
          <div className="bg-gray-900 rounded-2xl p-6 shadow-lg border border-gray-800 hover:scale-105 transition h-28">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Total Users</p>
                <h2 className="text-3xl font-bold text-white mt-2">{users}</h2>
              </div>
              <div className="text-indigo-400 bg-indigo-800/20 p-3 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none"
                  viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M17 20h5v-2a3 3 0 00-3-3h-4a3 3 0 00-3 3v2h5zm0-9a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
            </div>
          </div>

          {/* <!-- Present Users --> */}
          <div className="bg-gray-900 rounded-2xl p-6 shadow-lg border border-gray-800 hover:scale-105 transition h-28">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Present Today</p>
                <h2 className="text-3xl font-bold text-green-400 mt-2">{presentUsers}</h2>
              </div>
              <div className="text-green-400 bg-green-800/20 p-3 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none"
                  viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
          </div>

          {/* <!-- Absent Users --> */}
          <div className="bg-gray-900 rounded-2xl p-6 shadow-lg border border-gray-800 hover:scale-105 transition h-28">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Absent Today</p>
                <h2 className="text-3xl font-bold text-red-400 mt-2">{absentUsers}</h2>
              </div>
              <div className="text-red-400 bg-red-800/20 p-3 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none"
                  viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
            </div>
          </div>
        </div>

      </div>


    </>
  )
}
