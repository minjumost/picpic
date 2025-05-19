import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router";
import LandingPage from "../pages/LandingPage";
import NotFoundPage from "../pages/NotFoundPage";
import SelectFrameScreen from "../pages/SelectFramePage";
import SelectBackImagePage from "../pages/SelectBackImagePage";
import RoomSetUpPage from "../pages/RoomSetUpPage";
import InviteRoomPage from "../pages/InviteRoomPage";
import WaitingPage from "../pages/WaitingPage";
import PhotoCapturePage from "../pages/PhotoCapturePage";
import CameraPage from "../pages/CameraPage";
import GuidePage from "../pages/GuidePage";
import CanvasDraw from "../pages/CanvasDraw";
import RoomPwdPage from "../pages/RoomPwdPage";
import FinalPage from "../pages/FinalPage";
import PreviewPage from "../pages/PreviewPage";
import AppLayout from "../components/Layouts/AppLayout";

export const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/roomPwd" element={<RoomPwdPage />} />
      <Route element={<AppLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/frame" element={<SelectFrameScreen />} />
        <Route path="/backImg" element={<SelectBackImagePage />} />
        <Route path="/roomSet" element={<RoomSetUpPage />} />
        <Route path="/invite" element={<InviteRoomPage />} />
        <Route path="/waiting" element={<WaitingPage />} />
        <Route path="/photo" element={<PhotoCapturePage />} />
        <Route path="/camera" element={<CameraPage />} />
        <Route path="/guide" element={<GuidePage />} />
        <Route path="/decorate" element={<CanvasDraw />} />
        <Route path="/final" element={<FinalPage />} />
        <Route path="/preview" element={<PreviewPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </>
  )
);
