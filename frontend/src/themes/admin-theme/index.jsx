import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { useNavigate } from 'react-router-dom'


import { Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { Bars3Icon, BellIcon, XMarkIcon, } from '@heroicons/react/24/outline'
import { Link, useLocation } from 'react-router-dom'

import { syncUsersFromServerToLocal, syncAttendanceFromServerToLocal } from "../../utils/syncServerToLocal"
import { syncUsersFromLocalToServer, syncAttendanceFromLocalToServer } from "../../utils/syncLocalToServer"
import { useOnlineStatus } from '../../hooks/checkOnOffStatus';


const user = {
	name: 'Tom Cook',
	email: 'tom@example.com',
	imageUrl:
		'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
}
const navigation = [
	{ name: 'Dashboard', href: '/admin/dashboard', current: true },
	{ name: 'Users', href: '/admin/users', current: false },
	{ name: 'Present Users', href: '/admin/present-users', current: false },
	{ name: 'Absent users', href: '/admin/absent-users', current: false },
]
const userNavigation = [
	{ name: 'Your Profile', href: '#' },
	{ name: 'Settings', href: '#' },
	{ name: 'Sign out', href: '#' },
]

function classNames(...classes) {
	return classes.filter(Boolean).join(' ')
}

export default function index() {

	const isOnline = useOnlineStatus()


	const navigate = useNavigate()
	const { pathname } = useLocation()

	const breadCrum = pathname.split("/")[2].split("-").map(str => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()).join(" ")

	

	useEffect(() => {

		const handleOnline = async () => {
			await syncUsersFromLocalToServer();
			await syncAttendanceFromLocalToServer();
			await syncUsersFromServerToLocal();
			await syncAttendanceFromServerToLocal();
		};

		if (isOnline) {
			handleOnline()
		}

	}, [isOnline]);

	return (
		<div className="w-full h-[100vh] flex flex-col items-center justify-center bg-neutral-800 text-neutral-50">
			<div className="min-h-full w-full">
				<Disclosure as="nav" className="bg-gray-800">
					<div className="mx-auto w-full px-4 sm:px-6 lg:px-8">
						<div className="flex h-16 items-center justify-between">
							<div className="flex items-center">
								<div className="shrink-0">
									<h1 onClick={() => navigate("/")} className="cursor-pointer text-center text-2xl/9 font-bold tracking-tight text-cyan-700">
										AIITS
									</h1>
								</div>
								<div className="hidden md:block">
									<div className="ml-10 flex items-baseline space-x-4">
										{navigation.map((item) => (
											<Link
												key={item.name}
												to={item.href}
												aria-current={item.href === pathname ? 'page' : undefined}
												className={classNames(
													item.href === pathname ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
													'rounded-md px-3 py-2 text-sm font-medium',
												)}
											>
												{item.name}
											</Link>
										))}
									</div>
								</div>
							</div>
							<div className="hidden md:block">

								<div className="ml-4 flex items-center gap-2 md:ml-6">
									<button
										onClick={() => navigate("/admin/user-register")}
										type="button"
										className="cursor-pointer relative flex items-center border px-3 shadow rounded-full bg-gray-900 p-1 text-gray-400 hover:text-white"
									>
										<span className="absolute -inset-1.5" />
										<span className="sr-only">Add New</span>
										<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-5">
											<path fillRule="evenodd" d="M12 3.75a.75.75 0 0 1 .75.75v6.75h6.75a.75.75 0 0 1 0 1.5h-6.75v6.75a.75.75 0 0 1-1.5 0v-6.75H4.5a.75.75 0 0 1 0-1.5h6.75V4.5a.75.75 0 0 1 .75-.75Z" clipRule="evenodd" />
										</svg>Add New
									</button>
									<button
										type="button"
										className=" cursor-pointer relative rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 focus:outline-hidden"
									>
										<span className="absolute -inset-1.5" />
										<span className="sr-only">View notifications</span>
										<BellIcon aria-hidden="true" className="size-6" />
									</button>

									{/* Profile dropdown */}
									<Menu as="div" className="relative ml-3">
										<div >
											<MenuButton className="relative flex max-w-xs items-center rounded-full bg-gray-800 text-sm focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 focus:outline-hidden">
												<span className="absolute -inset-1.5" />
												<span className="sr-only">Open user menu</span>
												<img alt="" src={user.imageUrl} className="size-8  rounded-full" />
											</MenuButton>
										</div>
										<MenuItems
											transition
											className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black/5 transition focus:outline-hidden data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
										>
											{userNavigation.map((item) => (
												<MenuItem key={item.name}>
													<a
														href={item.href}
														className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:outline-hidden"
													>
														{item.name}
													</a>
												</MenuItem>
											))}
										</MenuItems>
									</Menu>
								</div>
							</div>
							<div className="-mr-2 flex md:hidden">
								{/* Mobile menu button */}
								<DisclosureButton className="group relative inline-flex items-center justify-center rounded-md bg-gray-800 p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 focus:outline-hidden">
									<span className="absolute -inset-0.5" />
									<span className="sr-only">Open main menu</span>
									<Bars3Icon aria-hidden="true" className="block size-6 group-data-open:hidden" />
									<XMarkIcon aria-hidden="true" className="hidden size-6 group-data-open:block" />
								</DisclosureButton>
							</div>
						</div>
					</div>

					<DisclosurePanel className="md:hidden">
						<div className="space-y-1 px-2 pt-2 pb-3 sm:px-3">
							{navigation.map((item) => (
								<DisclosureButton
									key={item.name}
									as="a"
									href={item.href}
									aria-current={item.current ? 'page' : undefined}
									className={classNames(
										item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
										'block rounded-md px-3 py-2 text-base font-medium',
									)}
								>
									{item.name}
								</DisclosureButton>
							))}
						</div>

						<div className="border-t border-gray-700 pt-4 pb-3">


							<div className="flex items-center px-5">
								<div className="shrink-0">
									<img alt="" src={user.imageUrl} className="size-10  rounded-full" />
								</div>
								<div className="ml-3">
									<div className="text-base/5 font-medium text-white">{user.name}</div>
								</div>
								<button
									type="button"
									className="relative ml-auto shrink-0 rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 focus:outline-hidden"
								>
									<span className="absolute -inset-1.5" />
									<span className="sr-only">View notifications</span>
									<BellIcon aria-hidden="true" className="size-6" />

								</button>
							</div>
							<div className="mt-3 space-y-1 px-2">
								{userNavigation.map((item) => (
									<DisclosureButton
										key={item.name}
										as="a"
										href={item.href}
										className="block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-gray-700 hover:text-white"
									>
										{item.name}
									</DisclosureButton>
								))}
							</div>
						</div>
					</DisclosurePanel>
				</Disclosure>

				<header className="bg-white shadow-sm">
					<div className="mx-auto max-w-7xl px-4 py-1 sm:px-6 lg:px-8">
						<h1 className="text-3xl font-bold tracking-tight text-gray-900">{breadCrum}</h1>
					</div>
				</header>
				<main>
					<Outlet />
				</main>
			</div>
		</div>
	);
}