import { RouteObject } from "react-router-dom";
import App from "../App";
import { AccommodationPage } from "../pages/AccommodationPage/AccommodationPage";
import { UserProfilePage } from "../pages/UserProfilePage/UserProfilePage";
import { GuestReservationsPage } from "../pages/ReservationsPage/GuestReservationsPage";
import { OwnerReservationsPage } from "../pages/ReservationsPage/OwnerReservationsPage";

export const routes: RouteObject[] = [
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/accommodations",
        element: <AccommodationPage />,
      },
      {
        path: "/profile",
        element: <UserProfilePage />,
      },
      {
        path: "/guest/reservations",
        element: <GuestReservationsPage />,
      },
      {
        path: "/owner/reservations",
        element: <OwnerReservationsPage />,
      },
    ],
  },
];
