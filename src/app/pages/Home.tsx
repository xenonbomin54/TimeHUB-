import { useState } from "react";
import { useNavigate } from "react-router";

export function Home() {
  const navigate = useNavigate();
  const [code, setCode] = useState("");
  const [error, setError] = useState("");

  function handleJoin(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = code.trim().toUpperCase();
    if (!trimmed) return;
    navigate(`/room/${trimmed}/join`);
  }

  return (
    <div className="max-w-4xl mx-auto px-5 py-20 flex flex-col items-center text-center">
      {/* Hero */}
      <div className="mb-16 flex flex-col items-center">
        <h1
          className="text-foreground mb-5"
          style={{
            fontSize: "clamp(36px, 7vw, 68px)",
            fontWeight: 800,
            lineHeight: 1.15,
            letterSpacing: "-0.03em",
          }}
        >
          지금 바로<br />
          <span style={{ color: "#3355ff" }}>약속시간을</span><br />
          잡아보세요
        </h1>
        <p className="text-muted-foreground max-w-md" style={{ fontSize: "15px", lineHeight: 1.75 }}>
          로그인 없이도 간편하게 모임 시간을 찾아보세요<br />
          시스템이 자동으로 최적 시간을 계산해 드립니다.
        </p>
      </div>

      {/* Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-xl w-full">
        {/* Create */}
        <div
          className="flex flex-col items-center p-7 text-white  text-center"
          style={{ borderRadius: "15px", background: "#3355ff", margin: "20px", boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)" }}
        >
          <div className="text-3xl mb-4"></div>
          <div style={{ fontWeight: 700, fontSize: "17px", marginBottom: "6px" }}>방 만들기</div>
          <div style={{ fontSize: "13px", opacity: 0.85, lineHeight: 1.6, marginBottom: "16px" }}>
            모임 이름과 날짜·시간 범위를 설정하고<br />링크를 공유하세요
          </div>
          <button
            type="button"
            onClick={() => navigate("/create")}
            className="mt-auto w-full py-2.5 bg-background text-foreground  hover:opacity-80 transition-opacity"
            style={{ fontSize: "13px", fontWeight: 700, borderRadius: "7px" }}
          >
            방 만들기 →
          </button>
        </div>

        {/* Join */}
        <form
          onSubmit={handleJoin}
          className="flex flex-col items-center p-7 text-white  text-center"
          style={{ borderRadius: "15px", background: "#3355ff", margin: "20px", boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)" }}
        >
          <div className="text-3xl mb-4"></div>
          <div style={{ fontWeight: 700, fontSize: "17px", marginBottom: "6px" }}>코드로 참여</div>
          <div style={{ fontSize: "13px", opacity: 0.85, lineHeight: 1.6, marginBottom: "16px" }}>
            방장에게 받은 6자리 코드를<br />입력하세요
          </div>
          <input
            value={code}
            onChange={(e) => { setCode(e.target.value.toUpperCase()); setError(""); }}
            placeholder="예: AB12CD"
            maxLength={6}
            className="w-full border border-border bg-background text-foreground px-3 py-2.5 outline-none focus:border-primary transition-colors text-center"
            style={{ fontSize: "16px", letterSpacing: "0.15em", borderRadius: "7px" }}
          />
          {error && <p className="mt-2 text-destructive" style={{ fontSize: "12px" }}>{error}</p>}
          <button
            type="submit"
            className="mt-3 w-full py-2.5 bg-background text-foreground border-2 border-background hover:opacity-80 transition-opacity"
            style={{ fontSize: "13px", fontWeight: 700, borderRadius: "7px" }}
          >
            참여하기
          </button>
        </form>
      </div>
    </div>
  );
}