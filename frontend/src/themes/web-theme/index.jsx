import React from "react";
import { Outlet } from "react-router-dom";
import { useNavigate ,useLocation} from 'react-router-dom'


export default function index() {
	const navigate = useNavigate()

	    const {pathname} = useLocation();



	return (
		<div className="w-full h-[100vh] py-2 flex flex-col items-center justify-center bg-neutral-800 text-neutral-50">
			<div className='flex items-center justify-center gap-2'>
				{
					pathname === "/mark-attendance" && <button onClick={() => navigate("/")} className='px-2 py-1 bg-cyan-900 rounded cursor-pointer shadow'>Back to Home</button>
				}
			</div>
			<div className="w-full h-full flex items-center justify-center ">

				<Outlet />
			</div>
		</div>
	);
}