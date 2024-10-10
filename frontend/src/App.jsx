import {
  BrowserRouter,
  Route,
  Routes,
} from "react-router-dom";
import { Dashboard } from "./Pages/Dashboard"
import { SignUp } from "./Pages/SignUp";
import { Signin } from "./Pages/SignIn";
import { SendMoney } from "./Pages/SendMoney";
import { ProtectedRoute } from "./Pages/ProtectedRoute";
import { PublicRoute } from "./Pages/Islogin";

function App() {

  return (
    <div>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<PublicRoute><SignUp/></PublicRoute>}/>
            <Route path="/signup" element={<PublicRoute><SignUp/></PublicRoute>}/>
            <Route path="/signin" element={<PublicRoute><Signin/></PublicRoute>}/>
            <Route
             path="/dashboard" 
             element={
              <ProtectedRoute>
                <Dashboard></Dashboard>
              </ProtectedRoute>}/>
            <Route 
             path="/send"
             element={
              <ProtectedRoute>
                <SendMoney/>
              </ProtectedRoute>}/>
          </Routes>
        </BrowserRouter>
    </div>
  )
}

export default App
