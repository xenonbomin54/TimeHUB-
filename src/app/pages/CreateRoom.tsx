import { useState } from "react";
import { useNavigate } from "react-router";
import { createRoom } from "../lib/store";

const ALL_DAYS = ["월", "화", "수", "목", "금", "토", "일"];

const selectArrow = {
  appearance: "none" as const,
  WebkitAppearance: "none" as const,
  MozAppearance: "none" as const,
  backgroundImage:
    "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%236B6860' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><polyline points='6 9 12 15 18 9'/></svg>\")",
  backgroundRepeat: "no-repeat",
  backgroundPosition: "right 12px center",
  backgroundSize: "16px",
  paddingRight: "36px",
};

export function CreateRoom() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [selectedDays, setSelectedDays] = useState<string[]>(["월", "화", "수", "목", "금"]);
  const [timeStart, setTimeStart] = useState(9);
  const [timeEnd, setTimeEnd] = useState(22);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function toggleDay(day: string) {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) { setError("모임 이름을 입력하세요"); return; }
    if (selectedDays.length === 0) { setError("요일을 하나 이상 선택하세요"); return; }
    if (timeEnd <= timeStart) { setError("종료 시간은 시작 시간보다 늦어야 합니다"); return; }

    setSubmitting(true);
    try {
      const room = await createRoom({
        name: name.trim(),
        days: ALL_DAYS.filter((d) => selectedDays.includes(d)),
        timeStart,
        timeEnd,
      });
      navigate(`/room/${room.id}`);
    } catch (err) {
      console.error(err);
      setError("방 생성 중 오류가 발생했어요. 다시 시도해주세요.");
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-lg mx-auto px-5 py-14">
      <div className="mb-10">
        <h1 style={{ fontSize: "28px", fontWeight: 700, letterSpacing: "-0.02em"}}>
          새 방 만들기
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Name */}
        <div>
          <label className="block mb-2" style={{ fontSize: "13px", fontWeight: 600 }}>
            모임 이름
          </label>
          <input
            value={name}
            onChange={(e) => { setName(e.target.value); setError(""); }}
            placeholder="예: 동아리 정기 회의, 스터디 모임"
            className="w-full border border-border bg-background px-4 py-3 outline-none focus:border-primary transition-colors"
            style={{ fontSize: "15px", borderRadius: "7px" }}
          />
        </div>

        {/* Days */}
        <div>
          <label className="block mb-3" style={{ fontSize: "13px", fontWeight: 600 }}>
            조율할 요일 <span className="text-muted-foreground font-normal">(복수 선택 가능)</span>
          </label>
          <div className="flex gap-2 flex-wrap">
            {ALL_DAYS.map((day) => {
              const active = selectedDays.includes(day);
              const isWeekend = day === "토" || day === "일";
              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => toggleDay(day)}
                  className="w-11 h-11 border transition-all"
                  style={{
                    fontSize: "14px",
                    fontWeight: 600,
                    background: active ? "#3355ff" : "#fff",
                    color: active ? "#ffffff" : isWeekend ? "#EF4444" : "#1A1A1A",
                    borderColor: active ? "#3355ff" : "rgba(0,0,0,0.15)",
                    borderRadius: "7px",
                  }}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </div>

        {/* Time range */}
        <div>
          <label className="block mb-3" style={{ fontSize: "13px", fontWeight: 600 }}>
            조율할 시간
          </label>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <p className="text-muted-foreground mb-1.5" style={{ fontSize: "11px" }}>시작</p>
              <select
                value={timeStart}
                onChange={(e) => setTimeStart(Number(e.target.value))}
                className="w-full border border-border bg-background px-3 py-2.5 outline-none focus:border-primary"
                style={{ fontSize: "14px", outline: "none", borderRadius: "7px", ...selectArrow }}
              >
                {Array.from({ length: 24 }, (_, i) => (
                  <option key={i} value={i}>{String(i).padStart(2, "0")}:00</option>
                ))}
              </select>
            </div>
            <div className="mt-5 text-muted-foreground">—</div>
            <div className="flex-1">
              <p className="text-muted-foreground mb-1.5" style={{ fontSize: "11px" }}>종료</p>
              <select
                value={timeEnd}
                onChange={(e) => setTimeEnd(Number(e.target.value))}
                className="w-full border border-border bg-background px-3 py-2.5 outline-none focus:border-primary"
                style={{ fontSize: "14px", outline: "none", borderRadius: "7px", ...selectArrow }}
              >
                {Array.from({ length: 24 }, (_, i) => (
                  <option key={i} value={i}>{String(i).padStart(2, "0")}:00</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {error && (
          <p className="text-destructive" style={{ fontSize: "13px" }}>{error}</p>
        )}

        {/* Preview */}
        {name && selectedDays.length > 0 && timeEnd > timeStart && (
          <div
           className="p-4"
            style={{
              borderRadius: "7px",
              borderColor: "#3355ff",
              background: "#ffffff",
              boxShadow: "0 0 0 1px rgba(51,85,255,0.2)",
            }}
          >
            <p
              className="mb-1.5"
              style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.05em", color: "#3355ff" }}
            >
              미리보기
            </p>
            <p style={{ fontWeight: 700, fontSize: "16px" }}>{name}</p>
            <p className="text-muted-foreground mt-1" style={{ fontSize: "13px" }}>
              {ALL_DAYS.filter(d => selectedDays.includes(d)).join(" · ")} · {String(timeStart).padStart(2,"0")}:00~{String(timeEnd).padStart(2,"0")}:00
            </p>
          </div>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="w-full py-4  text-primary-foreground hover:opacity-80 transition-opacity disabled:opacity-50"
          style={{ fontSize: "15px", fontWeight: 600, borderRadius: "7px", background: "#3355ff" }}
        >
          {submitting ? "만드는 중..." : "방 만들기 →"}
        </button>
      </form>
    </div>
  );
}