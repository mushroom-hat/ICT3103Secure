import React from 'react';
import OrganizationCard from './OrganizationCard';

function ViewOrganizations() {
  return (
    <section>
      <h1>Organizations</h1>
      <div className="organizations-page-container">
        <div className="filters-container">
          <p className="filters-header">Search by category</p>
          <p>Cat1</p>
          <p>Cat2</p>
        </div>
        <div className="organizations-container">
          <p className="organizations-header">Organisations</p>
          <div className="organizations-results">
            <OrganizationCard name="Hopeful Hearts Foundation" description="At Hopeful Hearts Foundation, our mission is to bring positive change to the lives of those in need and create a brighter future for our communities. We believe in the power of compassion, generosity, and unity to make the world a better place." />
            <OrganizationCard name="Hopeful Hearts Foundation" description="At Hopeful Hearts Foundation, our mission is to bring positive change to the lives of those in need and create a brighter future for our communities. We believe in the power of compassion, generosity, and unity to make the world a better place." />
            <OrganizationCard name="Hopeful Hearts Foundation" description="At Hopeful Hearts Foundation, our mission is to bring positive change to the lives of those in need and create a brighter future for our communities. We believe in the power of compassion, generosity, and unity to make the world a better place." />
            <OrganizationCard name="Hopeful Hearts Foundation" description="At Hopeful Hearts Foundation, our mission is to bring positive change to the lives of those in need and create a brighter future for our communities. We believe in the power of compassion, generosity, and unity to make the world a better place." />

          </div>
        </div>
      </div>
    </section>
  )
}

export default ViewOrganizations