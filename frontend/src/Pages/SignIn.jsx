import { useState } from "react"
import { Heading } from "../Component/Heading"
import { SubHeading } from "../Component/SubHeading"
import { InputBox } from "../Component/Input"
import { Button } from "../Component/Button"
import { BottomWarning } from "../Component/BottomWarning"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import { baseUrl } from "../url"

export const Signin = () => {
    const [username,setUsername]=useState("");
    const [password,setPassword]=useState("");
    const [err,setErr]=useState("")
    const navigate=useNavigate()

    return <div className="bg-slate-300 h-screen flex justify-center">
    <div className="flex flex-col justify-center">
      <div className="rounded-lg bg-white w-80 text-center p-2 h-max px-4">
        <Heading label={"Sign in"} />
        <SubHeading label={"Enter your credentials to access your account"} />
        <InputBox onChange={e=>{
            setUsername(e.target.value)
        }} placeholder="harkirat@gmail.com" label={"Email"} />
        <InputBox onChange={e=>{
            setPassword(e.target.value)
        }} placeholder="123456" label={"Password"} />
        {err&&<p className="text-red-500 mt-2">{err}</p>}
        <div className="pt-4">
          <Button onClick={async()=>{
                            try{

                            
                            const responce =await axios.post(`${baseUrl}/api/users/signin`,{
                                username,
                                password
                            })
                            
                            localStorage.setItem("token", responce.data.token)
                            navigate("/dashboard")
                          }catch(err){
                            console.log(err)
                            if (err.response && err.response.status === 404) {
                              setErr("User Not Found"); // Set error message if username exists
                          } else {
                              setErr("Something went wrong. Please try again.");
                          }
                          }
                        }} label={"Sign in"} />
        </div>
        <BottomWarning label={"Don't have an account?"} buttonText={"Sign up"} to={"/"} />
      </div>
    </div>
  </div>
}