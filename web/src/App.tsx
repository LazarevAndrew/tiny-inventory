import { AppBar, Button, Container, Toolbar, Typography } from '@mui/material'
import { BrowserRouter, Link, Navigate, Route, Routes } from 'react-router-dom'
import ProductList from './pages/ProductList'
import StoreSummary from './pages/StoreSummary'

export default function App() {
  return (
    <BrowserRouter>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>Tiny Inventory</Typography>
          <Button color="inherit" component={Link} to="/products">Products</Button>
          <Button color="inherit" component={Link} to="/stores">Stores</Button>
        </Toolbar>
      </AppBar>
      <Container sx={{ mt: 3 }}>
        <Routes>
          <Route path="/products" element={<ProductList />} />
          <Route path="/stores" element={<StoreSummary />} />
          <Route path="*" element={<Navigate to="/products" />} />
        </Routes>
      </Container>
    </BrowserRouter>
  )
}
