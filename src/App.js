import { Route, Routes } from "react-router-dom";
import DetailPage from "./Components/DetailsPage";
import NoMatch from "./Components/NoMatch";
import { SearchPage } from "./Components/SearchPage";

function App() {
  return (
    <Routes>
      <Route exact path="/" element={< SearchPage />} />
      <Route exact path="/details/:id" element={<DetailPage />} />
      <Route path="*" element={<NoMatch />} />
    </Routes>
  );
}

export default App;
