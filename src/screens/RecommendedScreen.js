import React, { useState, useEffect } from 'react'
import { Table } from '@mantine/core'
import recommendations from '../data/recommendation.json'

function RecommendedScreen() {
  const [data, setData] = useState([])

  useEffect(() => {
    setData(recommendations)
  }, [])

  const rows = data.map((item) => (
    <tr key={item.productType}>
      <td>{item.productType}</td>
      <td>{item.description}</td>
      <td>{item.quantity}</td>
    </tr>
  ))

  return (
    <div>
      <h1>Recommended</h1>
      <Table striped>
        <thead>
          <tr>
            <th>Product Type</th>
            <th>Description</th>
            <th>Quantity</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </Table>
    </div>
  )
}

export default RecommendedScreen
