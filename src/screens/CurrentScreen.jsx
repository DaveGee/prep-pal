import React from 'react'

function CurrentScreen() {
  return (
    <Container fluid>
      <Title order={1} mb="md">My current stock</Title>
      
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
          <Loader size="xl" />
        </div>
      ) : (
        <Table striped highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Product</Table.Th>
              <Table.Th>Description</Table.Th>
              <Table.Th>Quantity</Table.Th>
              <Table.Th className={classes.overrideColumn}>Override</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{rows}</Table.Tbody>
        </Table>
      )}
    </Container>
  )
}

export default CurrentScreen
