import React from "react";

type Props = {
  isoDate: string;
};

const FormatDate: React.FC<Props> = ({ isoDate }) => {
  const date = new Date(isoDate);

  const day = date.getDate().toString().padStart(2, "0");
  const month = date.toLocaleString("en-US", { month: "short" }); // e.g. Jul
  const year = date.getFullYear();

  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";

  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'

  const time = `${hours}:${minutes} ${ampm}`;
  const formatted = `${day} ${month} ${year} • ${time}`;

  return <span>{formatted}</span>;
};

export default FormatDate;
