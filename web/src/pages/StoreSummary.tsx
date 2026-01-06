import type { Store } from '../types'
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
  List,
  ListItem,
  ListItemText,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material'
import { useEffect, useState } from 'react'
import { api } from '../api'

interface StoreForm { name: string, location?: string }

export default function StoreSummary() {
  const [stores, setStores] = useState<Store[]>([])
  const [storeId, setStoreId] = useState<string | number>('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | undefined>()
  const [summary, setSummary] = useState<any[]>([])

  const [openCreate, setOpenCreate] = useState(false)
  const [createForm, setCreateForm] = useState<StoreForm>({ name: '', location: '' })
  const [openEdit, setOpenEdit] = useState<{ open: boolean, store?: Store }>({ open: false })
  const [editForm, setEditForm] = useState<StoreForm>({ name: '', location: '' })

  const loadStores = async () => setStores(await api.getStores())

  useEffect(() => {
    (async () => {
      await loadStores()
    })()
  }, [])

  const loadSummary = async () => {
    setLoading(true)
    setError(undefined)
    try {
      const data = await api.getStoreSummary(storeId ? Number(storeId) : undefined)
      setSummary(data)
    }
    catch (e: any) {
      setError(e.message)
    }
    finally { setLoading(false) }
  }
  useEffect(() => {
    (async () => {
      await loadSummary()
    })()
  }, [storeId])

  const submitCreate = async () => {
    try {
      await api.createStore({ name: createForm.name, location: createForm.location })
      setOpenCreate(false)
      await loadStores()
      await loadSummary()
    }
    catch (e: any) { setError(e.message) }
  }

  const openEditDialog = (s: Store) => {
    setEditForm({ name: s.name, location: s.location || '' })
    setOpenEdit({ open: true, store: s })
  }
  const submitEdit = async () => {
    const id = openEdit.store!.id
    try {
      await api.updateStore(id, { name: editForm.name, location: editForm.location })
      setOpenEdit({ open: false })
      await loadStores()
      await loadSummary()
    }
    catch (e: any) {
      setError(e.message)
    }
  }

  const deleteStore = async (id: number) => {
    if (!confirm('Delete this store?'))
      return
    try {
      await api.deleteStore(id)
      await loadStores()
      await loadSummary()
    }
    catch (e: any) { setError(e.message) }
  }

  return (
    <Box>
      <Box mb={2} display="flex" gap={2}>
        <Select displayEmpty value={storeId} onChange={e => setStoreId(e.target.value)}>
          <MenuItem value=""><em>All Stores</em></MenuItem>
          {stores.map(s => <MenuItem key={s.id} value={s.id}>{s.name}</MenuItem>)}
        </Select>
        <Button variant="contained" onClick={() => setOpenCreate(true)}>New Store</Button>
      </Box>

      {/* Stores list with edit/delete (for convenience) */}
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>Stores</Typography>
          <List dense>
            {stores.map(s => (
              <ListItem
                key={s.id}
                secondaryAction={(
                  <Box>
                    <IconButton size="small" onClick={() => openEditDialog(s)}><EditIcon /></IconButton>
                    <IconButton size="small" color="error" onClick={() => deleteStore(s.id)}><DeleteIcon /></IconButton>
                  </Box>
                )}
              >
                <ListItemText primary={s.name} secondary={s.location || '—'} />
              </ListItem>
            ))}
          </List>
        </CardContent>
      </Card>

      {loading && <Box display="flex" justifyContent="center" my={4}><CircularProgress /></Box>}
      {error && <Alert severity="error">{error}</Alert>}
      {!loading && summary.length === 0 && <Alert severity="info">No data available</Alert>}

      <Grid container spacing={2}>
        {summary.map(s => (
          <Grid item xs={12} md={6} lg={4} key={s.storeId}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>{s.storeName}</Typography>
                <Typography>
                  Total Inventory Value: $
                  {s.totalInventoryValue.toFixed(2)}
                </Typography>
                <Typography>
                  Total Products:
                  {s.totalProducts}
                </Typography>
                <Typography>
                  Low Stock Count:
                  {s.lowStockCount}
                </Typography>
                <Typography>
                  Avg Price: $
                  {s.avgPrice.toFixed(2)}
                </Typography>
                <Box mt={1}>
                  <Typography variant="subtitle2">Top Categories</Typography>
                  {s.topCategories.map((c: any) => (
                    <Typography key={c.category}>
                      •
                      {c.category}
                      {' '}
                      (
                      {c.count}
                      )
                    </Typography>
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Create Store dialog */}
      <Dialog open={openCreate} onClose={() => setOpenCreate(false)} maxWidth="sm" fullWidth>
        <DialogTitle>New Store</DialogTitle>
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
                label="Location"
                fullWidth
                value={createForm.location}
                onChange={e => setCreateForm({ ...createForm, location: e.target.value })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCreate(false)}>Cancel</Button>
          <Button variant="contained" onClick={submitCreate}>Create</Button>
        </DialogActions>
      </Dialog>

      {/* Edit Store dialog */}
      <Dialog open={openEdit.open} onClose={() => setOpenEdit({ open: false })} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Store</DialogTitle>
        <DialogContent dividers>
          {openEdit.store
            ? (
                <Grid container spacing={2}>
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
                      label="Location"
                      fullWidth
                      value={editForm.location}
                      onChange={e => setEditForm({ ...editForm, location: e.target.value })}
                    />
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
