import { RouterProvider } from "react-router";
import { router } from "./routes/router";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import { Toaster } from "./components/ui/sonner";
import { HelmetProvider } from "react-helmet-async";

function App() {
  return (
    <Provider store={store}>
      <HelmetProvider>
        <RouterProvider router={router} />
      </HelmetProvider>
      <Toaster />
    </Provider>
  );
}

export default App;
