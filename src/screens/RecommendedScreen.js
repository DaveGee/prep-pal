import React, { useState, useEffect } from 'react'
import { Container, NumberInput, Table, Title } from '@mantine/core'
import recommendations from '../data/productCategories.json'
import classes from './RecommendedScreen.module.css'

function RecommendedScreen() {
  const [data, setData] = useState([])

  useEffect(() => {
    setData(recommendations.baseCategories)
  }, [])

  const rows = data.map((item, index) => (
    <Table.Tr key={item.productType}>
      <Table.Td>{item.productType}</Table.Td>
      <Table.Td>{item.description}</Table.Td>
      <Table.Td>{item.quantity}</Table.Td>
      <Table.Td className={classes.overrideColumn}>
        <NumberInput
          value={item.quantityOverride || ''}
          onChange={(value) => {
            const updatedData = [...data]
            updatedData[index] = { ...item, quantityOverride: value }
            setData(updatedData)
          }}
        />
      </Table.Td>
    </Table.Tr>
  ))

  return (
    <Container fluid>
      <Title order="1">Recommended product to have stored</Title>
      <Table striped highlightOnHover>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Product type</Table.Th>
            <Table.Th>Description</Table.Th>
            <Table.Th>Quantity</Table.Th>
            <Table.Th className={classes.overrideColumn}>Override</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>
    </Container>
  )
}

export default RecommendedScreen
