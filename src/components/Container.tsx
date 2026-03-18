import React from 'react'

function Container({ children, className='' }:{children:React.ReactNode, className?:string}) {
    return <div className={`w-full max-w-7xl mx-auto px-1 sm:px-4 ${className}`}>{children}</div>;
}

export default Container