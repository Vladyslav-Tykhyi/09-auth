import { NextResponse } from "next/server";
import { api } from "../../api";
import { cookies } from "next/headers";

export async function POST() {
  const cookieStore = await cookies();

  try {
    // Формуємо правильні заголовки Cookie
    const cookieHeader = [];
    const accessToken = cookieStore.get("accessToken")?.value;
    const refreshToken = cookieStore.get("refreshToken")?.value;

    if (accessToken) cookieHeader.push(`accessToken=${accessToken}`);
    if (refreshToken) cookieHeader.push(`refreshToken=${refreshToken}`);

    // Робимо запит до зовнішнього API
    await api.post("/auth/logout", null, {
      headers: {
        Cookie: cookieHeader.join("; "),
      },
    });
  } catch {
    // Ігноруємо помилки від зовнішнього API, все одно очищаємо куки
    console.log(
      "External logout API might not be available, proceeding with local cleanup"
    );
  }

  // Завжди очищаємо куки на нашому сервері
  cookieStore.delete("accessToken");
  cookieStore.delete("refreshToken");

  return NextResponse.json(
    { message: "Logged out successfully" },
    { status: 200 }
  );
}
