"use client";

import { useState } from "react";

interface ConsentCheckboxProps {
  onChange: (checked: boolean) => void;
}

export default function ConsentCheckbox({ onChange }: ConsentCheckboxProps) {
  const [checked, setChecked] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(e.target.checked);
    onChange(e.target.checked);
  };

  return (
    <div style={{ marginBottom: "1.5rem", padding: "1rem", backgroundColor: "#f9fafb", borderRadius: "4px" }}>
      <label style={{ display: "flex", alignItems: "flex-start", cursor: "pointer" }}>
        <input
          type="checkbox"
          checked={checked}
          onChange={handleChange}
          required
          style={{ marginTop: "0.25rem", marginRight: "0.75rem" }}
        />
        <span style={{ fontSize: "0.875rem", lineHeight: 1.5 }}>
          I consent to providing my feedback to ConstiuINT for internal review. 
          I understand that this message will be reviewed by ConstiuINT staff and may be 
          manually forwarded at their discretion. I am not verified as a constituent 
          through this submission, and I understand this is not a direct message to my 
          representatives. <span style={{ color: "#dc2626" }}>*</span>
        </span>
      </label>
    </div>
  );
}
