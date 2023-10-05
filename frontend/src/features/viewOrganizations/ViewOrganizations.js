import React, { useEffect, useState } from "react";

const Categories = [
  { categoryName: "Healthcare", isChecked: false },
  { categoryName: "Community", isChecked: false },
  { categoryName: "Environment", isChecked: false },
  { categoryName: "Education", isChecked: false },
];

const OrganizationsData = [
  {
    organizationName: "Hopeful Hearts Foundation",
    description:
      "At Hopeful Hearts Foundation, our mission is to bring positive change to the lives of those in need and create a brighter future for our communities. We believe in the power of compassion, generosity, and unity to make the world a better place.",
    category: "Healthcare",
  },
  {
    organizationName: "Helping Hands Initiative",
    description:
      "Helping Hands Initiative is dedicated to providing assistance and support to underserved communities around the world. Together, we can make a difference and build a more inclusive and equitable society.",
    category: "Community",
  },
  {
    organizationName: "Green Earth Alliance",
    description:
      "The Green Earth Alliance is committed to environmental conservation and sustainable practices. Our goal is to protect our planet and promote eco-friendly solutions for a better future.",
    category: "Environment",
  },
  {
    organizationName: "Youth Empowerment Network",
    description:
      "The Youth Empowerment Network focuses on empowering young people by providing them with the resources and opportunities they need to thrive. Join us in shaping the leaders of tomorrow.",
    category: "Education",
  },
];

function ViewOrganizations() {
  const [allCategories, setAllCategories] = useState(Categories);
  const [selectedCategories, setSelectedCategories] = useState([]);

  function handleChange(categoryName) {
    // Change the corresponding isChecked in the list of all categories
    setAllCategories((prevCategories) =>
      prevCategories.map((category) =>
        category.categoryName === categoryName
          ? { ...category, isChecked: !category.isChecked }
          : category
      )
    );
  }

  useEffect(() => {
    const selectedCategoryNames = allCategories
      .filter((category) => category.isChecked)
      .map((category) => category.categoryName);

    setSelectedCategories(selectedCategoryNames);
  }, [allCategories]);

  useEffect(() => {
    console.log("Selected Categories:", selectedCategories);
  }, [selectedCategories]);

  return (
    <section>
      <h1>Organizations</h1>
      <div className="organizations-page-container">
        <div className="filters-container">
          <h2 className="filters-header">Search by category</h2>
          <div className="filters-list">
            {allCategories.map((category) => (
              <label key={category.categoryName} className="checkbox">
                <input
                  type="checkbox"
                  checked={category.isChecked}
                  onChange={() => handleChange(category.categoryName)}
                />
                <span className="category-text">{category.categoryName}</span>
              </label>
            ))}
          </div>
        </div>
        <div className="organizations-container">
          <h2 className="organizations-header">Organisations</h2>
          <div className="organizations-list">
            {OrganizationsData.filter(
              (organization) =>
                selectedCategories.length === 0 ||
                selectedCategories.includes(organization.category)
            ).map((organization) => (
              <div
                className="organization-card"
                key={organization.organizationName}
              >
                <div className="picture-circle">Logo</div>
                <span className="organization-card-name">
                  {organization.organizationName}
                </span>
                <span>{organization.description}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default ViewOrganizations;
