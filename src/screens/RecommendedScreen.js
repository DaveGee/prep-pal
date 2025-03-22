import React, { useState, useEffect } from 'react'
import { Container, Table, Title } from '@mantine/core'
import recommendations from '../data/productCategories.json'

function RecommendedScreen() {
  const [data, setData] = useState([])

  useEffect(() => {
    setData(recommendations.baseCategories)
  }, [])

  const rows = data.map((item) => (
    <Table.Tr key={item.productType}>
      <Table.Td>{item.productType}</Table.Td>
      <Table.Td>{item.description}</Table.Td>
      <Table.Td>{item.quantity}</Table.Td>
      <Table.Td></Table.Td>
    </Table.Tr>
  ))

  return (
    <Container fluid>
      <Title order="1">Recommended product to have stored</Title>
      <Table striped>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Product type</Table.Th>
            <Table.Th>Description</Table.Th>
            <Table.Th>Quantity</Table.Th>
            <Table.Th>Override</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>
    </Container>
  )
}

export default RecommendedScreen
