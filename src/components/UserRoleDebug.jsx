import { useSelector } from "react-redux";
import { useVendorCheck } from "../components/SecurityMonitor";

export default function UserRoleDebug() {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { isVendor } = useVendorCheck();

  if (!isAuthenticated) {
    return (
      <div className="fixed top-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded z-50">
        <strong>Debug:</strong> User not authenticated
      </div>
    );
  }

  return (
    <div className="fixed top-4 right-4 bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded z-50 max-w-md">
      <strong>Debug Info:</strong>
      <br />
      <strong>User:</strong> {user?.first_name || user?.name || "Unknown"}{" "}
      {user?.last_name || ""}
      <br />
      <strong>Email:</strong> {user?.email || "Unknown"}
      <br />
      <strong>Role:</strong> {user?.role || "No role"}
      <br />
      <strong>Is Vendor Flag:</strong> {user?.is_vendor ? "Yes" : "No"}
      <br />
      <strong>Is Vendor (Hook):</strong> {isVendor ? "Yes" : "No"}
      <br />
      <strong>Can Create Events:</strong>{" "}
      {user?.role === "vendor" || user?.is_vendor === true ? "Yes" : "No"}
      <br />
      <small>Full user object: {JSON.stringify(user, null, 2)}</small>
    </div>
  );
}
