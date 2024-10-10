import axios from "axios";
import { useEffect,useState } from "react";
import { Button } from "./Button";
import { useNavigate } from "react-router-dom";
import { baseUrl } from "../url";


export const Users=()=>{
    const [users,setUsers]=useState([])
    const [filter,setFilter]=useState([])

    useEffect(()=>{
        axios.get(`${baseUrl}/api/users/finduser?filter=${filter}`)
        .then(res=>{
            setUsers(res.data.user)
        })
        
    },[filter])
    return(
        <>
            <div className="font-bold mt-6 text-lg">
                Users
            </div>
            <div className="my-2">
                <input onChange={(e)=>{
                    setFilter(e.target.value)
                }} placeholder="Search users..."  type="text" className="w-full px-2 py-1 border rounded border-slate-200" />
            </div>
            <div>
                {users.map(user=><User key={user.id} user={user}/>)}
            </div>
        </>
    )
}

function User({user}){
    const navigate = useNavigate();
    return (
        <div className="flex justify-between mt-4">
            <div className="flex">
                <div className="rounded-full h-12 w-12 bg-slate-200 flex justify-center mt-1 mr-2">
                    <div className="flex flex-col justify-center h-full text-xl">
                        {user.firstname[0]}
                        
                    </div>
                </div>
                <div className="flex flex-col justify-center h-ful">
                    <div>
                        {user.firstname}    {user.lastname}
                    </div>
                </div>
            </div>
            <div>
                <Button onClick={(e)=>{
                     navigate("/send?id=" + user.id + "&name=" + user.firstname);
                }} label={"Send Money"}/>
            </div>
        </div>
    )
}