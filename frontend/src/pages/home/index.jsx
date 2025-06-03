import React, { useState } from 'react';
import { useNavigate ,useLocation} from 'react-router-dom'


const Home = () => {
    const navigate = useNavigate()

    const [toggle,setToggle] = useState(false)

  
  return (
    <div className=" flex items-center justify-center  text-white">
      <div className="text-center px-4">
        <h1 className="text-5xl font-bold mb-4">Welcome to the Attendance System</h1>
        <p className="text-lg mb-8">Mark your presence using face recognition and Aadhaar verification.</p>
        {
          toggle ?
          
        <div className='flex items-center justify-center gap-2'>
        <button onClick={()=>navigate("/mark-attendance")} className="bg-white text-cyan-800 shadow font-semibold px-6 py-2 rounded-lg hover:bg-gray-200 transition">
          Mark Attendence
        </button>
        <button onClick={()=>navigate("/admin/dashboard")} className="bg-white text-cyan-800 shadow font-semibold px-6 py-2 rounded-lg hover:bg-gray-200 transition">
          Admin
        </button>
        </div>
        :
        
        <button onClick={()=>setToggle(!toggle)} className="bg-white text-cyan-800 shadow font-semibold px-6 py-2 rounded-lg hover:bg-gray-200 transition">
          Get Started
        </button>
}
      </div>
    </div>
  );
};

export default Home;
