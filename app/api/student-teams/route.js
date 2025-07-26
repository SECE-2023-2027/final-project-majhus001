import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/dbConnect';
import Team from '../../../lib/models/teamModel';

export async function GET(req) {
  await connectDB();
  const { searchParams } = new URL(req.url);
  const email = searchParams.get('email');
  console.log(email)
  if (!email) {
      return NextResponse.json({ message: 'Email is required' }, { status: 400 });
    }
    
    const teams = await Team.find({
        'members.email': email,
    }).select('teamName');
    console.log("mine",teams)

    const all = await Team.find();
    all.map((item)=>{
      item.members.map((el)=>{

        console.log("alll:", el.email)
      })
    })

    
  return NextResponse.json({ teams });
}
