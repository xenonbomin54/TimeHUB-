import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { getRoom, addParticipant, type Room } from "../lib/store";

export function JoinRoom() {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();

  const [room, setRoom] = useState<Room | null | undefined>(undefined); // undefined = 로딩 중
  const [step, setStep] = useState<"name" | "grid">("name");
  const [nickname, setNickname] = useState("");
  const [nameError, setNameError] = useState("");
  const [unavailable, setUnavailable] = useState<Set<string>>(new Set());
  const [isDragging, setIsDragging] = useState(false);
  const [dragMode, setDragMode] = useState<"add" | "remove">("add");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setRoom(undefined);
    getRoom(roomId ?? "").then((r) => {
      if (!cancelled) setRoom(r);
    });
    return () => { cancelled = true; };
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
        <p className="text-5xl mb-5">🔍</p>
        <h2 style={{ fontSize: "20px", fontWeight: 700, marginBottom: "8px" }}>방을 찾을 수 없어요</h2>
        <p className="text-muted-foreground mb-8" style={{ fontSize: "14px" }}>
          코드를 다시 확인하거나 방장에게 문의하세요
        </p>
        <button
          onClick={() => navigate("/")}
          className="px-6 py-3 bg-primary text-primary-foreground hover:opacity-80 transition-opacity"
          style={{ fontSize: "14px" }}
        >
          홈으로
        </button>
      </div>
    );
  }

  const hours = Array.from(
    { length: room.timeEnd - room.timeStart },
    (_, i) => room.timeStart + i
  );

  function toggleCell(key: string, forceMode?: "add" | "remove") {
    const mode = forceMode ?? (unavailable.has(key) ? "remove" : "add");
    setUnavailable((prev) => {
      const next = new Set(prev);
      if (mode === "add") next.add(key);
      else next.delete(key);
      return next;
    });
    return mode;
  }

  function handleMouseDown(key: string) {
    const mode = unavailable.has(key) ? "remove" : "add";
    setDragMode(mode);
    setIsDragging(true);
    toggleCell(key, mode);
  }

  function handleMouseEnter(key: string) {
    if (!isDragging) return;
    toggleCell(key, dragMode);
  }

  function handleMouseUp() {
    setIsDragging(false);
  }

  async function handleSubmit() {
    setSubmitting(true);
    try {
      await addParticipant(room!.id, {
        nickname,
        unavailable: Array.from(unavailable),
      });
      navigate(`/room/${room!.id}`);
    } catch (err) {
      console.error(err);
      setSubmitting(false);
    }
  }

  if (step === "name") {
    return (
      <div className="max-w-md mx-auto px-5 py-14">
        <div className="mb-8">
          <div
            className="inline-block mb-4 px-3 py-1 border border-border text-muted-foreground"
            style={{ fontFamily: "'DM Mono', monospace", fontSize: "10px", letterSpacing: "0.15em" }}
          >
            {room.id}
          </div>
          <h1 style={{ fontFamily: "'Noto Serif KR', serif", fontSize: "24px", fontWeight: 700, marginBottom: "6px" }}>
            {room.name}
          </h1>
          <p className="text-muted-foreground" style={{ fontSize: "13px" }}>
            {room.days.join(" · ")} · {String(room.timeStart).padStart(2,"0")}:00~{String(room.timeEnd).padStart(2,"0")}:00
          </p>
        </div>

        <div className="mb-6">
          <label className="block mb-2" style={{ fontSize: "13px", fontWeight: 600 }}>
            닉네임을 입력하세요
          </label>
          <input
            autoFocus
            value={nickname}
            onChange={(e) => { setNickname(e.target.value); setNameError(""); }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                if (!nickname.trim()) { setNameError("닉네임을 입력하세요"); return; }
                setStep("grid");
              }
            }}
            placeholder="예: 최선우, 김보민"
            className="w-full border border-border bg-background px-4 py-3 outline-none focus:border-primary transition-colors"
            style={{ fontSize: "15px" }}
          />
          {nameError && <p className="mt-1.5 text-destructive" style={{ fontSize: "12px" }}>{nameError}</p>}
        </div>

        <div className="p-4 bg-secondary border border-border mb-8">
          <p className="text-muted-foreground" style={{ fontSize: "13px", lineHeight: 1.7 }}>
            로그인이 필요 없어요. 닉네임으로 바로 참여하세요.
            다음 화면에서 <strong>참여할 수 없는 시간대</strong>를 선택합니다.
          </p>
        </div>

        <button
          onClick={() => {
            if (!nickname.trim()) { setNameError("닉네임을 입력하세요"); return; }
            setStep("grid");
          }}
          className="w-full py-3.5 bg-primary text-primary-foreground hover:opacity-80 transition-opacity"
          style={{ fontSize: "15px", fontWeight: 600 }}
        >
          다음 →
        </button>
      </div>
    );
  }

  return (
    <div
      className="max-w-4xl mx-auto px-5 py-10 select-none"
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <div className="mb-6 flex items-start justify-between flex-wrap gap-4">
        <div>
          <h2 style={{ fontFamily: "'Noto Serif KR', serif", fontSize: "20px", fontWeight: 700, marginBottom: "4px" }}>
            {room.name}
          </h2>
          <p className="text-muted-foreground" style={{ fontSize: "13px" }}>
            <strong>{nickname}</strong>님 · 빨간색으로 표시할 <strong>불가능한 시간</strong>을 드래그해서 선택하세요
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2" style={{ fontSize: "12px" }}>
            <div className="w-4 h-4 bg-background border border-border" />
            <span className="text-muted-foreground">가능</span>
          </div>
          <div className="flex items-center gap-2" style={{ fontSize: "12px" }}>
            <div className="w-4 h-4" style={{ background: "#EF4444" }} />
            <span className="text-muted-foreground">불가</span>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="overflow-x-auto pb-4">
        <div style={{ minWidth: `${room.days.length * 72 + 56}px` }}>
          {/* Day headers */}
          <div className="flex mb-1" style={{ marginLeft: "56px" }}>
            {room.days.map((day) => {
              const isWeekend = day === "토" || day === "일";
              return (
                <div
                  key={day}
                  className="flex-1 text-center"
                  style={{
                    fontSize: "13px",
                    fontWeight: 600,
                    color: isWeekend ? "#EF4444" : "#1A1A1A",
                    minWidth: "72px",
                    paddingBottom: "6px",
                  }}
                >
                  {day}
                </div>
              );
            })}
          </div>

          {/* Time rows */}
          {hours.map((hour) => (
            <div key={hour} className="flex items-stretch" style={{ height: "40px", marginBottom: "2px" }}>
              <div
                className="shrink-0 flex items-center justify-end pr-3 text-muted-foreground"
                style={{ width: "56px", fontFamily: "'DM Mono', monospace", fontSize: "11px" }}
              >
                {String(hour).padStart(2, "0")}:00
              </div>
              {room.days.map((_, di) => {
                const key = `${di}-${hour}`;
                const isUnavailable = unavailable.has(key);
                return (
                  <div
                    key={key}
                    className="flex-1 border border-border cursor-pointer transition-colors"
                    style={{
                      minWidth: "72px",
                      marginRight: "2px",
                      background: isUnavailable ? "#EF4444" : "#fff",
                      borderColor: isUnavailable ? "#DC2626" : "rgba(0,0,0,0.1)",
                    }}
                    onMouseDown={() => handleMouseDown(key)}
                    onMouseEnter={() => handleMouseEnter(key)}
                    onTouchStart={(e) => {
                      e.preventDefault();
                      handleMouseDown(key);
                    }}
                    onTouchMove={(e) => {
                      e.preventDefault();
                      const touch = e.touches[0];
                      const el = document.elementFromPoint(touch.clientX, touch.clientY);
                      if (el) {
                        const k = el.getAttribute("data-key");
                        if (k) handleMouseEnter(k);
                      }
                    }}
                    onTouchEnd={() => handleMouseUp()}
                    data-key={key}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Summary & Submit */}
      <div className="mt-6 flex items-center justify-between flex-wrap gap-4">
        <p className="text-muted-foreground" style={{ fontSize: "13px" }}>
          {unavailable.size === 0
            ? "불가능한 시간이 없으면 그냥 제출하세요 ✅"
            : `${unavailable.size}개 시간대 불가능으로 표시됨`}
        </p>
        <div className="flex gap-3">
          <button
            onClick={() => setUnavailable(new Set())}
            className="px-4 py-2.5 border border-border hover:bg-secondary transition-colors"
            style={{ fontSize: "13px" }}
          >
            초기화
          </button>
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="px-6 py-2.5 bg-primary text-primary-foreground hover:opacity-80 transition-opacity disabled:opacity-50"
            style={{ fontSize: "13px", fontWeight: 600 }}
          >
            {submitting ? "제출 중..." : "제출하기 →"}
          </button>
        </div>
      </div>
    </div>
  );
}