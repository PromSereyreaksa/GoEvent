import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateUser } from '../redux/slices/authSlice'; // Adjust this path

function MakeVendorButton() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const handleMakeVendor = () => {
    if (user) {
      // Dispatch the updateUser action with the new role
      dispatch(updateUser({ role: 'vendor' }));
      console.log('User role updated to vendor!');
      // You might want to also update this on your backend if roles are persistent
    } else {
      console.warn('No user is currently logged in.');
    }
  };

  return (
    <div>
      <p>Current User Role: {user?.role || 'Not logged in'}</p>
      {user && user.role !== 'vendor' && (
        <button onClick={handleMakeVendor}>
          Make Me a Vendor
        </button>
      )}
      {user && user.role === 'vendor' && (
        <p>You are already a vendor!</p>
      )}
    </div>
  );
}

export default MakeVendorButton;