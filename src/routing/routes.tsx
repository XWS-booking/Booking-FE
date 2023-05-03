import { RouteObject } from "react-router-dom";
import App from "../App";
import { AccommodationPage } from "../pages/AccommodationPage/AccommodationPage";
import { UserProfilePage } from "../pages/UserProfilePage/UserProfilePage";

export const routes: RouteObject[] = [
    {
        path: '/',
        element: <App />,
        children: [
            {
                path: '/accommodations',
                element: <AccommodationPage/>
            },
            {
                path: '/profile',
                element: <UserProfilePage/>
            }
        ]
    }

]

