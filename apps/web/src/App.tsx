import { Navigate, Route, Routes } from "react-router-dom";
import { AppLayout } from "./components/layout/AppLayout";
import { ShopsPage } from "./pages/ShopsPage";
import { CartPage } from "./pages/CartPage";
import { OrderHistoryPage } from "./pages/OrderHistoryPage";

function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<ShopsPage />} />
        <Route path="cart" element={<CartPage />} />
        <Route path="orders" element={<OrderHistoryPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

export default App;
