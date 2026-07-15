import { doc, getDoc, setDoc, collection, getDocs, onSnapshot } from "firebase/firestore";
import { db } from "../../lib/firebase";

export interface Participant {
  nickname: string;
  unavailable: string[]; // "dayIndex-hour" e.g. "0-9", "2-14"
}

export interface Room {
  id: string;
  name: string;
  days: string[]; // ["월", "화", "수", ...]
  timeStart: number; // 0-23
  timeEnd: number;   // 0-23
  participants: Participant[];
  createdAt: number;
}

function generateId(): string {
  return Math.random().toString(36).slice(2, 8).toUpperCase();
}

export async function createRoom(
  data: Omit<Room, "id" | "participants" | "createdAt">
): Promise<Room> {
  const id = generateId();
  const roomData = { ...data, id, createdAt: Date.now() };
  await setDoc(doc(db, "rooms", id), roomData);
  return { ...roomData, participants: [] };
}

async function fetchParticipants(roomId: string): Promise<Participant[]> {
  const snap = await getDocs(collection(db, "rooms", roomId, "participants"));
  return snap.docs.map((d) => d.data() as Participant);
}

export async function getRoom(id: string): Promise<Room | null> {
  const roomId = id.toUpperCase();
  const roomSnap = await getDoc(doc(db, "rooms", roomId));
  if (!roomSnap.exists()) return null;
  const participants = await fetchParticipants(roomId);
  return { ...(roomSnap.data() as Omit<Room, "participants">), participants };
}

/** 실시간 구독: 방 정보나 참여자가 바뀔 때마다 callback 호출. cleanup 함수를 반환한다. */
export function subscribeRoom(id: string, callback: (room: Room | null) => void): () => void {
  const roomId = id.toUpperCase();
  let roomData: Omit<Room, "participants"> | null = null;
  let participants: Participant[] = [];
  let roomLoaded = false;

  function emit() {
    if (!roomLoaded) return;
    callback(roomData ? { ...roomData, participants } : null);
  }

  const unsubRoom = onSnapshot(doc(db, "rooms", roomId), (snap) => {
    roomData = snap.exists() ? (snap.data() as Omit<Room, "participants">) : null;
    roomLoaded = true;
    emit();
  });

  const unsubParticipants = onSnapshot(collection(db, "rooms", roomId, "participants"), (snap) => {
    participants = snap.docs.map((d) => d.data() as Participant);
    emit();
  });

  return () => {
    unsubRoom();
    unsubParticipants();
  };
}

export async function addParticipant(roomId: string, participant: Participant): Promise<boolean> {
  const id = roomId.toUpperCase();
  const roomSnap = await getDoc(doc(db, "rooms", id));
  if (!roomSnap.exists()) return false;
  // 문서 ID = 닉네임 → 같은 닉네임으로 재제출하면 자동으로 덮어씀
  await setDoc(doc(db, "rooms", id, "participants", participant.nickname), participant);
  return true;
}

/** Returns available count per slot: key = "dayIndex-hour", value = # available */
export function computeAvailability(room: Room): Record<string, number> {
  const total = room.participants.length;
  const result: Record<string, number> = {};
  room.days.forEach((_, di) => {
    for (let h = room.timeStart; h < room.timeEnd; h++) {
      const key = `${di}-${h}`;
      const unavailableCount = room.participants.filter((p) =>
        p.unavailable.includes(key)
      ).length;
      result[key] = total - unavailableCount;
    }
  });
  return result;
}

/** Best slots sorted by available count desc */
export function getBestSlots(
  room: Room,
  avail: Record<string, number>
): { dayIndex: number; hour: number; count: number; who: string[] }[] {
  const total = room.participants.length;
  if (total === 0) return [];

  return Object.entries(avail)
    .map(([key, count]) => {
      const [di, h] = key.split("-").map(Number);
      const who = room.participants
        .filter((p) => !p.unavailable.includes(key))
        .map((p) => p.nickname);
      return { dayIndex: di, hour: h, count, who };
    })
    .sort((a, b) => b.count - a.count || a.hour - b.hour)
    .slice(0, 5);
}