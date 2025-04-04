'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import axios from "axios";

export default function SignupForm() {
  const [error, setError] = useState('')
  const [user,setUser] = useState({
    username:"",
    email:"",
    password:"",
    dateOfBirth:""
  });
  const [button,setButton] = useState(true);
  const router = useRouter()

  useEffect(()=>{
    if(user.username && user.email && user.password.length>8){
      setButton(false);
    }
    else{
      setButton(true);
    }
  },[user])
  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')

    const result = await axios.post(`${process.env.BACKEND_URL}/api/v1/users/signup`, user)

    if (result.data.error) {
      setError(result.data.error)
    } else if (result.data.success) {
      await router.push('/user/login') // Redirect to dashboard on successful signup
    }
  }

  return (
    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
      <div className="rounded-md shadow-sm -space-y-px">
        <div>
          <Label htmlFor="name" className="sr-only">
            Full Name
          </Label>
          <Input
            id="name"
            name="name"
            type="text"
            required
            className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
            placeholder="Full Name"
            onChange={(e) => setUser({...user, username: e.target.value})}
          />
        </div>
        <div>
          <Label htmlFor="email-address" className="sr-only">
            Email address
          </Label>
          <Input
            id="email-address"
            name="email"
            type="email"
            autoComplete="email"
            required
            className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
            placeholder="Email address"
            onChange={(e) => setUser({...user, email: e.target.value})}
          />
        </div>
        <div>
          <Label htmlFor="password" className="sr-only">
            Password
          </Label>
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            required
            className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
            placeholder="Password"
            onChange={(e) => setUser({...user, password: e.target.value})}
          />
        </div>
        <div>
            <Label htmlFor='date of birth' className="sr-only">
                Date of Birth
            </Label>
            <Input
                id='date of birth'
                name='date of birth'
                type='date'
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder='Date of Birth'
                onChange={(e) => setUser({...user, dateOfBirth: e.target.value})}
            />
        </div>
      </div>

      {error && (
        <div className="text-red-500 text-sm mt-2">{error}</div>
      )}

      <div>
        <Button
          type="submit"
          className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          disabled={button}
        >
          Sign up
        </Button>
      </div>
    </form>
  )
}
