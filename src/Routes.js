import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import SetupScreen from './screens/SetupScreen'
import RecommendedScreen from './screens/RecommendedScreen'
import CurrentScreen from './screens/CurrentScreen'
import ShoppingListScreen from './screens/ShoppingListScreen'

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/setup" />} />
      <Route path="/setup" element={<SetupScreen />} />
      <Route path="/recommended" element={<RecommendedScreen />} />
      <Route path="/current" element={<CurrentScreen />} />
      <Route path="/shopping-list" element={<ShoppingListScreen />} />
    </Routes>
  )
}

export default AppRoutes
