import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import SetupScreen from './screens/SetupScreen'

function AppRoutes({ routes }) {
  return (
    <Routes>
      <Route index element={<SetupScreen />} />
      {routes.map((route) => (
        <Route key={route.id} path={route.link} element={<route.component />} />
      ))}
    </Routes>
  )
}

export default AppRoutes
