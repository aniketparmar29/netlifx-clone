import bcrypt from 'bcrypt'
import { NextApiRequest,NextApiResponse } from 'next'
import prismadb from '@/lib/prismadb';
import { use } from 'react';

export default async function handler(req: NextApiRequest,res:NextApiResponse){
    if(req.method !== 'POST'){
        return res.status(405).end();
    }

    try{
        const {email,name,password} = req.body;

        const existionUser = await prismadb.user.findUnique({
            where:{
                email,
            }
        });
        if(existionUser){
            return res.status(422).json({error:"Email taken"});
        }

        const hashedPassword = await bcrypt.hash(password,12);

        const user = await prismadb.user.create({
            data:{
                email,
                name,
                hashedPassword,
                image:'',
                emailVerified:new Date(),
            }
        });
        return res.status(200).json(user);
    }catch(err){
        console.log(err)
        return res.status(400).end();
    }
}