import React from 'react'

function index() {
  return (
<div className="text-center px-4">
  <h1 className="text-9xl font-bold text-indigo-600">404</h1>
  <h2 className="text-3xl md:text-4xl font-semibold mt-4">Page Not Found</h2>
  <p className="text-gray-600 mt-2">
    Sorry, the page you are looking for doesn't exist or has been moved.
  </p>
  <a
    href="/"
    className="mt-6 inline-block bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition"
  >
    Go Back Home
  </a>
</div>
  )
}

export default index