/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { cookies } from "next/headers";
import { FieldValues } from "react-hook-form";

export const registerUser = async (userData: FieldValues) => {
  try {
    const res = await fetch(`http://localhost:5000/user`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
      cache: "no-store",
    });

    const result = await res.json();

    if (result?.success) {
      const cookieStore = cookies();
      const secure = process.env.NODE_ENV === "production";

      (await cookieStore).set({
        name: "accessToken",
        value: result.data.accessToken,
        httpOnly: true,
        path: "/",
        secure,
      });

      if (result?.data?.refreshToken) {
       (await cookieStore).set({
          name: "refreshToken",
          value: result.data.refreshToken,
          httpOnly: true,
          path: "/",
          secure,
        });
      }
    }

    return result;
  } catch (error: any) {
    return { success: false, message: error?.message || String(error) };
  }
};
