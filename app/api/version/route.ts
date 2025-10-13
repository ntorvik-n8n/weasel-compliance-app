import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const versionPath = path.join(process.cwd(), 'version.json');
    const versionData = JSON.parse(fs.readFileSync(versionPath, 'utf-8'));

    return NextResponse.json(versionData);
  } catch (error) {
    console.error('Failed to read version:', error);
    return NextResponse.json(
      { version: '0.1.0', build: 'unknown', buildDate: new Date().toISOString() },
      { status: 200 }
    );
  }
}
