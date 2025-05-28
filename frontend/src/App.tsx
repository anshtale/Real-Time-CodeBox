import { BrowserRouter, Route, Routes } from "react-router-dom"
import { Register } from "./pages/Register"
import { CodeEditor } from "./pages/CodeEditor"
import ProtectedRouter from "./middleware/ProtectedRouter"

export const App = ()=>{

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route
          path="/"
          element={<ProtectedRouter children={<CodeEditor />} />}
        />
      </Routes>
    </BrowserRouter>
  )
}
