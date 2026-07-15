import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { subscribeRoom, computeAvailability, getBestSlots, type Room } from "../lib/store";

function availColor(count: number, total: number): string {
  if (total === 0) return "#F5F3EE";
  const ratio = count / total;
  if (ratio === 0) return "#FEE2E2";
  if (ratio < 0.34) return "#FCA5A5";
  if (ratio < 0.67) return "#86EFAC";
  if (ratio < 1) return "#4ADE80";
  return "#16A34A";
}

function textColor(count: number, total: number): string {
  if (total === 0) return "#9CA3AF";
  const ratio = count / total;
  return ratio >= 0.67 ? "#fff" : "#1A1A1A";
}

export function RoomView() {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const [room, setRoom] = useState<Room | null | undefined>(undefined); // undefined = 로딩 중
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setRoom(undefined);
    const unsubscribe = subscribeRoom(roomId ?? "", setRoom);
    return unsubscribe;
  }, [roomId]);

  if (room === undefined) {
    return (
      <div className="max-w-lg mx-auto px-5 py-20 text-center">
        <p className="text-muted-foreground" style={{ fontSize: "14px" }}>불러오는 중...</p>
      </div>
    );
  }

  if (!room) {
    return (
      <div className="max-w-lg mx-auto px-5 py-20 text-center">
        <h2 style={{ fontSize: "20px", fontWeight: 700, marginBottom: "8px" }}>방을 찾을 수 없어요</h2>
        <button
          onClick={() => navigate("/")}
          className="px-6 py-3 text-white hover:opacity-30 transition-opacity"
          style={{ fontSize: "14px", background: "#3355ff", borderRadius: "7px" }}
        >
          홈으로
        </button>
      </div>
    );
  }

  const total = room.participants.length;
  const avail = computeAvailability(room);
  const bestSlots = getBestSlots(room, avail);
  const hours = Array.from({ length: room.timeEnd - room.timeStart }, (_, i) => room.timeStart + i);

  const shareUrl = `${window.location.origin}/room/${room.id}/join`;
  function copyLink() {
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div className="max-w-4xl mx-auto px-5 py-10">
      {/* Header */}
      <div className="mb-8 flex items-start justify-between flex-wrap gap-4">
        <div>
          <div
            className="inline-block mb-2 px-2 py-0.5 text-white"
            style={{ fontSize: "11px", letterSpacing: "0.05em", background: "#3355ff", borderRadius: "5px" }}
          >
            {room.id}
          </div>
          <h1 style={{ fontSize: "26px", fontWeight: 800, letterSpacing: "-0.02em", marginBottom: "4px" }}>
            {room.name}
          </h1>
          <p className="text-muted-foreground" style={{ fontSize: "13px" }}>
            {room.days.join(" · ")} · {String(room.timeStart).padStart(2,"0")}:00~{String(room.timeEnd).padStart(2,"0")}:00 · 참여자 {total}명
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={copyLink}
            className="px-4 py-2.5 text-white transition-opacity"
            style={{ fontSize: "13px", fontWeight: 600, borderRadius: "7px", background: "#3355ff" }}
          >
            {copied ? "복사됨!" : "링크 복사"}
          </button>
          <button
            onClick={() => navigate(`/room/${room.id}/join`)}
            className="px-4 py-2.5 border border-border "
            style={{ fontSize: "13px", borderRadius: "7px", background: "rgba(51, 85, 255, 0.1)", color: "#000" }}
          >
            + 나도 참여
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Heatmap */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-3">
            <p style={{ fontSize: "13px", fontWeight: 600 }}>가용 시간 히트맵</p>
            <div className="flex items-center gap-3" style={{ fontSize: "11px", color: "#6B6860" }}>
              <span style={{ color: "#FCA5A5" }}>■</span> 불가
              <span style={{ color: "#86EFAC" }}>■</span> 일부 가능
              <span style={{ color: "#16A34A" }}>■</span> 전원 가능
            </div>
          </div>

          {total === 0 ? (
            <div className="p-10 border border-border text-center" style={{ borderRadius: "7px" }}>
              <p style={{ fontWeight: 600, fontSize: "15px", marginBottom: "6px" }}>아직 참여자가 없어요</p>
              <p className="text-muted-foreground" style={{ fontSize: "13px" }}>
                아래 링크를 복사해서 구성원들에게 공유하세요
              </p>
              <div
                className="mt-4 px-4 py-3 border border-border text-left"
                style={{ fontSize: "12px", wordBreak: "break-all", borderRadius: "7px", background: "rgba(51, 85, 255, 0.3)", color: "#000" }}
              >
                {shareUrl}
              </div>
            </div>             
          ) : (
            <div className="overflow-x-auto">
              <div style={{ minWidth: `${room.days.length * 68 + 56}px` }}>
                {/* Day headers */}
                <div className="flex mb-1" style={{ marginLeft: "56px" }}>
                  {room.days.map((day) => {
                    const isWeekend = day === "토" || day === "일";
                    return (
                      <div
                        key={day}
                        className="flex-1 text-center"
                        style={{ fontSize: "12px", fontWeight: 600, color: isWeekend ? "#EF4444" : "#1A1A1A", minWidth: "68px", paddingBottom: "4px" }}
                      >
                        {day}
                      </div>
                    );
                  })}
                </div>

                {hours.map((hour) => (
                  <div key={hour} className="flex items-stretch" style={{ height: "36px", marginBottom: "2px" }}>
                    <div
                      className="shrink-0 flex items-center justify-end pr-3 text-muted-foreground"
                      style={{ width: "56px", fontSize: "10px" }}
                    >
                      {String(hour).padStart(2, "0")}:00
                    </div>
                    {room.days.map((_, di) => {
                      const key = `${di}-${hour}`;
                      const count = avail[key] ?? 0;
                      const bg = availColor(count, total);
                      const tc = textColor(count, total);
                      const isBest = bestSlots.length > 0 && bestSlots[0].count === count && count === total && total > 0;
                      return (
                        <div
                          key={key}
                          className="flex-1 flex items-center justify-center transition-colors relative"
                          style={{
                            minWidth: "68px",
                            marginRight: "2px",
                            background: bg,
                            color: tc,
                            fontSize: "11px",
                            borderRadius: "4px",
                            outline: isBest ? "2px solid #3355ff" : "none",
                            outlineOffset: "-2px",
                          }}
                          title={`${room.days[di]}요일 ${hour}:00 — ${count}/${total}명 가능`}
                        >
                          {total > 0 && (
                            <span style={{ opacity: 0.9 }}>{count}/{total}</span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          {/* Best slots */}
          {total > 0 && bestSlots.length > 0 && (
            <div>
              <p style={{ fontSize: "13px", fontWeight: 600, marginBottom: "10px" }}>
                추천 시간대
              </p>
              <div className="space-y-2">
                {bestSlots.map((slot, i) => {
                  const isAll = slot.count === total;
                  return (
                    <div
                      key={i}
                      className="p-3 border"
                      style={{
                        borderColor: i === 0 ? "#3355ff" : "rgba(0,0,0,0.1)",
                        background: i === 0 ? "rgba(51,85,255,0.06)" : "#fff",
                        borderRadius: "7px",
                      }}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span style={{ fontWeight: 600, fontSize: "13px" }}>
                          {room.days[slot.dayIndex]}요일 {String(slot.hour).padStart(2,"0")}:00
                        </span>
                        <span
                          className="px-2 py-0.5"
                          style={{
                            fontSize: "11px",
                            background: isAll ? "#16A34A" : "#E5E7EB",
                            color: isAll ? "#fff" : "#374151",
                            borderRadius: "5px",
                          }}
                        >
                          {slot.count}/{total}
                        </span>
                      </div>
                      <p style={{ fontSize: "11px", color: "#6B6860" }}>
                        {slot.who.join(", ")}
                        {!isAll && (
                          <span className="ml-1 text-destructive">
                            (+{total - slot.count}명 불참)
                          </span>
                        )}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Participants */}
          <div>
            <p style={{ fontSize: "13px", fontWeight: 600, marginBottom: "10px" }}>
              참여자 ({total}명)
            </p>
            {total === 0 ? (
              <p className="text-muted-foreground" style={{ fontSize: "13px" }}>
                아직 아무도 참여하지 않았어요
              </p>
            ) : (
              <div className="space-y-1.5">
                {room.participants.map((p) => (
                  <div
                    key={p.nickname}
                    className="flex items-center justify-between px-3 py-2 bg-secondary"
                    style={{ borderRadius: "7px" }}
                  >
                    <span style={{ fontSize: "13px", fontWeight: 500 }}>{p.nickname}</span>
                    <span
                      className="text-muted-foreground"
                      style={{ fontSize: "10px" }}
                    >
                      불가 {p.unavailable.length}칸
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Share */}
          <div className="p-4 border border-border" style={{ borderRadius: "7px" }}>
            <p style={{ fontSize: "12px", fontWeight: 600, marginBottom: "8px" }}>공유하기</p>
            <div
              className="px-3 py-2 mb-3"
              style={{
                fontSize: "14px",
                letterSpacing: "0.1em",
                textAlign: "center",
                fontWeight: 700,
                color: "#fff",
                background: "#3355ff",
                borderRadius: "7px",
              }}
            >
              {room.id}
            </div>
            <button
              onClick={copyLink}
              className="w-full py-2 border transition-opacity"
              style={{ fontSize: "12px", borderColor: "#3355ff", borderRadius: "7px", background: "rgba(51, 85, 255, 0.3)", color: "#000" }}
            >
              {copied ? "복사됨!" : "링크 복사"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}