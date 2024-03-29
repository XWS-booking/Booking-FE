import { RouteObject } from 'react-router-dom';
import App from '../App';
import { AccommodationPage } from '../pages/AccommodationPage/AccommodationPage';
import { UserProfilePage } from '../pages/UserProfilePage/UserProfilePage';
import { GuestReservationsPage } from '../pages/ReservationsPage/GuestReservationsPage';
import { OwnerReservationsPage } from '../pages/ReservationsPage/OwnerReservationsPage';
import { HostPage } from '../pages/HostPage/HostPage';
import { NotificationPage } from '../pages/NotificationsPage/NotificationsPage';
import { ReservationFlightTicketsPage } from '../pages/ReservationFlightTicketsPage';

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '/accommodations',
        element: <AccommodationPage />,
      },
      {
        path: '/profile',
        element: <UserProfilePage />,
      },
      {
        path: '/guest/reservations',
        element: <GuestReservationsPage />,
      },
      {
        path: '/owner/reservations',
        element: <OwnerReservationsPage />,
      },
      {
        path: '/host/:id',
        element: <HostPage />,
      },
      {
        path: '/notifications',
        element: <NotificationPage />,
      },
      {
        path: '/reservation/flight-tickets',
        element: <ReservationFlightTicketsPage></ReservationFlightTicketsPage>,
      },
    ],
  },
];
