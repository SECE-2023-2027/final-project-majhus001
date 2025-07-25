import { connectDB } from "@/lib/dbConnect";
import Faculty from "@/lib/models/Faculty";
import Student from "@/lib/models/studentModel";
import bcrypt from "bcryptjs";

export async function POST(req) {
  await connectDB();
  const body = await req.json();

  const { type, username, email, password, role } = body;

  // 🟣 REGISTER
  if (type === "register") {
    if (!username || !email || !password || !role) {
      return new Response(JSON.stringify({ error: "Missing fields" }), {
        status: 400,
      });
    }

    const existingUser = await Faculty.findOne({ email });
    if (existingUser) {
      return new Response(JSON.stringify({ error: "User already exists" }), {
        status: 409,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await Faculty.create({
      username,
      email,
      password: hashedPassword,
      role,
    });

    return new Response(
      JSON.stringify({ message: "User registered", user: newUser }),
      {
        status: 201,
      }
    );
  }

  // 🟢 LOGIN
  if (type === "login") {
    if (!email || !password) {
      return new Response(JSON.stringify({ error: "Missing credentials" }), {
        status: 400,
      });
    }

    let user;

    if (role == "Faculty") {
      user = await Faculty.findOne({ email });

      if (!user) {
        return new Response(JSON.stringify({ error: "User not found" }), {
          status: 404,
        });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return new Response(JSON.stringify({ error: "Invalid password" }), {
          status: 401,
        });
      }
    } else {
      user = await Student.findOne({ email });
      if (!user) {
        return new Response(JSON.stringify({ error: "User not found" }), {
          status: 404,
        });
      }
    }

    return new Response(JSON.stringify({ message: "Login successful", user }), {
      status: 200,
    });
  }

  return new Response(JSON.stringify({ error: "Invalid request type" }), {
    status: 400,
  });
}
