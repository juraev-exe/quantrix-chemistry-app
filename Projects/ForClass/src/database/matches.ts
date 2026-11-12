import { MatchRecord } from '../types/match';
import { dbGetAll, dbGet, dbPut, dbClear, STORE_MATCHES } from './indexedDB';

export async function saveMatch(match: MatchRecord): Promise<void> {
  try {
    await dbPut(STORE_MATCHES, match);
  } catch (err) {
    console.error('Failed to save match:', err);
  }
}

export async function getAllMatches(): Promise<MatchRecord[]> {
  try {
    const list = await dbGetAll<MatchRecord>(STORE_MATCHES);
    return list.sort((a, b) => b.timestamp - a.timestamp);
  } catch (err) {
    console.error('Failed to retrieve matches:', err);
    return [];
  }
}

export async function getMatchById(id: string): Promise<MatchRecord | undefined> {
  try {
    return await dbGet<MatchRecord>(STORE_MATCHES, id);
  } catch (err) {
    console.error('Failed to get match by id:', err);
    return undefined;
  }
}

export async function clearMatchHistory(): Promise<void> {
  try {
    await dbClear(STORE_MATCHES);
  } catch (err) {
    console.error('Failed to clear match history:', err);
  }
}

