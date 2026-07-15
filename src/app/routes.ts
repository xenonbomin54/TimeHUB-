import { createBrowserRouter } from "react-router";
import { Root } from "./components/Root";
import { Home } from "./pages/Home";
import { CreateRoom } from "./pages/CreateRoom";
import { JoinRoom } from "./pages/JoinRoom";
import { RoomView } from "./pages/RoomView";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: Home },
      { path: "create", Component: CreateRoom },
      { path: "room/:roomId", Component: RoomView },
      { path: "room/:roomId/join", Component: JoinRoom },
    ],
  },
]);
