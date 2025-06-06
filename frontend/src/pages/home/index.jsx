import React, { useState, useEffect } from 'react';
import { db } from '../../utils/indexdb';
import { useNavigate, useLocation } from 'react-router-dom'
import {storeFaceModelsToIndexedDB} from "../../utils/face-api-models"
import { syncUsersFromServerToLocal, syncAttendanceFromServerToLocal } from "../../utils/syncServerToLocal"
import { syncUsersFromLocalToServer, syncAttendanceFromLocalToServer } from "../../utils/syncLocalToServer"

const Home = () => {
  const navigate = useNavigate()

  const [toggle, setToggle] = useState(false)

  async function initModelCaching() {
  const existing = await db.models.get('ssd_manifest');
  if (!existing) {
    console.log('Saving face models to IndexedDB...');
    await storeFaceModelsToIndexedDB();
  } else {
    console.log('Face models already cached in IndexedDB');
  }
}

  useEffect(() => {
    const handleOnline = async () => {
      await initModelCaching();
      await syncUsersFromLocalToServer();
      await syncAttendanceFromLocalToServer();
      await syncUsersFromServerToLocal();
      await syncAttendanceFromServerToLocal();
    };

    if (window.navigator.onLine) {
      handleOnline()
    }

    window.addEventListener('online', handleOnline);
    return () => window.removeEventListener('online', handleOnline);
  }, []);


  return (
    <div className=" flex items-center justify-center  text-white">
      <div className="text-center px-4">
        <h1 className="text-5xl font-bold mb-4">Welcome to the Attendance System</h1>
        <p className="text-lg mb-8">Mark your presence using face recognition and Aadhaar verification.</p>
        {
          toggle ?

            <div className='flex items-center justify-center gap-2'>
              <button onClick={() => navigate("/mark-attendance")} className="bg-white text-cyan-800 shadow font-semibold px-6 py-2 rounded-lg hover:bg-gray-200 transition">
                Mark Attendence
              </button>
              <button onClick={() => navigate("/admin/dashboard")} className="bg-white text-cyan-800 shadow font-semibold px-6 py-2 rounded-lg hover:bg-gray-200 transition">
                Admin
              </button>
            </div>
            :

            <button onClick={() => setToggle(!toggle)} className="bg-white text-cyan-800 shadow font-semibold px-6 py-2 rounded-lg hover:bg-gray-200 transition">
              Get Started
            </button>
        }
      </div>
    </div>
  );
};

export default Home;
