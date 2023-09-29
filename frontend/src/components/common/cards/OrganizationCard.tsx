interface OrganizationCardProps {
    name: string;
    description: string;
}

function OrganizationCard({name, description}: OrganizationCardProps) {
    return (
        <div className="organization-card">
              <div className="picture-circle" />
              <p>Organization Name</p>
              <p>Organization Description</p>
        </div>
    )
}