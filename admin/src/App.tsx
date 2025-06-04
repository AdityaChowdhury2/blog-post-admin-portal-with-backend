import { RouterProvider } from "react-router"
import { router } from "./routes/router"
import { Provider } from "react-redux"
import { store } from "./redux/store"
import { Toaster } from "./components/ui/sonner"

function App() {
  return (
    <Provider store={store}>
      <RouterProvider router={router} />
      <Toaster />
    </Provider>
  )
}

export default App
