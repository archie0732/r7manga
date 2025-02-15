import { exec } from 'child_process';
import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const json = await req.json() as { passwd: string };

    if (json.passwd !== 'yanami') {
      return Response.json('post keyword wrong', { status: 403 });
    }

    const execResult = await new Promise((resolve, reject) => {
      exec('node ./cf_bypass.js', (error, stdout, stderr) => {
        if (error) {
          reject(error);
        }
        else if (stderr) {
          reject(new Error(stderr));
        }
        else {
          resolve(stdout);
        }
      });
    });
    void execResult;

    return Response.json(`cf by-pass ok `, { status: 200 });
  }
  catch (error) {
    console.error('Error in CF bypass:', error);
    return Response.json(
      `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      { status: 500 },
    );
  }
}
