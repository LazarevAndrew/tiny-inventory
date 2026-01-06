import type { PaginationMeta, Product, Store } from '../types'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
} from '@mui/material'
import { useEffect, useState } from 'react'
import { api } from '../api'

interface ProductForm {
  name: string
  category: string
  price: string
  quantity: string
  sku: string
  storeId: string
}

export default function ProductList() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | undefined>()
  const [products, setProducts] = useState<Product[]>([])
  const [meta, setMeta] = useState<PaginationMeta | undefined>()
  const [stores, setStores] = useState<Store[]>([])
  const [filters, setFilters] = useState({
    page: 1,
    pageSize: 10,
    storeId: '' as string | number,
    category: '',
    minPrice: '',
    maxPrice: '',
    minQty: '',
    maxQty: '',
    search: '',
    sortBy: 'name',
    sortOrder: 'asc' as 'asc' | 'desc',
  })

  // Dialog state
  const [openCreate, setOpenCreate] = useState(false)
  const [openEdit, setOpenEdit] = useState<{ open: boolean, product?: Product }>({ open: false })
  const emptyForm: ProductForm = { name: '', category: '', price: '', quantity: '', sku: '', storeId: '' }
  const [createForm, setCreateForm] = useState<ProductForm>(emptyForm)
  const [editForm, setEditForm] = useState<ProductForm>(emptyForm)

  useEffect(() => {
    (async () => {
      try {
        setStores(await api.getStores())
      }
      catch {}
    })()
  }, [])

  const fetchProducts = async () => {
    setLoading(true)
    setError(undefined)
    try {
      const result = await api.getProducts(filters)
      setProducts(result.items)
      setMeta(result.meta)
    }
    catch (e: any) {
      setError(e.message || 'Failed to load')
    }
    finally { setLoading(false) }
  }

  useEffect(() => {
    fetchProducts()
  }, [
    filters.page,
    filters.pageSize,
    filters.storeId,
    filters.category,
    filters.minPrice,
    filters.maxPrice,
    filters.minQty,
    filters.maxQty,
    filters.search,
    filters.sortBy,
    filters.sortOrder,
  ])

  const handlePageChange = (_: any, newPage: number) => setFilters({ ...filters, page: newPage + 1 })
  const handleRowsPerPageChange = (e: any) => setFilters({ ...filters, pageSize: Number.parseInt(e.target.value, 10), page: 1 })

  // Create product handlers
  const openCreateDialog = () => {
    setCreateForm(emptyForm)
    setOpenCreate(true)
  }
  const submitCreate = async () => {
    try {
      await api.createProduct({
        name: createForm.name,
        category: createForm.category,
        price: Number(createForm.price),
        quantity: Number(createForm.quantity),
        sku: createForm.sku,
        storeId: Number(createForm.storeId),
      })
      setOpenCreate(false)
      await fetchProducts()
    }
    catch (e: any) { setError(e.message) }
  }

  // Edit product handlers
  const openEditDialog = (p: Product) => {
    setEditForm({
      name: p.name,
      category: p.category,
      price: String(p.price),
      quantity: String(p.quantity),
      sku: p.sku,
      storeId: String(p.storeId),
    })
    setOpenEdit({ open: true, product: p })
  }
  const submitEdit = async () => {
    const id = openEdit.product!.id
    const payload: any = {
      name: editForm.name,
      category: editForm.category,
      price: Number(editForm.price),
      quantity: Number(editForm.quantity),
      sku: editForm.sku,
      storeId: Number(editForm.storeId),
    }
    try {
      await api.updateProduct(id, payload)
      setOpenEdit({ open: false })
      await fetchProducts()
    }
    catch (e: any) { setError(e.message) }
  }

  const deleteProduct = async (id: number) => {
    if (!confirm('Delete this product?'))
      return
    try {
      await api.deleteProduct(id)
      await fetchProducts()
    }
    catch (e: any) {
      setError(e.message)
    }
  }

  return (
    <Box>
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={3}>
              <TextField
                label="Search"
                fullWidth
                size="small"
                value={filters.search}
                onChange={e => setFilters({ ...filters, search: e.target.value, page: 1 })}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <Select
                fullWidth
                size="small"
                displayEmpty
                value={filters.storeId}
                onChange={e => setFilters({ ...filters, storeId: e.target.value as any, page: 1 })}
              >
                <MenuItem value=""><em>All Stores</em></MenuItem>
                {stores.map(s => <MenuItem key={s.id} value={s.id}>{s.name}</MenuItem>)}
              </Select>
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                label="Category"
                fullWidth
                size="small"
                value={filters.category}
                onChange={e => setFilters({ ...filters, category: e.target.value, page: 1 })}
              />
            </Grid>
            <Grid item xs={6} sm={1.5}>
              <TextField
                label="Min Price"
                fullWidth
                size="small"
                type="number"
                value={filters.minPrice}
                onChange={e => setFilters({ ...filters, minPrice: e.target.value, page: 1 })}
              />
            </Grid>
            <Grid item xs={6} sm={1.5}>
              <TextField
                label="Max Price"
                fullWidth
                size="small"
                type="number"
                value={filters.maxPrice}
                onChange={e => setFilters({ ...filters, maxPrice: e.target.value, page: 1 })}
              />
            </Grid>
            <Grid item xs={6} sm={1.5}>
              <TextField
                label="Min Qty"
                fullWidth
                size="small"
                type="number"
                value={filters.minQty}
                onChange={e => setFilters({ ...filters, minQty: e.target.value, page: 1 })}
              />
            </Grid>
            <Grid item xs={6} sm={1.5}>
              <TextField
                label="Max Qty"
                fullWidth
                size="small"
                type="number"
                value={filters.maxQty}
                onChange={e => setFilters({ ...filters, maxQty: e.target.value, page: 1 })}
              />
            </Grid>
            <Grid item xs={6} sm={2}>
              <Select fullWidth size="small" value={filters.sortBy} onChange={e => setFilters({ ...filters, sortBy: e.target.value as any })}>
                <MenuItem value="name">Name</MenuItem>
                <MenuItem value="category">Category</MenuItem>
                <MenuItem value="price">Price</MenuItem>
                <MenuItem value="quantity">Quantity</MenuItem>
              </Select>
            </Grid>
            <Grid item xs={6} sm={2}>
              <Select fullWidth size="small" value={filters.sortOrder} onChange={e => setFilters({ ...filters, sortOrder: e.target.value as any })}>
                <MenuItem value="asc">Asc</MenuItem>
                <MenuItem value="desc">Desc</MenuItem>
              </Select>
            </Grid>

            {/* New Product button */}
            <Grid item xs={12}>
              <Button variant="contained" onClick={openCreateDialog}>New Product</Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {loading && <Box display="flex" justifyContent="center" my={4}><CircularProgress /></Box>}
      {error && <Alert severity="error">{error}</Alert>}
      {!loading && products.length === 0 && <Alert severity="info">No products found</Alert>}
      {!loading && products.length > 0 && (
        <Box>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Category</TableCell>
                <TableCell align="right">Price</TableCell>
                <TableCell align="right">Qty</TableCell>
                <TableCell>Store</TableCell>
                <TableCell>SKU</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {products.map(p => (
                <TableRow key={p.id} hover>
                  <TableCell>{p.name}</TableCell>
                  <TableCell>{p.category}</TableCell>
                  <TableCell align="right">
                    $
                    {Number(p.price).toFixed(2)}
                  </TableCell>
                  <TableCell align="right">{p.quantity}</TableCell>
                  <TableCell>{p.store?.name}</TableCell>
                  <TableCell>{p.sku}</TableCell>
                  <TableCell align="right">
                    <IconButton size="small" onClick={() => openEditDialog(p)}><EditIcon /></IconButton>
                    <IconButton size="small" color="error" onClick={() => deleteProduct(p.id)}><DeleteIcon /></IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {meta && (
            <TablePagination
              component="div"
              count={meta.total}
              page={meta.page - 1}
              onPageChange={handlePageChange}
              rowsPerPage={meta.pageSize}
              onRowsPerPageChange={handleRowsPerPageChange}
              rowsPerPageOptions={[5, 10, 25]}
            />
          )}
        </Box>
      )}

      {/* Create Dialog */}
      <Dialog open={openCreate} onClose={() => setOpenCreate(false)} maxWidth="sm" fullWidth>
        <DialogTitle>New Product</DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Name"
                fullWidth
                value={createForm.name}
                onChange={e => setCreateForm({ ...createForm, name: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Category"
                fullWidth
                value={createForm.category}
                onChange={e => setCreateForm({ ...createForm, category: e.target.value })}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Price"
                type="number"
                fullWidth
                value={createForm.price}
                onChange={e => setCreateForm({ ...createForm, price: e.target.value })}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Quantity"
                type="number"
                fullWidth
                value={createForm.quantity}
                onChange={e => setCreateForm({ ...createForm, quantity: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="SKU"
                fullWidth
                value={createForm.sku}
                onChange={e => setCreateForm({ ...createForm, sku: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <Select
                fullWidth
                displayEmpty
                value={createForm.storeId}
                onChange={e => setCreateForm({ ...createForm, storeId: e.target.value as string })}
              >
                <MenuItem value=""><em>Select Store</em></MenuItem>
                {stores.map(s => <MenuItem key={s.id} value={String(s.id)}>{s.name}</MenuItem>)}
              </Select>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCreate(false)}>Cancel</Button>
          <Button variant="contained" onClick={submitCreate}>Create</Button>
        </DialogActions>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={openEdit.open} onClose={() => setOpenEdit({ open: false })} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Product</DialogTitle>
        <DialogContent dividers>
          {openEdit.product
            ? (
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Typography variant="caption">
                      ID:
                      {openEdit.product.id}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Name"
                      fullWidth
                      value={editForm.name}
                      onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Category"
                      fullWidth
                      value={editForm.category}
                      onChange={e => setEditForm({ ...editForm, category: e.target.value })}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      label="Price"
                      type="number"
                      fullWidth
                      value={editForm.price}
                      onChange={e => setEditForm({ ...editForm, price: e.target.value })}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      label="Quantity"
                      type="number"
                      fullWidth
                      value={editForm.quantity}
                      onChange={e => setEditForm({ ...editForm, quantity: e.target.value })}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="SKU"
                      fullWidth
                      value={editForm.sku}
                      onChange={e => setEditForm({ ...editForm, sku: e.target.value })}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Select
                      fullWidth
                      displayEmpty
                      value={editForm.storeId}
                      onChange={e => setEditForm({ ...editForm, storeId: e.target.value as string })}
                    >
                      <MenuItem value=""><em>Select Store</em></MenuItem>
                      {stores.map(s => <MenuItem key={s.id} value={String(s.id)}>{s.name}</MenuItem>)}
                    </Select>
                  </Grid>
                </Grid>
              )
            : null}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEdit({ open: false })}>Cancel</Button>
          <Button variant="contained" onClick={submitEdit}>Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
