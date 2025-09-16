import { NextResponse } from "next/server";
import dbConnect from '@/lib/dbConnect';
import { logger } from '@/lib/logger';

export async function GET() {
  const startTime = Date.now();
  
  try {
    logger.api.request('GET', '/api/health');
    
    // Database connection test
    let dbStatus = 'disconnected';
    try {
      await dbConnect();
      dbStatus = 'connected';
      logger.db.connect(true);
    } catch (dbError) {
      logger.db.connect(false, dbError);
      dbStatus = 'error';
    }

    const healthData = {
      status: dbStatus === 'connected' ? "healthy" : "unhealthy",
      timestamp: Date.now(),
      time: new Date().toISOString(),
      uptime: Math.floor(process.uptime()),
      memory: {
        used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
        total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
        rss: Math.round(process.memoryUsage().rss / 1024 / 1024),
      },
      version: process.version,
      environment: process.env.NODE_ENV,
      database: {
        status: dbStatus,
      },
      services: {
        api: 'running',
        database: dbStatus,
      }
    };

    const duration = Date.now() - startTime;
    const status = dbStatus === 'connected' ? 200 : 503;
    
    logger.api.response('GET', '/api/health', status, duration);
    
    return NextResponse.json(healthData, { status });
  } catch (error) {
    const duration = Date.now() - startTime;
    logger.api.error('GET', '/api/health', error);
    logger.api.response('GET', '/api/health', 500, duration);
    
    return NextResponse.json(
      {
        status: "unhealthy",
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: Date.now(),
        time: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
