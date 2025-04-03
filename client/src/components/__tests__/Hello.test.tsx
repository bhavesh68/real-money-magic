import { render, screen } from '@testing-library/react'
import React from 'react'

function Hello() {
  return <h1>Hello World</h1>
}

test('renders Hello World', () => {
  render(<Hello />)
  expect(screen.getByText(/hello world/i)).toBeInTheDocument()
})
