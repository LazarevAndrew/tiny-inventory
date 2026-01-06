import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

// Use the database URL provided by docker-compose in the container's env
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter })

async function main() {
  await prisma.product.deleteMany()
  await prisma.store.deleteMany()

  await prisma.store.createMany({
    data: [
      { name: 'Downtown Market', location: 'City Center' },
      { name: 'Suburb Depot', location: 'Northside' },
      { name: 'Outlet Hub', location: 'Industrial Park' },
    ],
  })

  const [downtown, suburb, outlet] = await prisma.store.findMany({ orderBy: { id: 'asc' } })

  await prisma.product.createMany({
    data: [
      { name: 'Red Apple', category: 'Grocery',  price: 0.99,  quantity: 120, sku: 'APL-RED-001', storeId: downtown.id },
      { name: 'Banana',     category: 'Grocery',  price: 0.59,  quantity: 80,  sku: 'BAN-YEL-001', storeId: downtown.id },
      { name: 'LED Bulb',   category: 'Hardware', price: 4.50,  quantity: 25,  sku: 'LED-BLB-060', storeId: downtown.id },

      { name: 'Laptop Sleeve', category: 'Electronics', price: 19.99, quantity: 15, sku: 'ELC-SLV-015', storeId: suburb.id },
      { name: 'USB-C Cable',   category: 'Electronics', price: 9.99,  quantity: 60, sku: 'USB-C-060',   storeId: suburb.id },
      { name: 'Coffee Beans',  category: 'Grocery',     price: 12.50, quantity: 40, sku: 'CAF-BNS-040', storeId: suburb.id },

      { name: 'Safety Gloves', category: 'Hardware', price: 7.25, quantity: 10,  sku: 'HW-GLO-010', storeId: outlet.id },
      { name: 'Paint Brush',   category: 'Hardware', price: 3.75, quantity: 30,  sku: 'HW-PBR-030', storeId: outlet.id },
      { name: 'Mineral Water', category: 'Grocery',  price: 1.25, quantity: 200, sku: 'GR-WAT-200', storeId: outlet.id },
    ],
  })

  console.log('Seed completed')
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
