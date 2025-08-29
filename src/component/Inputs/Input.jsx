import React from 'react'
import { useState } from 'react'
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";

const Input = ({value, onChange, placeholder, label, type}) => {
const [showPassword, setShowPassword] = useState(false);

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  }
    return (
    <div>
        <label className="text-[13px]  text-slate-800">{label}</label>

        <div className="input-box -bg-conic-30  bg-violet-100">
            <input 
                type = {type == 'password' ? showPassword ? 'text' : 'password' : type} 
                placeholder={placeholder}
                className="w-full  text-slate-800 outline-none"
                value={value}
                onChange={(e) => onChange(e)}
            />

            {type === "password" && (
                <>
                {showPassword ? (
                    <FaRegEye
                    size={22}
                    className="text-primary cusor-pointer"
                    onClick={() => toggleShowPassword()}
                    />
                ) : (
                    <FaRegEyeSlash
                    size={22}
                    className="text-slate-400 cursor-pointer"
                    onClick={() => toggleShowPassword()}
                    />
                )}
            </>
            )}
        </div>
    </div>
  )
}

export default Input;
