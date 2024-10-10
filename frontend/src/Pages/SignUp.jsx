import { useState } from "react"
import { BottomWarning } from "../Component/BottomWarning"
import { Button } from "../Component/Button"
import { Heading } from "../Component/Heading"
import { InputBox } from "../Component/Input"
import { SubHeading } from "../Component/SubHeading"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import { baseUrl } from "../url"

export const SignUp=()=>{
    const [firstname, setFirstName] = useState("");
    const [lastname, setLastName] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("")
    const navigate=useNavigate()
    return (
        <div className="bg-slate-300 h-screen flex justify-center">
            <div className="flex flex-col justify-center">
                <div className="rounded-lg bg-white w-80 text-center p-2 h-max px-4">
                    <Heading label={SignUp}/>
                    <SubHeading label={"Enter your infromation to create an account"}/>
                    <InputBox onChange={e => {
                        setFirstName(e.target.value);
                    }}placeholder={"Dinesh"} label={"first Name"} />
                    <InputBox onChange={e=>{
                        setLastName(e.target.value);
                    }} placeholder={"Arekar"} label={"Last Name"}/>
                    <InputBox onChange={e=>{
                        setUsername(e.target.value);
                    }} placeholder={"abcd@gmail.com"} label={"Email"}/>
                    <InputBox onChange={e=>{
                        setPassword(e.target.value);
                    }} placeholder={"123456"} label={"Password"}/>
                    {error && <p className="text-red-500 mt-2">{error}</p>} 
                    <div className="mt-5">
                        
                        <Button onClick={async()=>{
                            try{
                            const responce =await axios.post(`${baseUrl}/api/users/signup`,{
                                username,
                                firstname,
                                lastname,
                                password
                            })
                            localStorage.setItem("token", responce.data.token)
                            navigate("/dashboard")
                        }catch(err){
                            if (err.response && err.response.status === 411) {
                                setError("Email already taken"); // Set error message if username exists
                            } else {
                                setError("Something went wrong. Please try again.");
                            }
                        }
                        }} label={"Sign Up"}/>
                    </div>
                    <BottomWarning label={"Already have an account?"} buttonText={"SignIn"} to={"/signin"}/>
                </div>
            </div>
        </div>
    )
}