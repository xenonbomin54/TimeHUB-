import { Outlet, useNavigate } from "react-router";

export function Root() {
  const navigate = useNavigate();
  return (
    <div
      className="min-h-screen bg-background text-foreground"
      style={{
        fontFamily: "'Noto Sans KR', sans-serif",
        backgroundImage:
          "radial-gradient(circle at 50% 25%, rgba(51, 102, 255, 0.2), rgba(51,85,255,0) 60%)",
      }}
    >
      <header
        className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/90 backdrop-blur-md"
      >
        <div className="max-w-4xl mx-auto px-5 h-14 flex items-center justify-between">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 hover:opacity-70 transition-opacity"
          >
            <span style={{ fontWeight: 800, fontSize: "22px", letterSpacing: "-0.02em" }}>
              Time<span style={{ color: "#3355ff" }}>Hub</span>
            </span>
          </button>
          <button
            onClick={() => navigate("/create")}
            className="px-4 py-1.5 text-white text-sm hover:opacity-80 transition-opacity"
            style={{ fontSize: "13px", background: "#3355ff", borderRadius: "7px" }}
          >
            + 방 만들기
          </button>
        </div>
      </header>
      <main className="pt-14">
        <Outlet />
      </main>
    </div>
  );
}