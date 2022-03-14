import CollectionList from "./Collection/CollectionList";
import {
    BrowserRouter,
    Routes,
    Route
} from "react-router-dom";



export default function Index() {
    return (
        <div>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<CollectionList/>}>
                    </Route>
                </Routes>
            </BrowserRouter>
        </div>

    )
}