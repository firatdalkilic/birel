import { NextResponse } from "next/server";

export async function GET() {
  try {
    const healthData = {
      status: "ok",
      time: new Date().toISOString(),
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      version: process.version,
      environment: process.env.NODE_ENV,
    };

    return NextResponse.json(healthData, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        status: "unhealthy",
        error: error instanceof Error ? error.message : "Unknown error",
        time: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
