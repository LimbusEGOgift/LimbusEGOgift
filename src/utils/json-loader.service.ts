import { Injectable, Logger } from '@nestjs/common';
import { promises as fs } from 'fs';
import * as path from 'path';

export interface ReadJsonOptions {
  recursive?: boolean;
  ext?: string;
  encoding?: BufferEncoding;
}

@Injectable()
export class JsonLoaderService {
  private readonly logger = new Logger(JsonLoaderService.name);
 
  async readJsonFiles<T = any>(dir: string,  options: ReadJsonOptions = {}): Promise<Record<string, T>> {
    const { recursive = false, ext = '.json', encoding = 'utf8' } = options;
    const result: Record<string, T> = {};

    const walk = async (currentDir: string, relativeBase = ''): Promise<void> => {
      const entries = await fs.readdir(currentDir, { withFileTypes: true });

      for (const entry of entries) {
        const fullPath = path.join(currentDir, entry.name);
        const relPath = relativeBase ? path.join(relativeBase, entry.name) : entry.name;

        if (entry.isDirectory()) {
          if (recursive) await walk(fullPath, relPath);
          continue;
        }

        if (entry.isFile() && path.extname(entry.name).toLowerCase() === ext.toLowerCase()) {
          try {
            const raw = await fs.readFile(fullPath, { encoding });
            const parsed = JSON.parse(raw) as T;
            result[relPath] = parsed;
          } catch (err) {
            this.logger.warn(`Failed to parse ${fullPath}: ${(err as Error).message}`);
          }
        }
      }
    };

    const stat = await fs.stat(dir);
    if (!stat.isDirectory()) throw new Error(`"${dir}" is not a directory`);
    await walk(dir);
    return result;
  }

  async readSingleJson<T = any>(filePath: string): Promise<T> {
    const raw = await fs.readFile(filePath, 'utf8');
    return JSON.parse(raw) as T;
  }
}