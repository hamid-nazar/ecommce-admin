"use client"
import React from 'react';
import { ResponsiveContainer, Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';
interface OverviewProps {
    data: any[]
}
export function Overview({data}: OverviewProps) {
  return (
    <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
            <XAxis 
            dataKey="name" 
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false} />


            <YAxis 
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false} 
            tickFormatter={(value: any) => `$${value}`}/>

        <Bar
        dataKey="total" 
        fill="#3498db"
        radius={[4,4, 0, 0]}/>      
        </BarChart>

    </ResponsiveContainer>
  )
}
