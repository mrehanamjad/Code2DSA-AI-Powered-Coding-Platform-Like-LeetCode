import React from 'react'
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar'

function UserAvatar({ avatar, name,h=32,w=32, className="" }: { avatar: string, name: string, className?: string,h?:number,w?:number }) {
    return (
            <Avatar className={`h-${h} w-${w} border-4 border-background shadow-xl ${className}`}>
                <AvatarImage src={process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT + "/" + avatar} alt={name} className="object-cover" />
                <AvatarFallback className="bg-gradient-to-br from-primary to-blue-600 text-3xl font-bold text-white">
                    {name[0]?.toUpperCase()}
                </AvatarFallback>
            </Avatar>
    )
}

export default UserAvatar