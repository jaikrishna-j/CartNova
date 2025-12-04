import NavBar from '../components/ui/NavBar'
import Footer from '../components/ui/Footer'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { Outlet } from 'react-router-dom'

const MainLayout = ({numCartItems}) => {
  return (
    <>
      <NavBar numCartItems={numCartItems}/>
      <ToastContainer />
        <Outlet />
      <Footer />
    </>
  )
}

export default MainLayout
