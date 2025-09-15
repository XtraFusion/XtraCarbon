import connectDB from "@/lib/db/mongodb";
import { User } from "@/lib/models";
import { NextResponse } from "next/server";

export async function GET(req:Request){

   const data =  await connectDB();

    return NextResponse.json({message:"Testing"})


}