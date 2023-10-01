import React from "react";

function OrganizationCard({ name, description }) {
    return (
      <div className="organization-card">
        <div className="picture-circle" >Placeholder</div>
        <span className="organization-card-name">{name}</span>
        <span>{description}</span>
      </div>
    )
  }

  export default OrganizationCard;