import React from 'react'
import { CreditCard, DollarSign, Package } from 'lucide-react'
import { Heading } from '@/components/ui/Heading'
import { Separator } from '@/components/ui/separator'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { formatter } from '@/lib/utils'
import { getTotalRevenue } from '@/actions/getTotalRevenue'
import { getTotalSales } from '@/actions/getTotalSales'
import { getTotalProductsInStock } from '@/actions/getTotalProductsInStock'
import { Overview } from '@/components/Overview'
import { GetGraphRevenue } from '@/actions/GetGraphRevenue'

export default async function DashboardPage({params}: {params: { storeId: string }}) {

  const totalRevenue = await getTotalRevenue(params.storeId);

  const totalSales = await getTotalSales(params.storeId);

  const totalProductsInStock = await getTotalProductsInStock(params.storeId);

  const revenueGraphData = await GetGraphRevenue(params.storeId);

  return (
    <div className='flex flex-col'>

      <div className='flex-1 space-y-4 p-8 pt-6'>
        
        <Heading title="Dashboard" description='Overview of your store'/>
        <Separator/>
        <div className='grid grid-cols-3 gap-4'>

          <Card>
          <CardHeader className='flex flex-row items-center justify-between pb-2 space-y-0'>
            <CardTitle className='text-sm font-medium'>
              Total Revenue
            </CardTitle>
          <DollarSign className='h-4 w-4 text-muted-foreground'/>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>
              {formatter.format(totalRevenue)}
            </div>

          </CardContent>
          </Card>

          <Card>
          <CardHeader className='flex flex-row items-center justify-between pb-2 space-y-0'>
            <CardTitle className='text-sm font-medium'>
              Sales
            </CardTitle>
          <CreditCard className='h-4 w-4 text-muted-foreground'/>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>
             +{totalSales}
            </div>

          </CardContent>
          </Card>

          <Card>
          <CardHeader className='flex flex-row items-center justify-between pb-2 space-y-0'>
            <CardTitle className='text-sm font-medium'>
              Products in Stock
            </CardTitle>
          <Package className='h-4 w-4 text-muted-foreground'/>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>
              {totalProductsInStock}
            </div>

          </CardContent>
          </Card>

        </div>
        <Card className="col-span-4">

          <CardHeader>
            <CardTitle>
              Overview
            </CardTitle>
          </CardHeader>

          <CardContent className='pl-2'>
            <Overview data={revenueGraphData}/>
          </CardContent>

        </Card>

      </div>
      
    </div>
  )
}
