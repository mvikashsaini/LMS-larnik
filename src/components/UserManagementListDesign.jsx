import React from 'react'
import ProgressBar from './ProgressBar'
import StatusButton from './StatusButton'

export default function UserManagementListDesign({
  name = "Vikash Saini",
  mail = "vikash@mail.com",
  phone = +917231842488,
  
  courses = "5",
 
  last_login = "12-08-2025",
  status_title = "active",
  status_colour = "yellow",
  progress_val = 50
}) {
  return (
   <>
   <div className='flex bg-white justify-between p-2 items-center border-t-2 border-black'>
    <input type="checkbox" />
    <div className='flex flex-col items-start w-1/4 truncate'>
      <span className='font-bold'>{name}</span>
      <span>{mail}</span>
      </div>
    <span className='w-1/6'>{phone}</span>
    <div className='w-1/12'>
      <StatusButton  title={status_title} colour={status_colour}/>
    </div>
    <span className='w-1/12'>{courses}</span>
    <div className='w-1/12'>
      <ProgressBar progress={progress_val}/>
    </div>
    <span className='w-1/12'>{last_login}</span>
    <span className='w-1/12'>
      <select name="" id="">
        <option value="">Approve</option>
        <option value="">Delete</option>
        <option value="">Pending</option>
      </select>
    </span>
   </div>
   </>
  )
}
