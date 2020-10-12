import React from "react";

export default ({ item, onClick }) => {
  return (
    <div
      onClick={() => {
        onClick(item.link);
      }}
    >
      <div className="jobs-row">
        {item.posted && <div className="jobs-data"> {item.posted} </div>}
        <div className="jobs-data"> {item.position}</div>
        {item.companyName && (
          <div className="jobs-data"> {item.companyName} </div>
        )}
        {item.salary && <div className="jobs-data salary"> {item.salary} </div>}
      </div>
    </div>
  );
};
