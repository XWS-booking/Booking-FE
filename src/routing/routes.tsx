import { RouteObject } from "react-router-dom";
import App from "../App";
import { AccommodationPage } from "../pages/AccommodationPage/AccommodationPage";

export const routes: RouteObject[] = [
    {
        path: '/',
        element: <App />,
        children: [
            {
                path: '/accommodations',
                element: <AccommodationPage/>
            }
        ]
    }

]

