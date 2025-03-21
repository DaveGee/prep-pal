import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'

function AppRoutes({ routes }) {
  return (
    <Routes>
      <Route path="/" element={<Navigate to={routes[0].link} />} />
      {routes.map((route) => (
        <Route key={route.label} path={route.link} element={<route.component />} />
      ))}
    </Routes>
  )
}

export default AppRoutes
