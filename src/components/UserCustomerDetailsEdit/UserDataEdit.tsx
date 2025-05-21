import React from "react";

interface UserAuditProps {
  refUserId: number;
}

const UserDataEdit: React.FC<UserAuditProps> = ({ refUserId }) => {
  return (
    <div>
      <div>{refUserId}</div>
    </div>
  );
};

export default UserDataEdit;
