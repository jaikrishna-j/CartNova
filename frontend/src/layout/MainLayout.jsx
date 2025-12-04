import NavBar from '../components/ui/NavBar'
import Footer from '../components/ui/Footer'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { Outlet } from 'react-router-dom'

const MainLayout = ({numCartItems}) => {
  return (
    <div className='min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300'>
      <NavBar numCartItems={numCartItems}/>
      <ToastContainer />
      <main className='min-h-[calc(100vh-8rem)]'>
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default MainLayout
