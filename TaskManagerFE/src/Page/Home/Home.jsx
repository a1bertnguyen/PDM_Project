import React from 'react'
import TaskList from '../TaskList/TaskList'
import SideBar from './SideBar'

const Home = () => {
  return (
    <div className='lg:flex px-5 lg:px-20 pt-[2.9vh]'>
        <div className='hidden lg:block w-[25vw]  relative'>
             <SideBar/> 
        </div>

        <div className='w-full flex justify-center mb-10'>
            <TaskList/>
        </div>
        
    </div>
  )
}

export default Home